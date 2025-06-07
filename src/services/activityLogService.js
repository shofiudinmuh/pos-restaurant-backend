const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.logActivity = async (user_id, action, table_name, record_id, description) => {
    try {
        await pool.query(
            'INSERT INTO actifity_log (log_id, user_id, action, table_name, record_id, description, timestamp)VALUES ($1, $2,$3, $4, $5,$6,NOW())',
            [uuidv4(), user_id, action, table_name, record_id, description]
        );
    } catch (error) {
        console.error('Error logging activity: ', error);
    }
};
