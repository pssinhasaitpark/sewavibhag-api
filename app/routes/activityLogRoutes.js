const express = require('express');
const router = express.Router();
const { createActivityLog } = require('../controllers');

router.get('/view-activities', createActivityLog.viewActivities);

module.exports = router;
