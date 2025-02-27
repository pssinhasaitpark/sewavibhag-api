const { default: mongoose } = require('mongoose');
const { kendra, kshetra, prant, vibhag, jila } = require('../models');
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
                    kendra_id: row.kendra_id,
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
                    kendra_id: row.kendra_id,
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

        // Convert to ObjectId if valid
        const objectId = mongoose.Types.ObjectId.isValid(jila_id) ? new mongoose.Types.ObjectId(jila_id) : jila_id;

        const jilaData = await jila.aggregate([
            { $match: { _id: objectId } }, // Filter by Jila ID
            {
                $lookup: {
                    from: "vibhags",
                    localField: "vibhag_id",
                    foreignField: "_id",
                    as: "vibhag"
                }
            },
            {
                $lookup: {
                    from: "prants",
                    localField: "prant_id",
                    foreignField: "_id",
                    as: "prant"
                }
            },
            {
                $lookup: {
                    from: "kshetras",
                    localField: "kshetra_id",
                    foreignField: "_id",
                    as: "kshetra"
                }
            },
            {
                $lookup: {
                    from: "kendras",
                    localField: "kendra_id",
                    foreignField: "_id",
                    as: "kendra"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    jila_name: { $first: "$jila_name" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    vibhag: {
                        $first: {
                            _id: { $arrayElemAt: ["$vibhag._id", 0] },
                            name: { $arrayElemAt: ["$vibhag.vibhag_name", 0] }
                        }
                    },
                    prant: {
                        $first: {
                            _id: { $arrayElemAt: ["$prant._id", 0] },
                            name: { $arrayElemAt: ["$prant.prant_name", 0] }
                        }
                    },
                    kshetra: {
                        $first: {
                            _id: { $arrayElemAt: ["$kshetra._id", 0] },
                            name: { $arrayElemAt: ["$kshetra.kshetra_name", 0] }
                        }
                    },
                    kendra: {
                        $first: {
                            _id: { $arrayElemAt: ["$kendra._id", 0] },
                            name: { $arrayElemAt: ["$kendra.kendra_name", 0] }
                        }
                    }
                }
            }
        ]);

        if (!jilaData.length) {
            return res.status(404).json({ error: "Jila not found." });
        }

        return res.status(200).json(jilaData[0]); 
    } catch (error) {
        console.error("Error fetching Jila:", error);
        return res.status(500).json({ error: error.message });
    }
};

exports.getHierarchy = async (req, res) => {
    try {
        const hierarchyData = await kendra.aggregate([
            // Lookup Kshetra Data (Find Kshetras under Kendra)
            {
                $lookup: {
                    from: "kshetras",
                    localField: "_id",
                    foreignField: "kendra_id",
                    as: "kshetras",
                },
            },

            // Lookup Prants for each Kshetra
            {
                $lookup: {
                    from: "prants",
                    localField: "kshetras._id",
                    foreignField: "kshetra_id",
                    as: "prants",
                },
            },

            // Lookup Vibhags for each Prant
            {
                $lookup: {
                    from: "vibhags",
                    localField: "prants._id",
                    foreignField: "prant_id",
                    as: "vibhags",
                },
            },

            // Lookup Jilas for each Vibhag
            {
                $lookup: {
                    from: "jilas",
                    localField: "vibhags._id",
                    foreignField: "vibhag_id",
                    as: "jilas",
                },
            },
             // Lookup Reporting Forms for each Jila
             {
                $lookup: {
                    from: "reportingforms",
                    localField: "jilas._id",
                    foreignField: "jila_id",
                    as: "reportingForms",
                },
            },

            // Restructure Data for Hierarchy
            {
                $project: {
                    _id: 1,
                    kendra_name: 1,
                    total_kshetras: { $size: "$kshetras" }, // Count of Kshetras
                    kshetras: {
                        $map: {
                            input: "$kshetras",
                            as: "kshetra",
                            in: {
                                _id: "$$kshetra._id",
                                kshetra_name: "$$kshetra.kshetra_name",
                                total_prants: {
                                    $size: {
                                        $filter: {
                                            input: "$prants",
                                            as: "prant",
                                            cond: { $eq: ["$$prant.kshetra_id", "$$kshetra._id"] },
                                        },
                                    },
                                },
                                prants: {
                                    $map: {
                                        input: {
                                            $filter: {
                                                input: "$prants",
                                                as: "prant",
                                                cond: { $eq: ["$$prant.kshetra_id", "$$kshetra._id"] },
                                            },
                                        },
                                        as: "prant",
                                        in: {
                                            _id: "$$prant._id",
                                            prant_name: "$$prant.prant_name",
                                            total_vibhags: {
                                                $size: {
                                                    $filter: {
                                                        input: "$vibhags",
                                                        as: "vibhag",
                                                        cond: { $eq: ["$$vibhag.prant_id", "$$prant._id"] },
                                                    },
                                                },
                                            },
                                            vibhags: {
                                                $map: {
                                                    input: {
                                                        $filter: {
                                                            input: "$vibhags",
                                                            as: "vibhag",
                                                            cond: { $eq: ["$$vibhag.prant_id", "$$prant._id"] },
                                                        },
                                                    },
                                                    as: "vibhag",
                                                    in: {
                                                        _id: "$$vibhag._id",
                                                        vibhag_name: "$$vibhag.vibhag_name",
                                                        total_jilas: {
                                                            $size: {
                                                                $filter: {
                                                                    input: "$jilas",
                                                                    as: "jila",
                                                                    cond: { $eq: ["$$jila.vibhag_id", "$$vibhag._id"] },
                                                                },
                                                            },
                                                        },
                                                        jilas: {
                                                            $map: {
                                                                input: {
                                                                    $filter: {
                                                                        input: "$jilas",
                                                                        as: "jila",
                                                                        cond: { $eq: ["$$jila.vibhag_id", "$$vibhag._id"] },
                                                                    },
                                                                },
                                                                as: "jila",
                                                                in: {
                                                                    _id: "$$jila._id",
                                                                    jila_name: "$$jila.jila_name",
                                                                    reporting_form: {
                                                                        $let: {
                                                                            vars: {
                                                                                reportingForm: {
                                                                                    $arrayElemAt: [
                                                                                        {
                                                                                            $filter: {
                                                                                                input: "$reportingForms",  // The field containing the reporting forms for jilas
                                                                                                as: "form",
                                                                                                cond: { $eq: ["$$form.jila_id", "$$jila._id"] }
                                                                                            }
                                                                                        },
                                                                                        0
                                                                                    ]
                                                                                }
                                                                            },
                                                                            in: "$$reportingForm"
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        ]);
        
        return res.status(200).json(hierarchyData);
    } catch (error) {
        console.error("Error fetching hierarchy:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getPrantAndVibahgsHierarchy = async (req, res) => {
    try {
        // Extract user_type, user_id, and user_type_id from query parameters
        const { user_type, id, user_type_id } = req.user;

        if (!user_type || !id || !user_type_id) {
            return res.status(400).json({ error: 'Missing required query parameters: user_type, user_id, and user_type_id' });
        }

        let matchStage = {};
        let projectStage = {};

        // Handle filtering and projection for prant, vibhag, and jila models
        if (user_type === 'prant') {
            // If user is of type 'prant', filter by prant_id and include related vibhags and jilas
            matchStage = { "_id": new mongoose.Types.ObjectId(user_type_id) };  // Assuming user_type_id corresponds to prant_id

            projectStage = {
                _id: 1,
                prant_name: 1,
                total_vibhags: {
                    $size: {
                        $filter: {
                            input: "$vibhags",  // Assuming `vibhags` is an array of vibhags related to the prant
                            as: "vibhag",
                            cond: { $eq: ["$$vibhag.prant_id", new mongoose.Types.ObjectId(user_type_id)] },
                        },
                    },
                },
                vibhags: {
                    $map: {
                        input: {
                            $filter: {
                                input: "$vibhags",
                                as: "vibhag",
                                cond: { $eq: ["$$vibhag.prant_id", new mongoose.Types.ObjectId(user_type_id)] },
                            },
                        },
                        as: "vibhag",
                        in: {
                            _id: "$$vibhag._id",
                            vibhag_name: "$$vibhag.vibhag_name",
                            total_jilas: {
                                $size: {
                                    $filter: {
                                        input: "$jilas", // Assuming jilas are related to vibhags
                                        as: "jila",
                                        cond: { $eq: ["$$jila.vibhag_id", "$$vibhag._id"] },
                                    },
                                },
                            },
                            jilas: {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$jilas",  // Assuming `jilas` is an array of jilas related to the vibhag
                                            as: "jila",
                                            cond: { $eq: ["$$jila.vibhag_id", "$$vibhag._id"] },
                                        },
                                    },
                                    as: "jila",
                                    in: {
                                        _id: "$$jila._id",
                                        jila_name: "$$jila.jila_name",
                                    },
                                },
                            },
                        },
                    },
                },
            };
        }
        else if (user_type === 'vibhag') {
            // // If user is of type 'vibhag', filter by vibhag_id and include related jilas
            // matchStage = { "_id": new mongoose.Types.ObjectId(user_type_id) };  // Assuming user_type_id corresponds to vibhag_id

            // projectStage = {
            //     _id: 1,
            //     vibhag_name: 1,
            //     total_jilas: {
            //         $size: {
            //             $filter: {
            //                 input: "$jilas",  // Assuming jilas is an array in the vibhag model
            //                 as: "jila",
            //                 cond: { $eq: ["$$jila.vibhag_id", new mongoose.Types.ObjectId(user_type_id)] },
            //             },
            //         },
            //     },
            //     jilas: {
            //         $map: {
            //             input: {
            //                 $filter: {
            //                     input: "$jilas",
            //                     as: "jila",
            //                     cond: { $eq: ["$$jila.vibhag_id", new mongoose.Types.ObjectId(user_type_id)] },
            //                 },
            //             },
            //             as: "jila",
            //             in: {
            //                 _id: "$$jila._id",
            //                 jila_name: "$$jila.jila_name",
            //             },
            //         },
            //     },
            // };

            // If user is of type 'vibhag', return jilas for the given vibhag_id
            const jilas = await jila.find({ vibhag_id: user_type_id });

            return res.status(200).json({
                message: 'Jilas retrieved successfully!',
                data: jilas,
            });
        }

        // Perform aggregation on Prants, Vibhags, or Jilas
        const hierarchyData = await prant.aggregate([
            // Lookup Vibhags for each Prant
            {
                $lookup: {
                    from: "vibhags",  
                    localField: "_id",  
                    foreignField: "prant_id", 
                    as: "vibhags",
                },
            },

            // Lookup Jilas for each Vibhag
            {
                $lookup: {
                    from: "jilas",  
                    localField: "vibhags._id",  
                    foreignField: "vibhag_id",
                    as: "jilas",
                },
            },

            // Match user-related data based on user type
            { $match: matchStage },

            // Restructure the data based on user type
            { $project: projectStage },
        ]);

        return res.status(200).json(hierarchyData);

    } catch (error) {
        console.error("Error fetching hierarchy:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.getkshetraHierarchy = async (req, res) => {
    try {
        // Extract user_type, user_id, and user_type_id from query parameters
        const { user_type, id, user_type_id } = req.user;

        if (!user_type || !id || !user_type_id) {
            return res.status(400).json({ error: 'Missing required query parameters: user_type, user_id, and user_type_id' });
        }

        let matchStage = {};
        let projectStage = {};

        // Handle filtering and projection for kshetra, prant, vibhag, and jila models
        if (user_type === 'kshetra') {
            // If user is of type 'kshetra', filter by kshetra_id and include related prants, vibhags, and jilas
            matchStage = { "_id": new mongoose.Types.ObjectId(user_type_id) };  // Assuming user_type_id corresponds to kshetra_id

            projectStage = {
                _id: 1,
                kshetra_name: 1,
                total_prants: {
                    $size: {
                        $filter: {
                            input: "$prants",  // Assuming `prants` is an array of prants related to the kshetra
                            as: "prant",
                            cond: { $eq: ["$$prant.kshetra_id", new mongoose.Types.ObjectId(user_type_id)] },
                        },
                    },
                },
                prants: {
                    $map: {
                        input: {
                            $filter: {
                                input: "$prants", 
                                as: "prant",
                                cond: { $eq: ["$$prant.kshetra_id", new mongoose.Types.ObjectId(user_type_id)] },
                            },
                        },
                        as: "prant",
                        in: {
                            _id: "$$prant._id",
                            prant_name: "$$prant.prant_name",
                            total_vibhags: {
                                $size: {
                                    $filter: {
                                        input: "$vibhags", 
                                        as: "vibhag",
                                        cond: { $eq: ["$$vibhag.prant_id", "$$prant._id"] },
                                    },
                                },
                            },
                            vibhags: {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$vibhags", 
                                            as: "vibhag",
                                            cond: { $eq: ["$$vibhag.prant_id", "$$prant._id"] },
                                        },
                                    },
                                    as: "vibhag",
                                    in: {
                                        _id: "$$vibhag._id",
                                        vibhag_name: "$$vibhag.vibhag_name",
                                        total_jilas: {
                                            $size: {
                                                $filter: {
                                                    input: "$jilas", 
                                                    as: "jila",
                                                    cond: { $eq: ["$$jila.vibhag_id", "$$vibhag._id"] },
                                                },
                                            },
                                        },
                                        jilas: {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: "$jilas",  
                                                        as: "jila",
                                                        cond: { $eq: ["$$jila.vibhag_id", "$$vibhag._id"] },
                                                    },
                                                },
                                                as: "jila",
                                                in: {
                                                    _id: "$$jila._id",
                                                    jila_name: "$$jila.jila_name",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            };
        }
        else if (user_type === 'prant') {
            // If user is of type 'prant', filter by prant_id and include related vibhags and jilas
            matchStage = { "_id": new mongoose.Types.ObjectId(user_type_id) };  // Assuming user_type_id corresponds to prant_id

            projectStage = {
                _id: 1,
                prant_name: 1,
                total_vibhags: {
                    $size: {
                        $filter: {
                            input: "$vibhags", 
                            as: "vibhag",
                            cond: { $eq: ["$$vibhag.prant_id", new mongoose.Types.ObjectId(user_type_id)] },
                        },
                    },
                },
                vibhags: {
                    $map: {
                        input: {
                            $filter: {
                                input: "$vibhags", 
                                as: "vibhag",
                                cond: { $eq: ["$$vibhag.prant_id", new mongoose.Types.ObjectId(user_type_id)] },
                            },
                        },
                        as: "vibhag",
                        in: {
                            _id: "$$vibhag._id",
                            vibhag_name: "$$vibhag.vibhag_name",
                            total_jilas: {
                                $size: {
                                    $filter: {
                                        input: "$jilas", 
                                        as: "jila",
                                        cond: { $eq: ["$$jila.vibhag_id", "$$vibhag._id"] },
                                    },
                                },
                            },
                            jilas: {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$jilas", 
                                            as: "jila",
                                            cond: { $eq: ["$$jila.vibhag_id", "$$vibhag._id"] },
                                        },
                                    },
                                    as: "jila",
                                    in: {
                                        _id: "$$jila._id",
                                        jila_name: "$$jila.jila_name",
                                    },
                                },
                            },
                        },
                    },
                },
            };
            
        }
        
        else if (user_type === 'vibhag') {
            // If user is of type 'vibhag', return jilas for the given vibhag_id
            const jilas = await jila.find({ vibhag_id: user_type_id });

            return res.status(200).json({
                message: 'Jilas retrieved successfully!',
                data: jilas,
            });
        }

        // Perform aggregation on Kshetras, Prants, Vibhags, or Jilas
        const hierarchyData = await kshetra.aggregate([
            // Lookup Prants for each Kshetra
            {
                $lookup: {
                    from: "prants",  
                    localField: "_id",  
                    foreignField: "kshetra_id", 
                    as: "prants",
                },
            },

                // Lookup Vibhags for each Prant
                {
                    $lookup: {
                        from: "vibhags",  
                        localField: "prants._id",  
                        foreignField: "prant_id", 
                        as: "vibhags",
                    },
                },

                // Lookup Jilas for each Vibhag
                {
                    $lookup: {
                        from: "jilas",  
                        localField: "vibhags._id",  
                        foreignField: "vibhag_id", 
                        as: "jilas",
                    },
                },

                // Match user-related data based on user type
                { $match: matchStage },

                // Restructure the data based on user type
                { $project: projectStage },
            ]);

        return res.status(200).json(hierarchyData);

    } catch (error) {
        console.error("Error fetching hierarchy:", error);
        res.status(500).json({ error: error.message });
    }
};






