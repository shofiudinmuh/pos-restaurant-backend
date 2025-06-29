module.exports = (sequelize, DataTypes) => {
    const Taxes = sequelize.define(
        'Taxes',
        {
            tax_id: {
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
            rate: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
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
            tableName: 'taxes',
            timestamps: false,
        }
    );

    Taxes.associate = (models) => {
        Taxes.belongsTo(models.Outlet, { foreignKey: 'outlet_id' });
        Taxes.hasMany(models.OrderTax, { foreignKey: 'tax_id' });
    };

    return Taxes;
};
