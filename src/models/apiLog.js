module.exports = (sequelize, DataTypes) => {
    const ApiLog = sequelize.define(
        'ApiLog',
        {
            api_log_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.UUID,
                references: {
                    model: 'users',
                    key: 'user_id',
                },
            },
            session_id: {
                type: DataTypes.UUID,
                allowedNull: true,
                references: {
                    model: 'sessions',
                    key: 'session_id',
                },
            },
            endpoint: {
                type: DataTypes.STRING(255),
                allowedNull: false,
            },
            method: {
                type: DataTypes.STRING(10),
                allowedNull: false,
            },
            status_code: {
                type: DataTypes.INTEGER,
                allowedNull: false,
            },
            request_body: {
                type: DataTypes.JSONB,
                allowedNull: true,
            },
            response_body: {
                type: DataTypes.JSONB,
                allowedNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'api_logs',
            timestamp: false,
        }
    );

    ApiLog.associate = (models) => {
        ApiLog.belongsTo(models.User, { foreignKey: 'user_id' });
        ApiLog.belongsTo(models.Session, { foreignKey: 'session_id' });
    };

    return ApiLog;
};
