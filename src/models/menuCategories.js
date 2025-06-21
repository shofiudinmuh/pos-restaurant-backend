module.exports = (sequelize, DataTypes) => {
    const MenuCategories = sequelize.define(
        'MenuCategories',
        {
            category_id: {
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
            category_name: {
                type: DataTypes.STRING(50),
                allowedNull: false,
            },
            description: {
                type: DataTypes.TEXT,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
            },
        },
        {
            tableName: 'menu_categories',
            timestamps: false,
        }
    );

    MenuCategories.associate = (models) => {
        MenuCategories.hasMany(models.MenuItem, {
            foreignKey: 'category_id',
        });
    };

    return MenuCategories;
};
