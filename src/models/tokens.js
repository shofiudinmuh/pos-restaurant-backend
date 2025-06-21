module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define(
        'Token',
        {
            token_id: {
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
                references: {
                    model: 'sessions',
                    key: 'session_id',
                },
            },
            token: {
                type: DataTypes.STRING(255),
                allowedNull: false,
            },
            type: {
                type: DataTypes.STRING(50),
                allowedNull: false,
            },
            expires_at: {
                type: DataTypes.DATE,
            },
            revoked: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'tokens',
            timestamp: false,
        }
    );

    Token.associate = (models) => {
        // Token.belongsTo(models.User, { foreginKey: 'user_id' });
        Token.hasMany(models.Session, { foreignKey: 'session_id' });
        // Token.belongsTo(models.ApiLog, { foreignKey: 'session_id' });
    };

    return Token;
};
