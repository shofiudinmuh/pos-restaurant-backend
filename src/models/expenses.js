module.exports = (sequelize, DataTypes) => {
    const Expenses = sequelize.define(
        'Expenses',
        {
            expense_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            shift_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'shifts',
                    key: 'shift_id',
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            amount: {
                type: DataTypes.NUMERIC(12, 2),
                allowNull: false,
            },
            created_by: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'user_id',
                },
            },
            created_at: {
                type: DataTypes.DATE,
                defautlValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'expenses',
            timestamps: false,
        }
    );
    Expenses.associate = (models) => {
        Expenses.belongsTo(models.Shift, { foreignKey: 'shift_id' });
        Expenses.belongsTo(models.User, { foreignKey: 'created_id' });
    };

    return Expenses;
};
