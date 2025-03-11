const csv = require('csv-parser');
const { Readable } = require('stream');

exports.successResponse = (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        status: 'success',
        message: message || 'Operation completed successfully.',
        data: data,
    });
},

    exports.errorResponse = (res, message, statusCode = 500) => {
        return res.status(statusCode).json({
            message: message.details ? message.details[0] : message || 'An error occurred while processing your request.',
            error: true,
        });
    }


exports.readFiles = (file) => {
    return new Promise((resolve, reject) => {
        try {
            if (!file) {
                reject('No file uploaded.');
                return;
            }

            const fileBuffer = file?.buffer;
            // Convert buffer to a readable stream (needed for csv-parser)
            const readableStream = Readable.from(fileBuffer);

            const results = [];

            readableStream.pipe(csv())
                .on('data', (row) => {
                    results.push(row);
                })
                .on('end', () => {
                    resolve(results);  // Resolve the Promise when done
                })
                .on('error', (err) => {
                    reject(err);  // Reject the Promise if an error occurs
                });
        } catch (error) {
            reject(error);  // Reject the Promise if there's a catch block error
        }
    });
};


// Helper function to map levels
exports.mapLevel = (level, userType) => {
    // Check the userType and map levels accordingly
    switch (userType) {
      case 'kendra':
        if (level === 1) return 'admin';
        return level;
  
      case 'kshetra':
      case 'jila':
        if (level === 1) return 'viewer';
        if (level === 2) return 'admin';
        return level;
  
      case 'prant':
      case 'vibhag':
        if (level === 1) return 'viewer';
        if (level === 2) return 'editor';
        if (level === 3) return 'admin';
        return level;
  
      default:
        return level;
    }
  };