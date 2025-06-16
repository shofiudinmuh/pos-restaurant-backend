module.exports = (sequelize, DataTypes) => {
    const RolePermission = sequelize.define(
        'RolePermission',
        {
            role_permission_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            role_id: {
                type: DataTypes.UUID,
                references: {
                    model: 'roles',
                    key: 'role_id',
                },
            },
            permission_id: {
                type: DataTypes.UUID,
                references: {
                    model: 'permissions',
                    key: 'permission_id',
                },
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
            tableName: 'role_permissions',
            timestamps: false,
        }
    );

    RolePermission.associate = (models) => {
        RolePermission.hasMany(models.Role, { foreignKey: 'role_id' });
        RolePermission.hasMany(models.Permission, { foreignKey: 'permission_id' });
    };

    return RolePermission;
};
