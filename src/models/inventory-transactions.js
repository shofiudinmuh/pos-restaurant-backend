module.exports = (sequelize, DataTypes) => {
    const InventoryTransaction = sequelize.define(
        'InventoryTransaction',
        {
            inventory_transaction_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            outlet_id: {
                type: DataTypes.UUID,
                allowedNull: false,
                references: {
                    model: 'outlets',
                    key: 'outlet_id',
                },
            },
            ingredient_id: {
                type: DataTypes.UUID,
                allowedNull: false,
                references: {
                    model: 'ingredients',
                    key: 'ingredient_id',
                },
            },
            transaction_type: {
                type: DataTypes.STRING(20),
                allowedNull: false,
            },
            quantity: {
                type: DataTypes.DECIMAL(10, 2),
                allowedNull: false,
            },
            reason: {
                type: DataTypes.STRING(6),
                allowedNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
                allowedNull: false,
                references: {
                    model: 'users',
                    key: 'user_id',
                },
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'inventory_transactions',
            timestamps: false,
        }
    );
    InventoryTransaction.associate = (models) => {
        InventoryTransaction.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });
        InventoryTransaction.belongsTo(models.Outlet, {
            foreignKey: 'outlet_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        InventoryTransaction.belongsTo(models.Ingredient, {
            foreignKey: 'ingredient_id',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });
    };

    return InventoryTransaction;
};
