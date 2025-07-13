module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define(
        'Order',
        {
            order_id: {
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
            table_id: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'tables',
                    key: 'table_id',
                },
            },
            customer_id: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'customers',
                    key: 'customer_id',
                },
            },
            status: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            subtotal: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            discount_id: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'discounts',
                    key: 'discount_id',
                },
            },
            discount_amount: {
                type: DataTypes.DECIMAL(10, 2),
                defaulValue: 0,
            },
            total_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            paid_amount: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0,
            },
            change_amount: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0,
            },
            order_type: {
                type: DataTypes.STRING(20),
                defaultValue: 'dine in',
            },
            reference_number: {
                type: DataTypes.STRING(100),
                allowNull: true,
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
            tableName: 'orders',
            timestamps: false,
        }
    );

    Order.associate = (models) => {
        Order.belongsTo(models.Outlet, { foreignKey: 'outlet_id' });
        Order.belongsTo(models.Tables, { foreignKey: 'table_id' });
        Order.belongsTo(models.Customer, { foreignKey: 'customer_id' });
        Order.belongsTo(models.Discount, { foreignKey: 'discount_id' });
        Order.hasMany(models.OrderItem, {
            foreignKey: 'order_id',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        Order.hasOne(models.Payment, { foreignKey: 'order_id' });
        Order.hasOne(models.Refund, { foreignKey: 'order_id' });
    };

    return Order;
};
