module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define(
        'Customer',
        {
            customer_id: {
                type: DataTypes.UUID,
                defaulValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            membership_status: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            membership_start_date: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            membership_number: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
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
            tableName: 'customers',
            timestamps: false,
        }
    );

    Customer.associate = (models) => {
        Customer.belongsTo(models.Order, { foreignKey: 'customer_id' });
        Customer.hasOne(models.CustomerPoint, { foreignKey: 'customer_id' });
    };

    return Customer;
};
