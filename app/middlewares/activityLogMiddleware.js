const logActivity = require('../utils/logger');

// Activity log middleware to capture IP and action
const activityLogMiddleware = (req, res, next) => {
  const { username, user_type, action, target_user, target_form,user_level,user_type_id } = req.body;

  // If the IP address is available from the request
  const ip_address = req.ip || req.connection.remoteAddress;

  // Build the log message object
  const logMessage = {
    username: username,
    user_type: user_type,
    action: action,  
    target_user: target_user || 'N/A',  
    target_form: target_form || 'N/A',  
    ip_address: ip_address,
    user_level:user_level,
    user_type_id :user_type_id,
    timestamp: new Date().toISOString()  // Log the timestamp
  };

  // Log activity using winston (or any logging utility)
  logActivity(logMessage);

  // Proceed with the request
  next();
};

module.exports = activityLogMiddleware;
