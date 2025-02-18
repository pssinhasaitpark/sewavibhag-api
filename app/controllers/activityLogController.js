const fs = require('fs');
const path = require('path');
const logsFilePath = path.resolve(__dirname, '..', '..', 'activity_logs.log');
const Kshetra = require('../models/kshetra');
const Prant = require('../models/prant');
const Vibhag = require('../models/vibhag');
const Jila = require('../models/jila');

exports.viewActivities = async (req, res) => {
    try {
        // const currentUser = req.user;
        const { action } = req.query;

        const filterCriteria = {};

        if (action) {
            filterCriteria.action = action;
        }

        // Handle user type based on roles and levels
        /*
        if (currentUser.user_type === 'kendra') {
            if (currentUser.level === 1 || currentUser.level === 2) {
                filterCriteria.user_type = ['kshetra', 'prant', 'vibhag', 'jila'];
            } else {
                return res.status(403).json({ message: 'Unauthorized: Insufficient level to view logs' });
            }
        } else if (currentUser.user_type === 'kshetra') {
            if (currentUser.level >= 2) {
                filterCriteria.user_type = ['prant', 'vibhag', 'jila'];
            } else {
                return res.status(403).json({ message: 'Unauthorized: Kshetra level 1 cannot view logs' });
            }
        } else if (currentUser.user_type === 'prant') {
            if (currentUser.level === 3) {
                filterCriteria.user_type = ['vibhag', 'jila'];
            } else {
                return res.status(403).json({ message: 'Unauthorized: Prant level 1 & 2 cannot view logs' });
            }
        } else if (currentUser.user_type === 'vibhag') {
            if (currentUser.level === 3) {
                filterCriteria.user_type = ['jila'];
            } else {
                return res.status(403).json({ message: 'Unauthorized: Vibhag level 1 & 2 cannot view logs' });
            }
        } else if (currentUser.user_type === 'jila') {
            return res.status(403).json({ message: 'Unauthorized: Jila users cannot view logs' });
        }
*/
        // Read the log file
        fs.readFile(logsFilePath, 'utf8', async (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Error reading log file', error: err });
            }

            // Parse logs from file (assuming logs are stored as JSON objects in a newline-delimited format)
            const logs = data.trim().split('\n').map(line => {
                try {
                    return JSON.parse(line);
                } catch (parseError) {
                    console.error('Error parsing log line:', parseError);
                    return null;
                }
            }).filter(log => log !== null);

            // Helper function to get the name from relevant collection based on user_type
            const getUserTypeName = async (user_type, user_type_id) => {
                let name = '';
                try {
                    if (user_type === 'kshetra') {
                        const kshetra = await Kshetra.findById(user_type_id);
                        name = kshetra ? kshetra.kshetra_name : 'N/A';
                    } else if (user_type === 'prant') {
                        const prant = await Prant.findById(user_type_id);
                        name = prant ? prant.prant_name : 'N/A';
                    } else if (user_type === 'vibhag') {
                        const vibhag = await Vibhag.findById(user_type_id);
                        name = vibhag ? vibhag.vibhag_name : 'N/A';
                    } else if (user_type === 'jila') {
                        const jila = await Jila.findById(user_type_id);
                        name = jila ? jila.jila_name : 'N/A';
                    }
                } catch (error) {
                    console.error(`Error fetching name for ${user_type}:`, error);
                    name = 'N/A';
                }
                return name;
            };

            // Filter logs and attach names based on user_type_id
            const filteredLogs = [];

            for (let log of logs) {
                let matches = true;

                if (filterCriteria.action && log.message.action !== filterCriteria.action) {
                    matches = false;
                }

                if (filterCriteria.user_type && !filterCriteria.user_type.includes(log.message.user_type)) {
                    matches = false;
                }

                if (matches) {
                    // Get the user name based on the user type and user_type_id
                    const userTypeName = await getUserTypeName(log.message.user_type, log.message.user_type_id);
                    log.message.user_field_name = userTypeName; // Add the name to the log
                    filteredLogs.push(log);
                }
            }

            // Return the filtered logs
            res.status(200).json({
                message: 'Activity logs fetched successfully',
                logs: filteredLogs
            });
        });
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


