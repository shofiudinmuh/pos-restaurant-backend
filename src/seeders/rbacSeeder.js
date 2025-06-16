const { v4: uuidv4 } = require('uuid');
const { sequelize, Sequelize } = require('../config/db');
const logger = require('../utils/logger');

// Common permissions for a POS system
const POS_PERMISSIONS = [
    // Order related
    { name: 'create_order', description: 'Can create new orders' },
    { name: 'view_order', description: 'Can view orders' },
    { name: 'update_order', description: 'Can update orders' },
    { name: 'cancel_order', description: 'Can cancel orders' },
    { name: 'process_payment', description: 'Can process payments for orders' },

    // Menu related
    { name: 'manage_menu', description: 'Can manage menu items' },
    { name: 'view_menu', description: 'Can view menu items' },

    // Inventory related
    { name: 'manage_inventory', description: 'Can manage inventory' },
    { name: 'view_inventory', description: 'Can view inventory' },

    // Staff related
    { name: 'manage_staff', description: 'Can manage staff accounts' },
    { name: 'view_staff', description: 'Can view staff information' },

    // Customer related
    { name: 'manage_customer', description: 'Can manage customer information' },
    { name: 'view_customer', description: 'Can view customer information' },

    // Reporting
    { name: 'view_reports', description: 'Can view sales reports' },
    { name: 'export_reports', description: 'Can export reports' },

    // System
    { name: 'manage_settings', description: 'Can manage system settings' },
    { name: 'manage_roles', description: 'Can manage roles and permissions' },
];

// Common roles for a restaurant POS
const POS_ROLES = [
    {
        name: 'admin',
        description: 'System administrator with full access',
        permissions: POS_PERMISSIONS.map((p) => p.name),
    },
    {
        name: 'manager',
        description: 'Restaurant manager',
        permissions: [
            'create_order',
            'view_order',
            'update_order',
            'cancel_order',
            'process_payment',
            'manage_menu',
            'view_menu',
            'manage_inventory',
            'view_inventory',
            'view_staff',
            'manage_customer',
            'view_customer',
            'view_reports',
            'export_reports',
        ],
    },
    {
        name: 'cashier',
        description: 'Handles orders and payments',
        permissions: [
            'create_order',
            'view_order',
            'update_order',
            'process_payment',
            'view_menu',
            'manage_customer',
            'view_customer',
        ],
    },
    {
        name: 'waiter',
        description: 'Takes orders and serves customers',
        permissions: ['create_order', 'view_order', 'update_order', 'view_menu', 'view_customer'],
    },
    {
        name: 'kitchen_staff',
        description: 'Prepares food and manages kitchen',
        permissions: ['view_order', 'view_menu', 'view_inventory'],
    },
];

async function seedRBAC() {
    const transaction = await sequelize.transaction();
    const now = new Date().toISOString();

    try {
        logger.info('Starting RBAC seeding...');

        // Clear existing data (using CASCADE to handle foreign key constraints)
        await sequelize.query(
            'TRUNCATE TABLE role_permissions, roles, permissions RESTART IDENTITY CASCADE',
            {
                transaction,
            }
        );

        logger.info('Cleared existing RBAC data');

        // Insert permissions
        const permissionsMap = {};

        for (const perm of POS_PERMISSIONS) {
            const permissionId = uuidv4();
            permissionsMap[perm.name] = permissionId;

            await sequelize.query(
                `INSERT INTO permissions 
                (permission_id, name, description, created_at, updated_at)
                VALUES (:permission_id, :name, :description, :created_at, :updated_at)`,
                {
                    replacements: {
                        permission_id: permissionId,
                        name: perm.name,
                        description: perm.description,
                        created_at: now,
                        updated_at: now,
                    },
                    type: Sequelize.QueryTypes.INSERT,
                    transaction,
                }
            );
        }

        logger.info(`Inserted ${POS_PERMISSIONS.length} permissions`);

        // Insert roles and role_permissions
        for (const role of POS_ROLES) {
            const roleId = uuidv4();

            // Insert role
            await sequelize.query(
                `INSERT INTO roles 
                (role_id, name, description, created_at, updated_at)
                VALUES (:role_id, :name, :description, :created_at, :updated_at)`,
                {
                    replacements: {
                        role_id: roleId,
                        name: role.name,
                        description: role.description,
                        created_at: now,
                        updated_at: now,
                    },
                    type: Sequelize.QueryTypes.INSERT,
                    transaction,
                }
            );

            // Insert role permissions
            for (const permName of role.permissions) {
                const permissionId = permissionsMap[permName];

                await sequelize.query(
                    `INSERT INTO role_permissions 
                    (role_permission_id, role_id, permission_id, created_at, updated_at)
                    VALUES (:role_permission_id, :role_id, :permission_id, :created_at, :updated_at)`,
                    {
                        replacements: {
                            role_permission_id: uuidv4(),
                            role_id: roleId,
                            permission_id: permissionId,
                            created_at: now,
                            updated_at: now,
                        },
                        type: Sequelize.QueryTypes.INSERT,
                        transaction,
                    }
                );
            }

            logger.info(`Inserted role ${role.name} with ${role.permissions.length} permissions`);
        }

        await transaction.commit();
        logger.info('RBAC seeding completed successfully');
        return true;
    } catch (error) {
        await transaction.rollback();
        logger.error('Error seeding RBAC data:', error);
        throw error;
    }
}

module.exports = seedRBAC;
