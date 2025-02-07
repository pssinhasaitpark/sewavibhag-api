// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Set up the storage for multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');  // Store files temporarily in the uploads folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Unique filename based on timestamp
//     }
// });

// // File filter to accept only images
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only image files are allowed!'), false);
//     }
// };

const storage = multer.memoryStorage();




// Set up multer with the storage and file filter
exports.upload = multer({ storage });


