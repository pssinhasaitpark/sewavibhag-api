const express = require('express');
const router = express.Router();
const { ReportingForms } = require('../controllers');
const { updateReportingForm } = require('../controllers/reportingForm');


// Route to create a new reporting form
router.post('/reporting-forms', ReportingForms.createReportingForm);

// Route to get all reporting forms
// router.get('/reporting-forms', ReportingForms.getAllReportingForms);

// Route to get a specific reporting form by ID
router.get('/reportingFormByJila', ReportingForms.getReportingFormByJila);

router.patch('/reporting-forms/update', updateReportingForm);

module.exports = router; 
