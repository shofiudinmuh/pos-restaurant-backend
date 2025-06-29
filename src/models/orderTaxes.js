module.exports = (sequelize, DataTypes) => {
    const OrderTax = sequelize.define(
        'OrderTax',
        {
            order_tax_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
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
            tax_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'taxes',
                    key: 'tax_id',
                },
            },
            tax_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'order_taxes',
            timestamps: false,
        }
    );

    OrderTax.associate = (models) => {
        OrderTax.belongsTo(models.Order, { foreignKey: 'order_id' });
        OrderTax.belongsTo(models.Taxes, { foreignKey: 'tax_id' });
    };

    return OrderTax;
};
