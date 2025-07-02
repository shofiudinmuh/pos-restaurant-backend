module.exports = (sequelize, DataTypes) => {
    const CustomerPoint = sequelize.define(
        'CustomerPoint',
        {
            point_id: {
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
            customer_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'customers',
                    key: 'customer_id',
                },
            },
            total_points: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
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
            tableName: 'customer_points',
            timestamps: false,
        }
    );
    CustomerPoint.associate = (models) => {
        CustomerPoint.belongsTo(models.Outlet, {
            foreignKey: 'outlet_id',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        CustomerPoint.belongsTo(models.Customer, {
            foreignKey: 'customer_id',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    };

    return CustomerPoint;
};
