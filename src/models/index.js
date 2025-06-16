const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');
const fs = require('fs');
const path = require('path');

const models = {
    ActivityLog: require('./activityLog')(sequelize, Sequelize.DataTypes),
    ApiLog: require('./apiLog')(sequelize, Sequelize.DataTypes),
    User: require('./users')(sequelize, Sequelize.DataTypes),
    Role: require('./roles')(sequelize, Sequelize.DataTypes),
    Permission: require('./permissions')(sequelize, Sequelize.DataTypes),
    RolePermission: require('./role-permissions')(sequelize, Sequelize.DataTypes),
    Session: require('./sessions')(sequelize, Sequelize.DataTypes),
    Token: require('./tokens')(sequelize, Sequelize.DataTypes),
};

fs.readdirSync(__dirname)
    .filter((file) => file !== 'index.js' && file.endsWith('.js'))
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        models[model.name] = model; // penting! pakai model.name dari define()
    });

// define associations
Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

module.exports = { sequelize, ...models };
