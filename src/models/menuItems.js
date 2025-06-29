module.exports = (sequelize, DataTypes) => {
    const MenuItem = sequelize.define(
        'MenuItem',
        {
            menu_id: {
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
            category_id: {
                type: DataTypes.UUID,
                allowedNull: false,
                references: {
                    model: 'menu_categories',
                    key: 'category_id',
                },
            },
            name: {
                type: DataTypes.STRING(100),
                allowedNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowedNull: true,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowedNull: false,
            },
            photo_url: {
                type: DataTypes.STRING(255),
                allowedNull: true,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
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
            tableName: 'menu_items',
            timestamps: false,
        }
    );

    MenuItem.associate = (models) => {
        MenuItem.belongsTo(models.Outlet, {
            foreignKey: 'outlet_id',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });
        MenuItem.belongsTo(models.MenuCategories, {
            foreignKey: 'category_id',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });
        MenuItem.hasMany(models.LoyaltyReward, { foreignKey: 'menu_id' });
    };

    return MenuItem;
};
