const { default: mongoose } = require("mongoose");
const { ReportingForm } = require("../models/reportingForm");
const { jila, Users } = require("../models");

// POST: Create new reporting form entry
exports.createReportingForm = async (req, res) => {
    try {

        // Validate jila_id by checking if it exists in the Jilas collection
        const validJila = await jila.findById(req.user.user_type_id);
        if (!validJila) {
            return res.status(403).json({ message: 'Unauthorized: Invalid Jila user' });
        }

        // Destructure the incoming request body
        const { mahanagar, jilaKendra, anyaNagar, villagesOver5000, villagesUnder5000 } = req.body;

        // Combine the form data with jila_id
        const formData = {
            mahanagar,
            jilaKendra,
            anyaNagar,
            villagesOver5000,
            villagesUnder5000,
            jila_id: new mongoose.Types.ObjectId(req.user.user_type_id),
            user_id : new mongoose.Types.ObjectId(req.user.user_id),
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
        const { jila_id } = req.query;

        if (!jila_id) {
            return res.status(400).json({ error: 'Missing required parameter: user_type_id' });
        }

        // Fetch the reporting form entry associated with the given jila_id
        const form = await ReportingForm.findOne({ jila_id: jila_id });

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


exports.updateReportingForm = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { jila_id } = req.query; 

        console.log("user>>", userId);
        

        // Step 1: Find the form by jila_id
        const form = await ReportingForm.findOne({ jila_id });

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        // Step 2: Check if the user is authorized to update the form
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is either a Prant or Vibhag user
        if (!(user.user_type === 'prant' || user.user_type === 'vibhag')) {
            return res.status(403).json({ message: 'Unauthorized: Only Prant and Vibhag users can update the form' });
        }

        // Step 3: Get the fields to update from the request body and match them with the existing structure
        const updateData = {};

        // Ensure fields are only updated within the correct sections
        const { mahanagar, jilaKendra, anyaNagar, villagesOver5000, villagesUnder5000 } = req.body;

        if (mahanagar) {
            // Validate and update only the `mahanagar` fields
            updateData.mahanagar = {
                ...form.mahanagar, // Retain existing data
                ...mahanagar, // Override only the fields provided in the request
            };
        }

        if (jilaKendra) {
            // Validate and update only the `jilaKendra` fields
            updateData.jilaKendra = {
                ...form.jilaKendra, // Retain existing data
                ...jilaKendra, // Override only the fields provided in the request
            };
        }

        if (anyaNagar) {
            // Validate and update only the `anyaNagar` fields
            updateData.anyaNagar = {
                ...form.anyaNagar, // Retain existing data
                ...anyaNagar, // Override only the fields provided in the request
            };
        }

        if (villagesOver5000) {
            // Validate and update only the `villagesOver5000` fields
            updateData.villagesOver5000 = {
                ...form.villagesOver5000, // Retain existing data
                ...villagesOver5000, // Override only the fields provided in the request
            };
        }

        if (villagesUnder5000) {
            // Validate and update only the `villagesUnder5000` fields
            updateData.villagesUnder5000 = {
                ...form.villagesUnder5000, // Retain existing data
                ...villagesUnder5000, // Override only the fields provided in the request
            };
        }

        // Include the updatedBy field
        updateData.updatedBy = userId; // Add the user who is updating the form

        // Step 4: Update the form with the new data (only modified fields)
        const updatedForm = await ReportingForm.findOneAndUpdate(
            { jila_id }, // Find the form by jila_id
            { $set: updateData }, // Only update the fields passed in the body
            { new: true } // Return the updated document
        );

        // Step 5: Send success response
        res.status(200).json({
            message: 'Form data successfully updated!',
            data: updatedForm,
        });

    } catch (error) {
        console.error('Error updating form data:', error);
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
