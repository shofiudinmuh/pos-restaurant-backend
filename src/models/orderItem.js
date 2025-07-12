module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define(
        'OrderItem',
        {
            order_item_id: {
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
            menu_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'menu_items',
                    key: 'menu_id',
                },
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            price: {
                type: DataTypes.NUMERIC(10, 2),
                allowNull: false,
            },
            notes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW(),
            },
        },
        {
            tableName: 'order_items',
            timestamps: false,
        }
    );

    OrderItem.associate = (models) => {
        OrderItem.belongsTo(models.Order, { foreignKey: 'order_id' });
        OrderItem.belongsTo(models.MenuItem, { foreignKey: 'menu_id' });
    };

    return OrderItem;
};
