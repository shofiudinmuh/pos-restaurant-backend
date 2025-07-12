module.exports = (sequelize, DataTypes) => {
    const LoyaltyTransaction = sequelize.define(
        'LoyaltyTransaction',
        {
            loyalty_transaction_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            customer_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'customers',
                    key: 'customer_id',
                },
            },
            order_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'orders',
                    key: 'order_id',
                },
            },
            points_earned: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            points_reedemed: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            transaction_type: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW(),
            },
        },
        {
            tableName: 'loyalty_transactions',
            timestamps: false,
        }
    );

    LoyaltyTransaction.associate = (models) => {
        LoyaltyTransaction.belongsTo(models.Outlet, { foreignKey: 'outlet_id' });
        LoyaltyTransaction.belongsTo(models.Customer, { foreignKey: 'customer_id' });
        LoyaltyTransaction.belongsTo(models.Order, { foreignKey: 'order_id' });
    };

    return LoyaltyTransaction;
};
