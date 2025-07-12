module.exports = (sequelize, DataTypes) => {
    const Outlet = sequelize.define(
        'Outlet',
        {
            outlet_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(20),
                allowedNull: false,
            },
            logo_url: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            outlet_code: {
                type: DataTypes.STRING(20),
                allowNull: false,
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
            tableName: 'outlets',
            timestamps: false,
        }
    );

    Outlet.associate = (models) => {
        Outlet.hasMany(models.User, { foreignKey: 'outlet_id' });
    };

    return Outlet;
};
