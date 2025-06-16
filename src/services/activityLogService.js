const { v4: uuidv4 } = require('uuid');
const { ActivityLog } = require('../models');

exports.logActivity = async (user_id, action, table_name, record_id, description) => {
    try {
        await ActivityLog.create({
            log_id: uuidv4(),
            user_id,
            action,
            table_name,
            record_id,
            description,
        });
    } catch (error) {
        console.error('Error logging activity: ', error);
    }
};
