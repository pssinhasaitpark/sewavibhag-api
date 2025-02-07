const { ReportingForm } = require("../models/reportingForm");

// POST: Create new reporting form entry
exports.createReportingForm = async (req, res) => {
    try {
        // Destructure the incoming request body
        const { mahanagar, jilaKendra, anyaNagar, villagesOver5000, villagesUnder5000 } = req.body;

        // Create a new instance of the ReportingForm model
        const newForm = new ReportingForm({
            mahanagar,
            jilaKendra,
            anyaNagar,
            villagesOver5000,
            villagesUnder5000,
        });

        // Save the new form data to the database
        const savedForm = await newForm.save();

        // Send a success response
        res.status(201).json({
            message: 'Form data successfully saved!',
            data: savedForm,
        });
    } catch (error) {
        console.error('Error saving form data:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// GET: Fetch all reporting form entries

exports.getAllReportingForms = async (req, res) => {
    try {
        // Fetch all form entries from the database
        const forms = await ReportingForm.find();

        // Send a success response with the fetched forms
        res.status(200).json({
            message: 'All form entries fetched successfully',
            data: forms,
        });
    } catch (error) {
        console.error('Error fetching form data:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// GET: Fetch a specific form by ID
exports.getReportingFormById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the form by its ID
        const form = await ReportingForm.findById(id);

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        // Send a success response with the form data
        res.status(200).json({
            message: 'Form fetched successfully',
            data: form,
        });
    } catch (error) {
        console.error('Error fetching form by ID:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
