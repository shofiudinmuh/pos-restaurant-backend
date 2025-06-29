module.exports = (sequelize, DataTypes) => {
    const TableCategory = sequelize.define(
        'TableCategory',
        {
            table_category_id: {
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
            category_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
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
            tableName: 'table_categories',
            timestamps: false,
        }
    );
    TableCategory.associate = (models) => {
        TableCategory.hasMany(models.Tables, { foreignKey: 'table_category_id' });
    };

    return TableCategory;
};
