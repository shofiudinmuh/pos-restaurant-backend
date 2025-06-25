module.exports = (sequelize, DataTypes) => {
    const Ingredient = sequelize.define(
        'Ingredient',
        {
            ingredient_id: {
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
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            unit: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            minimum_stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
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
            tableName: 'ingredients',
            timestamps: false,
        }
    );

    Ingredient.associate = (models) => {
        Ingredient.belongsTo(models.Outlet, {
            foreignKey: 'outlet_id',
            onDelete: 'CASCADE',
        });

        Ingredient.hasOne(models.Inventory, {
            // Changed from belongsTo to hasOne
            foreignKey: 'ingredient_id',
            onDelete: 'CASCADE',
        });

        Ingredient.hasMany(models.InventoryTransaction, {
            foreignKey: 'ingredient_id',
        });

        Ingredient.hasMany(models.MenuIngredient, {
            foreignKey: 'ingredient_id',
        });
    };

    return Ingredient;
};
