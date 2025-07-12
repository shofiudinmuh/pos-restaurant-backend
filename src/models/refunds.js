module.exports = (sequelize, DataTypes) => {
    const Refund = sequelize.define(
        'Refund',
        {
            refund_id: {
                type: DataTypes.UUID,
                defautlValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            order_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'orders',
                    key: 'order_id',
                },
            },
            payment_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'payments',
                    key: 'payment_id',
                },
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            reason: {
                type: DataTypes.TEXT,
            },
            status: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            processed_by: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'user_id',
                },
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
            tableName: 'refunds',
            timestamps: false,
        }
    );

    Refund.associate = (models) => {
        Refund.belongsTo(models.Order, { foreignKey: 'order_id' });
        Refund.belongsTo(models.Payment, { foreignKey: 'payment_id' });
        Refund.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    return Refund;
};
