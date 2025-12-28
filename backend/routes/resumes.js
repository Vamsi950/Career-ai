const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  uploadResume,
  getResumes,
  getResume,
  deleteResume,
  improveResume,
} = require('../controllers/resumeController');

// All routes are protected and require authentication
router.use(protect);

// Route for file upload and analysis
router.post('/', upload.single('resume'), uploadResume);

// Route for AI resume improvement
router.post('/:id/improve', improveResume);

// Get all resumes for the logged-in user
router.get('/', getResumes);

// Get a single resume by ID
router.get('/:id', getResume);

// Delete a resume
router.delete('/:id', deleteResume);

module.exports = router;
