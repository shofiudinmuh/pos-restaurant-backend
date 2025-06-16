module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define(
        'Session', // Model name (singular, as per Sequelize convention)
        {
            session_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false, // Add allowNull to enforce constraint
                references: {
                    model: 'users', // Correct table name
                    key: 'user_id',
                },
            },
            device_info: {
                type: DataTypes.TEXT,
            },
            created_at: {
                // Fix typo
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            expires_at: {
                type: DataTypes.DATE,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            tableName: 'sessions',
            timestamps: false, // Correct key
        }
    );

    Session.associate = (models) => {
        Session.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        Session.hasMany(models.Token, {
            foreignKey: 'session_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return Session;
};
