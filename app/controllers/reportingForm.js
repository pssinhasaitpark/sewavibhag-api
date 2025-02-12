const { default: mongoose } = require("mongoose");
const { ReportingForm } = require("../models/reportingForm");

// POST: Create new reporting form entry
exports.createReportingForm = async (req, res) => {
    try {
        // Destructure the incoming request body
        const { mahanagar, jilaKendra, anyaNagar, villagesOver5000, villagesUnder5000 } = req.body;

        // Combine the form data with jila_id
        const formData = { 
            mahanagar, 
            jilaKendra, 
            anyaNagar, 
            villagesOver5000, 
            villagesUnder5000, 
            user_type_id: new mongoose.Types.ObjectId(req.user.user_type_id),
        };

        // Create a new ReportingForm instance
        const newForm = new ReportingForm(formData);

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
exports.getReportingFormByJila = async (req, res) => {
    try {
        // Extract the jila_id from the URL parameters
        const { user_type_id } = req.query;

        if (!user_type_id) {
            return res.status(400).json({ error: 'Missing required parameter: user_type_id' });
        }

        // Fetch the reporting form entry associated with the given jila_id
        const form = await ReportingForm.findOne({ user_type_id: user_type_id });

        if (!form) {
            return res.status(404).json({ error: 'Reporting form not found for the given jila_id' });
        }

        // Send a success response with the fetched form 
        res.status(200).json({
            message: 'Reporting form fetched successfully',
            data: form,
        });
    } catch (error) {
        console.error('Error fetching form data:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};




exports.getAll = async (req, res) => {
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
