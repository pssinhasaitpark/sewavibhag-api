const express = require('express');
const router = express.Router();
const { data } = require('../controllers');
const { upload } = require('../middlewares/fileHandler');


// Kendra Routes
// POST /kendra route to handle file upload and CSV processing
router.post('/kendra', data.create);

router.post('/kshetra', upload.single('file'), data.createKshetra);
router.post('/prant', upload.single('file'), data.createPrant);
router.post('/vibhag', upload.single('file'), data.createVibhag);

router.get('/prant', data.getPrant);

router.get('/allPrant', data.getAllPrantList);

router.get('/kshetra', data.getKshetra);


router.delete('/prant', data.deletePrant);





module.exports = router;
