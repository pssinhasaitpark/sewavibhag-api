const { default: mongoose } = require('mongoose');
const { Kshetra, Prant, Vibhag, Jila, kendra, kshetra, prant, vibhag, jila } = require('../models');
const { readFiles, successResponse, errorResponse } = require('../utils/helper');

// Create Kendra (and other types like kendra, kshetra, prant, etc.)
exports.createKshetra = async (req, res) => {
    try {
        const { type } = req.body;
        const file = req.file;
        const fileData = await readFiles(file);  // Get parsed CSV data from file

        if (fileData.length === 0) {
            return res.status(400).send('No valid data in the CSV file.');
        }

        let createdItems = [];

        if (type === 'kshetra') {
            const kshetraData = fileData.map((row) => {
                return {
                    kshetra_name: row.Kshetra,
                    kendra_id: row.kendra_id  // Assuming CSV column is 'kendraId'
                };
            });

            createdItems = await kshetra.insertMany(kshetraData);
            return res.status(201).json(createdItems);
        }

    } catch (error) {
        console.error('Error during file processing:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { kendra_name } = req.body;

        const newKendra = new kendra({ kendra_name });
        await newKendra.save();

        successResponse(res, 'Kendra created successfully!', newKendra, 201);

    } catch (error) {
        errorResponse(res, error.message, 500,);
    }
};

// Create Kendra (and other types like kendra, kshetra, prant, etc.)
exports.createPrant = async (req, res) => {
    try {
        const { type } = req.body;
        const file = req.file;
        const fileData = await readFiles(file);  // Get parsed CSV data from file

        if (fileData.length === 0) {
            return res.status(400).send('No valid data in the CSV file.');
        }

        let createdItems = [];

        if (type === 'prant') {
            const prantData = fileData.map((row) => {
                return {
                    prant_name: row.Prant,
                    kshetra_id: row.Kshetra_id,
                    kendra_id: row.kendra_id  // Assuming CSV column is 'kendraId'
                };
            });

            createdItems = await prant.insertMany(prantData);
            return res.status(201).json(createdItems);
        }

    } catch (error) {
        console.error('Error during file processing:', error);
        res.status(500).json({ error: error.message });
    }
};


// Get Prant based on Kshetra ID

exports.getPrant = async (req, res) => {
    try {
        const { kshetra_id } = req.query;

        if (!kshetra_id) {
            return res.status(400).json({ error: "kshetra_id is required" });
        }

        // Convert to ObjectId if needed
        const query = mongoose.Types.ObjectId.isValid(kshetra_id)
            ? { kshetra_id: new mongoose.Types.ObjectId(kshetra_id) } : { kshetra_id };

        const prants = await prant.find(query);

        return res.status(200).json(prants);
    } catch (error) {
        console.error("Error fetching Prant:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get Prant based on Kshetra ID

exports.getAllPrantList = async (req, res) => {
    try {
        const prants = await prant.find();
        return res.status(200).json(prants);
    } catch (error) {
        console.error("Error fetching Prant:", error);
        res.status(500).json({ error: error.message });
    }
};



exports.getKshetra = async (req, res) => {
    try {

        const getKshetraData = await kshetra.find();
        return res.status(200).json(getKshetraData);
    } catch (error) {
        console.error("Error fetching Prant:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.deletePrant = async (req, res) => {
    try {
        const { kshetra_id } = req.query;

        if (!kshetra_id) {
            return res.status(400).json({ error: "kshetra_id is required" });
        }

        // Convert to ObjectId if needed
        const query = mongoose.Types.ObjectId.isValid(kshetra_id)
            ? { kshetra_id: new mongoose.Types.ObjectId(kshetra_id) }
            : { kshetra_id };

        const result = await prant.deleteMany(query);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No matching Prants found to delete" });
        }

        return res.status(200).json({
            message: `${result.deletedCount} Prant(s) deleted successfully`,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error("Error deleting Prant:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.createVibhag = async (req, res) => {
    try {
        const { type } = req.body;
        const file = req.file;
        const fileData = await readFiles(file);  // Get parsed CSV data from file

        if (fileData.length === 0) {
            return res.status(400).send('No valid data in the CSV file.');
        }

        let createdItems = [];

        if (type === 'vibhag') {
            const vibhagData = fileData.map((row) => {
                return {
                    vibhag_name: row.Vibhag,
                    prant_id: row.prant_id,
                    kshetra_id: row.Kshetra_id,
                    kendra_id: row.kendra_id ,
                };
            });

            createdItems = await vibhag.insertMany(vibhagData);
            return res.status(201).json(createdItems);
        }

    } catch (error) {
        console.error('Error during file processing:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.getAllVibhagList = async (req, res) => {
    try {
        const vibhags = await vibhag.find();
        return res.status(200).json(vibhags);
    } catch (error) {
        console.error("Error fetching Prant:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.createJila = async (req, res) => {
    try {
        const { type } = req.body;
        const file = req.file;
        const fileData = await readFiles(file);  // Get parsed CSV data from file

        if (fileData.length === 0) {
            return res.status(400).send('No valid data in the CSV file.');
        }

        let createdItems = [];

        if (type === 'jila') {
            const jilaData = fileData.map((row) => {
                return {
                    jila_name: row.Jila,
                    vibhag_id: row.vibhag_id,
                    prant_id: row.prant_id,
                    kshetra_id: row.Kshetra_id,
                    kendra_id: row.kendra_id ,
                };
            });

            createdItems = await jila.insertMany(jilaData);
            return res.status(201).json(createdItems);
        }

    } catch (error) {
        console.error('Error during file processing:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getJila = async (req, res) => {
    try {
        const { jila_id } = req.query;

        if (!jila_id) {
            return res.status(400).json({ error: "Jila ID is required." });
        }

        // Convert to ObjectId if needed
        const query = mongoose.Types.ObjectId.isValid(jila_id)
            ? { _id: new mongoose.Types.ObjectId(jila_id) }
            : { _id: jila_id };

        const jilaData = await jila.findOne(query)
            .populate('vibhag_id', 'vibhag_name')  
            .populate('prant_id', 'prant_name')   
            .populate('kshetra_id', 'kshetra_name') 
            .populate('kendra_id', 'kendra_name'); 

        if (!jilaData) {
            return res.status(404).json({ error: "Jila not found." });
        }

        return res.status(200).json(jilaData);
    } catch (error) {
        console.error("Error fetching Jila:", error);
        res.status(500).json({ error: error.message });
    }
};


