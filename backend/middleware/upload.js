const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter to allow only PDF and DOCX files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.pdf', '.docx'];
  const allowedMimes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const extOk = allowedExts.includes(ext);
  const mimeOk = allowedMimes.includes(file.mimetype);

  if (extOk && mimeOk) {
    return cb(null, true);
  } else {
    cb(
      new ErrorResponse(
        'File upload only supports the following filetypes - PDF and DOCX',
        400
      ),
      false
    );
  }
};

// Initialize multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
