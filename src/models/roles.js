module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define(
        'Role',
        {
            role_id: {
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
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'roles',
            timestamp: false,
        }
    );

    Role.associate = (models) => {
        Role.hasMany(models.User, { foreignKey: 'role_id' });
        Role.belongsToMany(models.Permission, {
            through: models.RolePermission,
            foreignKey: 'role_id',
            otherKey: 'permission_id',
        });
    };

    return Role;
};
