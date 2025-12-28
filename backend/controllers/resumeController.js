const Resume = require('../models/Resume');
const ErrorResponse = require('../utils/errorResponse');
const resumeService = require('../services/resumeService');
const path = require('path');
const fs = require('fs').promises;

const getFallbackAnalysis = (reason) => ({
  summary: 'AI analysis unavailable.',
  strengths: [],
  weaknesses: [],
  skills: { technical: [], soft: [] },
  experience: [],
  education: [],
  improvement_suggestions: [],
  missing_keywords: [],
  ats_score: 0,
  overall_assessment: reason || 'AI analysis could not be completed at this time.',
});

const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI analysis timed out')), ms)
    ),
  ]);
};

// @desc    Upload and analyze resume
// @route   POST /api/v1/resumes
// @access  Private
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    const fileExt = path.extname(req.file.originalname).toLowerCase().substring(1);
    let extractedText = '';

    // Extract text based on file type
    if (fileExt === 'pdf') {
      extractedText = await resumeService.extractTextFromPdf(req.file.path);
    } else if (fileExt === 'docx') {
      extractedText = await resumeService.extractTextFromDocx(req.file.path);
    } else {
      // Clean up the uploaded file if not PDF/DOCX (should be caught by multer, but just in case)
      await fs.unlink(req.file.path);
      return next(new ErrorResponse('File type not supported', 400));
    }

    // Analyze the extracted text with AI (try Groq first, then Gemini, then OpenAI)
    let analysis;
    try {
      analysis = await withTimeout(
        resumeService.analyzeResumeWithAI(extractedText),
        10000
      );
    } catch (groqError) {
      console.log('Groq AI failed, trying Gemini fallback:', groqError.message);
      try {
        analysis = await withTimeout(
          resumeService.analyzeResumeWithOpenAI(extractedText),
          15000
        );
      } catch (openaiError) {
        console.log('OpenAI also failed, using fallback analysis:', openaiError.message);
        analysis = getFallbackAnalysis(`Groq: ${groqError.message}, OpenAI: ${openaiError.message}`);
      }
    }

    // Save to database
    const resume = await Resume.create({
      user: req.user.id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: fileExt,
      extractedText: extractedText.substring(0, 10000), // Store first 10000 chars
      analysis,
    });

    res.status(201).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    // Clean up the uploaded file in case of error
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    next(error);
  }
};

// @desc    Get all resumes for logged in user
// @route   GET /api/v1/resumes
// @access  Private
exports.getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('-extractedText');

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume
// @route   GET /api/v1/resumes/:id
// @access  Private
exports.getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return next(
        new ErrorResponse(`Resume not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume
// @route   DELETE /api/v1/resumes/:id
// @access  Private
exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return next(
        new ErrorResponse(`Resume not found with id of ${req.params.id}`, 404)
      );
    }

    // Delete the file from the filesystem
    try {
      await fs.unlink(resume.filePath);
    } catch (err) {
      console.error(`Error deleting file ${resume.filePath}:`, err);
      // Continue even if file deletion fails
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
