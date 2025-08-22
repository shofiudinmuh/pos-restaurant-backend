module.exports = (sequelize, DataTypes) => {
    const Shift = sequelize.define(
        'Shift',
        {
            shift_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
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
            kasir_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'user_id',
                },
            },
            shift_start: {
                type: DataTypes.DATE,
                defaulValue: DataTypes.NOW,
                allowNull: false,
            },
            shift_end: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            initial_cash: {
                type: DataTypes.NUMERIC(12, 2),
                allowNull: false,
            },
            closing_cash: {
                type: DataTypes.NUMERIC(12, 2),
                allowNull: true,
            },
            system_cash_total: {
                type: DataTypes.NUMERIC(12, 2),
                allowNull: true,
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
            tableName: 'shifts',
            timestamps: false,
        }
    );
    Shift.associate = (models) => {
        Shift.belongsTo(models.User, { foreignKey: 'kasir_id' });
        Shift.belongsTo(models.Outlet, { foreignKey: 'outlet_id' });
    };

    return Shift;
};
