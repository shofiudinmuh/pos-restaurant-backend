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
    { name: 'view_order_history', description: 'Can view order history' },
    { name: 'manage_order_notes', description: 'Can manage order notes' },
    { name: 'view_order_notes', description: 'Can view order notes' },
    { name: 'manage_order_reminders', description: 'Can manage order reminders' },
    { name: 'view_order_reminders', description: 'Can view order reminders' },
    { name: 'view_order_status', description: 'Can view order status' },
    { name: 'update_order_status', description: 'Can update order status' },
    { name: 'view_order_details', description: 'Can view order details' },
    { name: 'update_order_details', description: 'Can update order details' },
    { name: 'view_order_list', description: 'Can view the list of orders' },
    { name: 'manage_order_settings', description: 'Can manage order settings' },
    { name: 'view_order_settings', description: 'Can view order settings' },

    // Menu related
    { name: 'manage_menu', description: 'Can manage menu items' },
    { name: 'view_menu', description: 'Can view menu items' },
    { name: 'manage_menu_categories', description: 'Can manage menu categories' },
    { name: 'view_menu_categories', description: 'Can view menu categories' },
    { name: 'manage_menu_items', description: 'Can manage individual menu items' },
    { name: 'view_menu_items', description: 'Can view individual menu items' },
    { name: 'manage_menu_pricing', description: 'Can manage menu item pricing' },
    { name: 'view_menu_pricing', description: 'Can view menu item pricing' },
    { name: 'manage_menu_specials', description: 'Can manage menu specials' },
    { name: 'view_menu_specials', description: 'Can view menu specials' },
    { name: 'manage_menu_modifiers', description: 'Can manage menu item modifiers' },
    { name: 'view_menu_modifiers', description: 'Can view menu item modifiers' },
    { name: 'manage_menu_tags', description: 'Can manage menu item tags' },
    { name: 'view_menu_tags', description: 'Can view menu item tags' },
    { name: 'manage_menu_images', description: 'Can manage menu item images' },
    { name: 'view_menu_images', description: 'Can view menu item images' },
    { name: 'manage_menu_availability', description: 'Can manage menu item availability' },
    { name: 'view_menu_availability', description: 'Can view menu item availability' },

    // Inventory related
    { name: 'manage_inventory', description: 'Can manage inventory' },
    { name: 'view_inventory', description: 'Can view inventory' },
    { name: 'manage_inventory_items', description: 'Can manage inventory items' },
    { name: 'view_inventory_items', description: 'Can view inventory items' },
    { name: 'manage_inventory_categories', description: 'Can manage inventory categories' },
    { name: 'view_inventory_categories', description: 'Can view inventory categories' },
    { name: 'manage_inventory_levels', description: 'Can manage inventory levels' },
    { name: 'view_inventory_levels', description: 'Can view inventory levels' },
    { name: 'manage_inventory_suppliers', description: 'Can manage inventory suppliers' },
    { name: 'view_inventory_suppliers', description: 'Can view inventory suppliers' },
    { name: 'manage_inventory_orders', description: 'Can manage inventory orders' },
    { name: 'view_inventory_orders', description: 'Can view inventory orders' },
    { name: 'manage_inventory_adjustments', description: 'Can manage inventory adjustments' },
    { name: 'view_inventory_adjustments', description: 'Can view inventory adjustments' },
    { name: 'manage_inventory_reports', description: 'Can manage inventory reports' },
    { name: 'view_inventory_reports', description: 'Can view inventory reports' },
    { name: 'manage_inventory_settings', description: 'Can manage inventory settings' },
    { name: 'view_inventory_settings', description: 'Can view inventory settings' },

    // Table related
    { name: 'manage_tables', description: 'Can manage restaurant tables' },
    { name: 'view_tables', description: 'Can view restaurant tables' },

    // Reservation related
    { name: 'manage_reservations', description: 'Can manage reservations' },
    { name: 'view_reservations', description: 'Can view reservations' },
    { name: 'cancel_reservations', description: 'Can cancel reservations' },
    { name: 'confirm_reservations', description: 'Can confirm reservations' },
    { name: 'view_reservation_status', description: 'Can view reservation status' },
    { name: 'update_reservation_status', description: 'Can update reservation status' },
    { name: 'view_reservation_history', description: 'Can view reservation history' },
    { name: 'manage_reservation_settings', description: 'Can manage reservation settings' },
    { name: 'view_reservation_settings', description: 'Can view reservation settings' },
    { name: 'cancel_reservation', description: 'Can cancel a reservation' },
    { name: 'confirm_reservation', description: 'Can confirm a reservation' },
    { name: 'view_reservation_details', description: 'Can view reservation details' },
    { name: 'update_reservation_details', description: 'Can update reservation details' },
    { name: 'view_reservation_list', description: 'Can view the list of reservations' },
    { name: 'manage_reservation_notes', description: 'Can manage reservation notes' },
    { name: 'view_reservation_notes', description: 'Can view reservation notes' },
    { name: 'manage_reservation_reminders', description: 'Can manage reservation reminders' },
    { name: 'view_reservation_reminders', description: 'Can view reservation reminders' },

    // Staff related
    { name: 'manage_staff', description: 'Can manage staff accounts' },
    { name: 'view_staff', description: 'Can view staff information' },

    // Customer related
    { name: 'manage_customer', description: 'Can manage customer information' },
    { name: 'view_customer', description: 'Can view customer information' },
    { name: 'manage_customer_groups', description: 'Can manage customer groups' },
    { name: 'view_customer_groups', description: 'Can view customer groups' },
    { name: 'manage_loyalty_programs', description: 'Can manage loyalty programs' },
    { name: 'view_loyalty_programs', description: 'Can view loyalty programs' },
    { name: 'manage_customer_feedback', description: 'Can manage customer feedback' },
    { name: 'view_customer_feedback', description: 'Can view customer feedback' },
    { name: 'manage_customer_notes', description: 'Can manage customer notes' },
    { name: 'view_customer_notes', description: 'Can view customer notes' },
    { name: 'manage_customer_reminders', description: 'Can manage customer reminders' },
    { name: 'view_customer_reminders', description: 'Can view customer reminders' },

    // Reporting
    { name: 'view_reports', description: 'Can view sales reports' },
    { name: 'export_reports', description: 'Can export reports' },

    // Outlet related
    { name: 'manage_outlets', description: 'Can manage restaurant outlets' },
    { name: 'view_outlets', description: 'Can view restaurant outlets' },
    { name: 'manage_outlet_settings', description: 'Can manage outlet settings' },
    { name: 'view_outlet_settings', description: 'Can view outlet settings' },
    { name: 'manage_outlet_staff', description: 'Can manage outlet staff' },
    { name: 'view_outlet_staff', description: 'Can view outlet staff' },
    { name: 'manage_outlet_inventory', description: 'Can manage outlet inventory' },
    { name: 'view_outlet_inventory', description: 'Can view outlet inventory' },

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
            'manage_outlets',
            'view_outlets',
            'manage_outlet_settings',
            'view_outlet_settings',
            'manage_outlet_staff',
            'view_outlet_staff',
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
            'view_order_history',
            'manage_order_notes',
            'view_order_notes',
            'manage_order_reminders',
            'view_order_reminders',
            'view_order_status',
            'update_order_status',
            'view_order_details',
            'update_order_details',
            'view_order_list',
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
