module.exports = (sequelize, DataTypes) => {
    const Inventory = sequelize.define(
        'Inventory',
        {
            inventory_id: {
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
            ingredient_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'ingredients',
                    key: 'ingredient_id',
                },
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            last_updated: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'inventory',
            timestamps: false,
        }
    );

    Inventory.associate = (models) => {
        Inventory.belongsTo(models.Outlet, {
            foreignKey: 'outlet_id',
            onDelete: 'CASCADE',
        });
        Inventory.belongsTo(models.Ingredient, {
            foreignKey: 'ingredient_id',
            onDelete: 'CASCADE',
        });
    };

    return Inventory;
};
