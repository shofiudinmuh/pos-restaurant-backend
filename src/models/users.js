const e = require('express');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User', // Model name (singular)
        {
            user_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            password_hash: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            google_id: {
                type: DataTypes.STRING(255),
                allowNull: true, // Adjust based on your requirements
                unique: true,
            },
            role_id: {
                type: DataTypes.UUID,
                allowNull: false, // Add for consistency
                references: {
                    model: 'roles',
                    key: 'role_id',
                },
            },
            outlet_id: {
                type: DataTypes.UUID,
                allowNull: true, // Adjust based on your requirements
                references: {
                    model: 'outlets',
                    key: 'outlet_id',
                },
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
            tableName: 'users',
            timestamps: false, // Correct key
        }
    );

    User.associate = (models) => {
        User.belongsTo(models.Role, {
            foreignKey: 'role_id',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });
        User.belongsTo(models.Outlet, {
            foreignKey: 'outlet_id',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });
        User.hasMany(models.Session, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        User.hasMany(models.Token, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        User.hasMany(models.ActivityLog, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        // User.hasMany(models.Transaction, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    };

    return User;
};
