module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define(
        'Payment',
        {
            payment_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            outlet_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'outlets',
                    key: 'outlet_id',
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
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            payment_method: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            payment_status: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            reference_number: {
                type: DataTypes.STRING(100),
            },
            payment_date: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW(),
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            notes: {
                type: DataTypes.TEXT,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW(),
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW(),
            },
        },
        {
            tableName: 'payments',
            timestamps: false,
        }
    );

    Payment.associate = (models) => {
        Payment.belongsTo(models.Outlet, { foreignKey: 'outlet_id' });
        Payment.belongsTo(models.Order, { foreignKey: 'order_id' });
        Payment.belongsTo(models.User, { foreignKey: 'user_id' });
        Payment.hasMany(models.PaymentSplit, { foreignKey: 'payment_id' });
        Payment.hasOne(models.Refund, { foreignKey: 'payment_id' });
    };

    return Payment;
};
