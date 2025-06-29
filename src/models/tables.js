module.exports = (sequelize, DataTypes) => {
    const Tables = sequelize.define(
        'Tables',
        {
            table_id: {
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
            table_number: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            table_category_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'table_categories',
                    key: 'table_category_id',
                },
            },
            status: {
                type: DataTypes.STRING(20),
                defaultValue: 'available',
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
            tableName: 'tables',
            timestamps: false,
        }
    );

    Tables.associate = (models) => {
        Tables.belongsTo(models.Outlet, { foreignKey: 'outlet_id' });
        Tables.belongsTo(models.TableCategory, {
            foreignKey: 'table_category_id',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });
        Tables.hasMany(models.Order, { foreignKey: 'table_id' });
    };

    return Tables;
};
