const express = require('express');
const router = express.Router();
const { ReportingForms } = require('../controllers');

// Route to create a new reporting form
router.post('/reporting-forms', ReportingForms.createReportingForm);

// Route to fetch all reporting forms
router.get('/reporting-forms', ReportingForms.getAllReportingForms);

// Route to fetch a single form by its ID
router.get('/reporting-forms/:id', ReportingForms.getReportingFormById);

module.exports = router;
