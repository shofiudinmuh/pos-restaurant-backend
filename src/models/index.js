const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');
const fs = require('fs');
const path = require('path');

const models = {
    ActivityLog: require('./activityLog')(sequelize, Sequelize.DataTypes),
    ApiLog: require('./apiLog')(sequelize, Sequelize.DataTypes),
    Customer: require('./customers')(sequelize, Sequelize.DataTypes),
    CustomerPoint: require('./customerPoints')(sequelize, Sequelize.DataTypes),
    Discount: require('./discounts')(sequelize, Sequelize.DataTypes),
    Expenses: require('./expenses')(sequelize, Sequelize.DataTypes),
    Ingredient: require('./ingredients')(sequelize, Sequelize.DataTypes),
    Inventory: require('./inventory')(sequelize, Sequelize.DataTypes),
    InventoryTransaction: require('./inventory-transactions')(sequelize, Sequelize.DataTypes),
    LoyaltyReward: require('./loyaltyRewards')(sequelize, Sequelize.DataTypes),
    LoyaltyTransaction: require('./loyaltyTransactions')(sequelize, Sequelize.DataTypes),
    MenuCategories: require('./menuCategories')(sequelize, Sequelize.DataTypes),
    MenuItem: require('./menuItems')(sequelize, Sequelize.DataTypes),
    MenuIngredient: require('./menu-ingredients')(sequelize, Sequelize.DataTypes),
    Order: require('./orders')(sequelize, Sequelize.DataTypes),
    OrderItem: require('./orderItem')(sequelize, Sequelize.DataTypes),
    OrderTax: require('./orderTaxes')(sequelize, Sequelize.DataTypes),
    Outlet: require('./outlets')(sequelize, Sequelize.DataTypes),
    Payment: require('./payments')(sequelize, Sequelize.DataTypes),
    PaymentSplit: require('./paymentSplits')(sequelize, Sequelize.DataTypes),
    Permission: require('./permissions')(sequelize, Sequelize.DataTypes),
    Refund: require('./refunds')(sequelize, Sequelize.DataTypes),
    Role: require('./roles')(sequelize, Sequelize.DataTypes),
    RolePermission: require('./role-permissions')(sequelize, Sequelize.DataTypes),
    Session: require('./sessions')(sequelize, Sequelize.DataTypes),
    Shift: require('./shifts')(sequelize, Sequelize.DataTypes),
    Table: require('./tables')(sequelize, Sequelize.DataTypes),
    TableCategory: require('./tableCategories')(sequelize, Sequelize.DataTypes),
    Taxes: require('./taxes')(sequelize, Sequelize.DataTypes),
    Token: require('./tokens')(sequelize, Sequelize.DataTypes),
    User: require('./users')(sequelize, Sequelize.DataTypes),
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
