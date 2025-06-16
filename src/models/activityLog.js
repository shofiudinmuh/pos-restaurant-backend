module.exports = (sequelize, DataTypes) => {
    const ActivityLog = sequelize.define(
        'ActivityLog',
        {
            log_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowedNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
                references: {
                    model: 'users',
                    key: 'user_id',
                },
            },
            action: {
                type: DataTypes.STRING(100),
            },
            table_name: {
                type: DataTypes.STRING(50),
            },
            record_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            description: {
                type: DataTypes.TEXT,
            },
            timestamp: {
                type: DataTypes.DATE,
            },
        },
        {
            tableName: 'activity_log',
            timestamp: true,
        }
    );

    ActivityLog.associate = (models) => {
        ActivityLog.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    return ActivityLog;
};
