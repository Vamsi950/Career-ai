require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Extract text from PDF
const extractTextFromPdf = async (filePath) => {
  try {
    console.log('Attempting to extract text from PDF:', filePath);
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    console.log('Text extraction successful');
    return data.text;
  } catch (error) {
    console.error('Detailed error extracting text from PDF:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

// Extract text from DOCX
const extractTextFromDocx = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

// Analyze resume text with Groq AI (primary - free and fast)
const analyzeResumeWithAI = async (text, jobDescription = '') => {
  try {
    const prompt = `Analyze the following resume${jobDescription ? ' against the provided Job Description' : ''} and provide a detailed analysis in JSON format with the following structure:
    {
      "summary": "A brief summary of the resume${jobDescription ? ' and how it fits the role' : ''}",
      "strengths": ["strength1", "strength2", ...],
      "weaknesses": ["weakness1", "weakness2", ...],
      "skills": {
        "technical": ["skill1", "skill2", ...],
        "soft": ["skill1", "skill2", ...]
      },
      "experience": [
        {
          "title": "Job Title",
          "company": "Company Name",
          "duration": "Duration",
          "description": "Job description"
        }
      ],
      "education": [
        {
          "degree": "Degree Name",
          "institution": "Institution Name",
          "year": "Graduation Year"
        }
      ],
      "improvement_suggestions": ["suggestion1", "suggestion2", ...],
      "missing_keywords": ["keyword1", "keyword2", ...],
      "ats_score": 0-100,
      "overall_assessment": "Detailed overall assessment${jobDescription ? ' of fit for the role' : ''}"
    }

    ${jobDescription ? `Job Description:
    ${jobDescription}
    
    ` : ''}Resume Text: ${text.substring(0, 10000)}`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyzer and ATS optimizer. Provide detailed, constructive feedback in the specified JSON format. Return ONLY valid JSON, no explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const analysis = response.choices[0].message.content;

    // Clean up the response to ensure valid JSON
    let cleanAnalysis = analysis.replace(/```json\n?|\n?```/g, '').trim();

    // Try to extract JSON from the response
    const jsonMatch = cleanAnalysis.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanAnalysis = jsonMatch[0];
    }

    const parsedAnalysis = JSON.parse(cleanAnalysis);

    // Ensure the response has the expected structure
    return {
      summary: parsedAnalysis.summary || 'Resume analysis completed',
      strengths: parsedAnalysis.strengths || [],
      weaknesses: parsedAnalysis.weaknesses || [],
      skills: {
        technical: parsedAnalysis.skills?.technical || [],
        soft: parsedAnalysis.skills?.soft || []
      },
      experience: parsedAnalysis.experience || [],
      education: parsedAnalysis.education || [],
      improvement_suggestions: parsedAnalysis.improvement_suggestions || parsedAnalysis.improvementSuggestions || [],
      missing_keywords: parsedAnalysis.missing_keywords || parsedAnalysis.keywords || [],
      ats_score: parsedAnalysis.ats_score || 75,
      overall_assessment: parsedAnalysis.overall_assessment || parsedAnalysis.overallAssessment || 'Resume analysis completed successfully'
    };
  } catch (error) {
    console.error('Error analyzing resume with Groq:', error);
    throw new Error('Failed to analyze resume with Groq AI');
  }
};

// Fallback to OpenAI if Gemini fails
const analyzeResumeWithOpenAI = async (text, jobDescription = '') => {
  try {
    const prompt = `Analyze the following resume${jobDescription ? ' against the provided Job Description' : ''} and provide a detailed analysis in JSON format with the following structure:
    {
      "summary": "A brief summary of the resume${jobDescription ? ' and how it fits the role' : ''}",
      "strengths": ["strength1", "strength2", ...],
      "weaknesses": ["weakness1", "weakness2", ...],
      "skills": {
        "technical": ["skill1", "skill2", ...],
        "soft": ["skill1", "skill2", ...]
      },
      "experience": [
        {
          "title": "Job Title",
          "company": "Company Name",
          "duration": "Duration",
          "description": "Job description"
        }
      ],
      "education": [
        {
          "degree": "Degree Name",
          "institution": "Institution Name",
          "year": "Graduation Year"
        }
      ],
      "improvement_suggestions": ["suggestion1", "suggestion2", ...],
      "missing_keywords": ["keyword1", "keyword2", ...],
      "ats_score": 0-100,
      "overall_assessment": "Detailed overall assessment${jobDescription ? ' of fit for the role' : ''}"
    }

    ${jobDescription ? `Job Description:
    ${jobDescription}
    
    ` : ''}Resume Text: ${text.substring(0, 10000)}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyzer and ATS optimizer. Provide detailed, constructive feedback in the specified JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const analysis = response.choices[0].message.content;
    return JSON.parse(analysis);
  } catch (error) {
    console.error('Error analyzing resume with OpenAI:', error);
    throw new Error('Failed to analyze resume with AI');
  }
};

// Improve resume text with AI based on analysis and suggestions
const improveResumeWithAI = async (text, analysis) => {
  try {
    const prompt = `Based on the following resume text and the provided analysis, rewrite the resume into a high-end, professional, and impact-driven version.
    
    CRITICAL INSTRUCTION: Your output MUST follow this exact structure using these exact Markdown headers (#):
    
    # Summary
    [A brief, powerful professional summary]

    # Experience
    [List professional experience. Each entry should have:
    **Job Title** | Company Name | Location [Right Aligned Concept] | Date Range
    - Use bullet points (*) with action verbs and metrics.]

    # Projects
    [List key projects. Each entry should have:
    **Project Name** | Technologies Used | Link (if any)
    - Use bullet points (*) for details.]

    # Education
    [List education in this format:
    **Institution Name** | Degree/Major | Location | Dates]

    # Technical Skills
    - **Languages:** [List languages]
    - **Web/Frameworks:** [List web techs]
    - **Tools:** [List tools]
    - **Concepts:** [List core concepts]

    # Certifications
    - [List certifications with bullet points]

    # Achievements
    - [List key achievements with bullet points]

    Focus on:
    1. Using powerful action verbs (e.g., Spearheaded, Orchestrated, Optimized).
    2. Quantifying achievements (e.g., Improved efficiency by 20%).
    3. Addressing the "weaknesses" and "improvement_suggestions" identified in the analysis.
    4. Incorporating relevant "missing_keywords".
    5. Maintaining a clean, crisp professional tone.

    Analysis: ${JSON.stringify(analysis)}
    
    Original Resume Text:
    ${text.substring(0, 8000)}

    Return ONLY the improved resume content in the specified structured Markdown format. Do not include any pre-amble or post-amble.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an elite career coach and expert resume writer specialized in LaTeX-style professional formats. Your goal is to rewrite resumes to be world-class and perfectly structured."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 4000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error improving resume with AI:', error);
    throw new Error('Failed to improve resume with AI');
  }
};

module.exports = {
  extractTextFromPdf,
  extractTextFromDocx,
  analyzeResumeWithAI,
  analyzeResumeWithOpenAI,
  improveResumeWithAI,
};
