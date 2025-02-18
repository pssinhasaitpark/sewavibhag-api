const { default: mongoose } = require("mongoose");
const { ReportingForm } = require("../models/reportingForm");
const { jila, Users } = require("../models");
const logActivity = require('../utils/logger');

// POST: Create new reporting form entry
exports.createReportingForm = async (req, res) => {
    try {

        // Check if the user level is 2
        if (req.user.level !== 2) {
            return res.status(403).json({ message: 'Unauthorized: Only Jila Level 2 users can create the form' });
        }

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
            user_id: new mongoose.Types.ObjectId(req.user.user_id),
        };

        // Create a new ReportingForm instance
        const newForm = new ReportingForm(formData);

        // Save the new form data to the database
        const savedForm = await newForm.save();

        const logMessage = {
            username: req.user.username,
            user_type: req.user.user_type,
            action: 'created_form',
            ip_address: req.ip || req.connection.remoteAddress,
            target_user: 'N/A',
            target_form: savedForm._id.toString(),
            user_level: req.user.level,
            user_type_id:req.user.user_type_id,
            timestamp: new Date().toISOString(),
        };

        // Log the activity (you can define logActivity to store the log in your database or file)
        logActivity(logMessage);

        // Send a success response
        res.status(201).json({ message: 'Form data successfully saved!', data: savedForm, });
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
            return res.status(400).json({ error: 'Missing required parameter: jila_id' });
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

        // Step 3: Check if the user is either a Prant or Vibhag user with level 2 or 3
        if (user.user_type === 'prant') {
            if (![2, 3].includes(req.user.level)) {
                return res.status(403).json({ message: 'Unauthorized: Only Prant users with level 2 or 3 can update the form' });
            }
        } else if (user.user_type === 'vibhag') {
            if (![2, 3].includes(req.user.level)) {
                return res.status(403).json({ message: 'Unauthorized: Only Vibhag users with level 2 or 3 can update the form' });
            }
        } else {
            return res.status(403).json({ message: 'Unauthorized: Only Prant and Vibhag users can update the form' });
        }
        // Step 4: Get the fields to update from the request body and match them with the existing structure
        const updateData = {};

        // Ensure fields are only updated within the correct sections
        const { mahanagar, jilaKendra, anyaNagar, villagesOver5000, villagesUnder5000 } = req.body;

        if (mahanagar) {
            // Validate and update only the `mahanagar` fields
            updateData.mahanagar = {
                ...form.mahanagar,
                ...mahanagar,
            };
        }

        if (jilaKendra) {
            // Validate and update only the `jilaKendra` fields
            updateData.jilaKendra = {
                ...form.jilaKendra,
                ...jilaKendra,
            };
        }

        if (anyaNagar) {
            // Validate and update only the `anyaNagar` fields
            updateData.anyaNagar = {
                ...form.anyaNagar,
                ...anyaNagar,
            };
        }

        if (villagesOver5000) {
            // Validate and update only the `villagesOver5000` fields
            updateData.villagesOver5000 = {
                ...form.villagesOver5000,
                ...villagesOver5000,
            };
        }

        if (villagesUnder5000) {
            // Validate and update only the `villagesUnder5000` fields
            updateData.villagesUnder5000 = {
                ...form.villagesUnder5000,
                ...villagesUnder5000,
            };
        }

        // Include the updatedBy field
        updateData.updatedBy = userId;

        // Step 4: Update the form with the new data (only modified fields)
        const updatedForm = await ReportingForm.findOneAndUpdate(
            { jila_id },
            { $set: updateData },
            { new: true }
        );

        // Log the activity (form update)
        const logMessage = {
            username: req.user.username,  
            user_type: req.user.user_type,  
            action: 'updated_form', 
            ip_address: req.ip || req.connection.remoteAddress,  
            target_user: 'N/A',  
            target_form: updatedForm._id.toString(),  
            user_level: req.user.level, 
            user_type_id:req.user.user_type_id,
            timestamp: new Date().toISOString(),  
        };

        // Log the activity (You can implement logActivity to save it in the database or file)
        logActivity(logMessage);  

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
