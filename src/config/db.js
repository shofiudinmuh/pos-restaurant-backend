// module.exports = sequelize;
// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//     dialect: 'postgres',
//     pool: {
//         max: 20,
//         min: 0,
//         acquire: 30000,
//         idle: 10000,
//     },
//     define: {
//         timestamps: true, // Enable automatic timestamps
//         underscored: true, // Use snake_case for column names
//         freezeTableName: true, // Prevent pluralization of table names
//     },
//     logging: process.env.NODE_ENV === 'development' ? console.log : false,
// });

// // Test the database connection
// async function testConnection() {
//     try {
//         await sequelize.authenticate();
//         console.log('Database connection has been established successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// }

// testConnection();

// module.exports = {
//     Sequelize,
//     sequelize,
// };

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    define: {
        timestamps: true, // Enable automatic timestamps
        underscored: true, // Use snake_case for column names
        freezeTableName: true, // Prevent pluralization of table names
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

// Test the connection
sequelize
    .authenticate()
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
