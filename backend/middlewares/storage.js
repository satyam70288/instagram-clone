import multer from 'multer';
import fs from 'fs';
import path from 'path';
// import ApiError from '../utils/handler/ApiError.handler.js

const maxFileSize = 30 * 1024 * 1024; // 10 MB (in bytes)
const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "video/mp4",
    "video/x-msvideo",
    "video/x-matroska",
    "video/webm",
    "video/ogg",
    "video/quicktime"
];

// Define the storage engine function with parameters
const uploader = (folderName) => multer.diskStorage({
    destination: (req, file, cb) => {
        // Check if the 'public' directory exists, and create it if it doesn't
        if (!fs.existsSync("public")) {
            try {
                fs.mkdirSync("public");
            } catch (err) {
                return cb(err);
            }
        }
        if (!fs.existsSync(`public/${folderName}`)) {
            try {
                fs.mkdirSync(`public/${folderName}`);
            } catch (err) {
                return cb(err);
            }
        }
        cb(null, `public/${folderName}`);
    },
    filename: (req, file, cb) => {
        const transformedFilename = file.originalname
            .trim() // Trim whitespace
            .toLowerCase() // Convert to lowercase
            .replace(/[^a-z\d.]+/g, "_") // Replace non-alphanumeric characters with underscores
            .replace(/_+/g, "_") // Replace consecutive underscores with a single underscore
            .replace(/\.[^.]+$/, "") // Get everything before the first dot
            .replace(/\./g, "_") // Remove Dot
            .replace(/^_|_$/g, "");

        cb(
            null,
            transformedFilename +
            path.extname(file.originalname)
        );
    },
});

// Define the file filter function with parameters
const fileFilter = (allowedTypes = allowedFileTypes) => (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Allow the file
    } else {
        cb(new Error(400, "File type not allowed")); // Reject the file
    }
};

// Set up the multer storage with parameters and file filter
const storage = (folderName, allowedTypes, options = {}) => multer({
    storage: uploader(folderName || "asset"),
    limits: {
        fileSize: options.fileSize || maxFileSize,
    },
    fileFilter: fileFilter(allowedTypes),
    ...options, // Merge additional options
});
export const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case 'LIMIT_FILE_SIZE':
          return res.status(413).json({ message: 'File size exceeds the maximum limit.' });
        case 'LIMIT_UNEXPECTED_FILE':
          return res.status(400).json({ message: `File type ${err.file?.mimetype} not allowed.` });
        default:
          return res.status(400).json({ message: err.message });
      }
    }
    
    // Handle other errors
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  };
  
  export default storage;
  
  
  
  
  
  
  
  
  
  
  
  
