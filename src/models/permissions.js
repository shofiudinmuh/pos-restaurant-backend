module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define(
        'Permission',
        {
            permission_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
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
            tableName: 'permissions',
            timestamps: false,
        }
    );

    Permission.associate = (models) => {
        Permission.hasMany(models.RolePermission, { foreignKey: 'permission_id' });
    };

    return Permission;
};
