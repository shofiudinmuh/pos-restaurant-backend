module.exports = (sequelize, DataTypes) => {
    const MenuIngredient = sequelize.define(
        'MenuIngredient',
        {
            menu_ingredient_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            outlet_id: {
                type: DataTypes.UUID,
                allowedNull: false,
                references: {
                    model: 'outlets',
                    key: 'outlet_id',
                },
            },
            menu_id: {
                type: DataTypes.UUID,
                allowedNull: false,
                references: {
                    model: 'menu_items',
                    key: 'menu_id',
                },
            },
            ingredient_id: {
                type: DataTypes.UUID,
                allowedNull: false,
                references: {
                    model: 'ingredients',
                    key: 'ingredient_id',
                },
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowedNull: false,
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
            tableName: 'menu_ingredients',
            timestamps: false,
        }
    );

    MenuIngredient.associate = (models) => {
        MenuIngredient.belongsTo(models.Outlet, {
            foreignKey: 'outlet_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        MenuIngredient.belongsTo(models.MenuItem, {
            foreignKey: 'menu_id',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });
        MenuIngredient.belongsTo(models.Ingredient, {
            foreignKey: 'ingredient_id',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });
    };

    return MenuIngredient;
};
