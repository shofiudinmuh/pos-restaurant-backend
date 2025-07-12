module.exports = (sequelize, DataTypes) => {
    const PaymentSplit = sequelize.define(
        'PaymentSplit',
        {
            split_payment_id: {
                type: DataTypes.UUID,
                defautlValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            payment_method: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'user_id',
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
            status: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: 'completed',
                validate: {
                    isIn: [['pending', 'completed', 'failed']],
                },
            },
            reference_number: {
                type: DataTypes.STRING(100),
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW(),
            },
        },
        {
            tableName: 'payment_splits',
            timestamps: false,
        }
    );

    PaymentSplit.associate = (models) => {
        PaymentSplit.belongsTo(models.User, { foreignKey: 'user_id' });
        PaymentSplit.belongsTo(models.Payment, { foreignKey: 'payment_id' });
    };

    return PaymentSplit;
};
