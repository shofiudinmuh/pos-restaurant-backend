module.exports = (sequelize, DataTypes) => {
    const Discount = sequelize.define(
        'Discount',
        {
            discount_id: {
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
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            value: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            is_member_only: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            start_date: {
                type: DataTypes.DATE,
            },
            end_date: {
                type: DataTypes.DATE,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'discounts',
            timestamps: false,
        }
    );

    Discount.associate = (models) => {
        Discount.belongsTo(models.Outlet, { foreignKey: 'outlet_id' });
        Discount.belongsTo(models.Order, { foreignKey: 'discount_id' });
    };

    return Discount;
};
