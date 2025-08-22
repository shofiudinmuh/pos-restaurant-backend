const { sequelize } = require('../models');

// async validator for database check
const checkOutletIsExists = async (value) => {
    const [results] = await sequelize.query('SELECT 1 FROM outlets WHERE outlet_id = ?', {
        replacements: [value],
    });
    return results.length > 0;
};

const chekUserIsExists = async (value) => {
    const [results] = await sequelize.query('SELECT 1 FROM users WHERE user_id = ?', {
        replacements: [value],
    });
    return results.length > 0;
};

const checkShiftIsExists = async (value) => {
    const [results] = await sequelize.query('SELECT 1 FROM shifts WHERE shift_id = ?', {
        replacements: [value],
    });
    return results.length > 0;
};

const checkTaxIsExists = async (value) => {
    const [results] = await sequelize.query('SELECT 1 FROM taxes WHERE tax_id  = ?', {
        replacements: [value],
    });
    return results.length > 0;
};
module.exports = {
    checkOutletIsExists,
    checkShiftIsExists,
    chekUserIsExists,
    checkTaxIsExists,
};
