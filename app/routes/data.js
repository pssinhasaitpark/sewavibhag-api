const express = require('express');
const router = express.Router();
const { data } = require('../controllers');
const { upload } = require('../middlewares/fileHandler');


// Kendra Routes
// POST /kendra route to handle file upload and CSV processing
router.post('/kendra', upload.single('file'), data.createKendra);

module.exports = router;
