const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const AppError = require('../utils/AppError');

// Create uploads directory path
const uploadPath = process.env.UPLOAD_PATH || './uploads';

/**
 * Configure Multer Storage
 * Saves files with UUID filenames to prevent collisions
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

/**
 * File Filter - Accept only specific file types
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }

  return cb(
    new AppError(
      'Invalid file type. Only JPEG, PNG, GIF, PDF, DOC, and DOCX files are allowed',
      400
    )
  );
};

/**
 * Configure Multer
 */
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024, // 5MB default
  },
  fileFilter,
});

/**
 * Image-only file filter
 */
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }

  return cb(new AppError('Invalid file type. Only image files are allowed', 400));
};

/**
 * Image Upload Configuration
 */
const uploadImage = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
  },
  fileFilter: imageFilter,
});

module.exports = {
  upload,
  uploadImage,
};
