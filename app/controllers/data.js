const { Kendra, Kshetra, Prant, Vibhag, Jila } = require('../models');
const { readFiles } = require('../utils/helper');

// Create Kendra (and other types like kendra, kshetra, prant, etc.)
exports.createKendra = async (req, res) => {
    try {
        const { type } = req.body;
        const file = req.file;
        const fileData = await readFiles(file);  // Get parsed CSV data from file
        
        if (fileData.length === 0) {
            return res.status(400).send('No valid data in the CSV file.');
        }

        let createdItems = [];

        // Determine type and insert data accordingly
        if (type === 'kendra') {
            // Insert many Kendra records
            const kendraData = fileData.map((row) => {
                return { name: row.name }; // Assuming CSV column is 'name'
            });
            createdItems = await Kendra.insertMany(kendraData);
            return res.status(201).json(createdItems);

        } else if (type === 'kshetra') {
            const kshetraData = fileData.map((row) => {
                return {
                    name: row.name, 
                    kendraId: row.kendraId  // Assuming CSV column is 'kendraId'
                };
            });
            createdItems = await Kshetra.insertMany(kshetraData);
            return res.status(201).json(createdItems);

        } else if (type === 'prant') {
            const prantData = fileData.map((row) => {
                return {
                    name: row.name,
                    // kshetraId: row.kshetraId  // Assuming CSV column is 'kshetraId'
                };
            });
            createdItems = await Prant.insertMany(prantData);
            return res.status(201).json(createdItems);

        } else if (type === 'vibhag') {
            const vibhagData = fileData.map((row) => {
                return {
                    name: row.name,
                    prantId: row.prantId  // Assuming CSV column is 'prantId'
                };
            });
            createdItems = await Vibhag.insertMany(vibhagData);
            return res.status(201).json(createdItems);

        } else if (type === 'jila') {
            const jilaData = fileData.map((row) => {
                return {
                    name: row.name,
                    vibhagId: row.vibhagId,   // Assuming CSV column is 'vibhagId'
                    prantId: row.prantId,     // Assuming CSV column is 'prantId'
                    kshetraId: row.kshetraId, // Assuming CSV column is 'kshetraId'
                    kendraId: row.kendraId,   // Assuming CSV column is 'kendraId'
                    reportData: row.reportData // Assuming CSV column is 'reportData'
                };
            });
            
            createdItems = await Jila.insertMany(jilaData);
            return res.status(201).json(createdItems);
        }

    } catch (error) {
        console.error('Error during file processing:', error);
        res.status(500).json({ error: error.message });
    }
};