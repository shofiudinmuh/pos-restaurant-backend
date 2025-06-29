module.exports = (sequelize, DataTypes) => {
    const LoyaltyReward = sequelize.define(
        'LoyaltyReward',
        {
            reward_id: {
                type: DataTypes.UUID,
                defaulValue: DataTypes.UUIDV4,
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
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            point_required: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            reward_type: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            value: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            menu_id: {
                type: DataTypes.UUID,
                defaulValue: DataTypes.UUIDV4,
                references: {
                    model: 'menu_items',
                    key: 'menu_id',
                },
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
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
            tableName: 'loyalty_rewards',
            timestamps: false,
        }
    );

    LoyaltyReward.associate = (models) => {
        LoyaltyReward.hasMany(models.Outlet, { foreignKey: 'outlet_id' });
        LoyaltyReward.belongsTo(models.MenuItem, { foreignKey: 'menu_id' });
    };

    return LoyaltyReward;
};
