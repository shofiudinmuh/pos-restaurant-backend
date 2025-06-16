const { v4: uuidv4 } = require('uuid');
const { sequelize, Sequelize } = require('../config/db');
const logger = require('../utils/logger');

const POS_OUTLETS = [
    {
        name: 'Main Outlet',
        address: '123 Main St, City, Country',
        phone: '+1234567890',
        logo_url: 'https://example.com/logo.png',
    },
    {
        name: 'Secondary Outlet',
        address: '456 Secondary St, City, Country',
        phone: '+0987654321',
        logo_url: 'https://example.com/logo2.png',
    },
    {
        name: 'Tertiary Outlet',
        address: '789 Tertiary St, City, Country',
        phone: '+1122334455',
        logo_url: 'https://example.com/logo3.png',
    },
    {
        name: 'Quaternary Outlet',
        address: '321 Quaternary St, City, Country',
        phone: '+5566778899',
        logo_url: 'https://example.com/logo4.png',
    },
];

async function outletSeeder() {
    const transaction = await sequelize.transaction();
    const now = new Date().toISOString();

    try {
        logger.info('Starting outlet seeding process...');
        // Clear existing data
        await sequelize.query('TRUNCATE TABLE outlets RESTART IDENTITY CASCADE', {
            transaction,
        });

        logger.info('Cleared existing outlet data');

        // Insert outlets
        const outlets = {};

        for (const outlet of POS_OUTLETS) {
            const outletId = uuidv4();
            outlets[outlet.name] = outletId;

            await sequelize.query(
                `INSERT INTO outlets
                (outlet_id, name, address, phone, logo_url, created_at, updated_at)
                VALUES (:outlet_id, :name, :address, :phone, :logo_url, :created_at, :updated_at)`,
                {
                    replacements: {
                        outlet_id: outletId,
                        name: outlet.name,
                        address: outlet.address,
                        phone: outlet.phone,
                        logo_url: outlet.logo_url,
                        created_at: now,
                        updated_at: now,
                    },
                    type: Sequelize.QueryTypes.INSERT,
                    transaction,
                }
            );
        }

        logger.info(`Inserted ${POS_OUTLETS.length} outltes`);

        await transaction.commit();
        logger.info('Outlet seeding completed successfully!');
        return true;
    } catch (error) {
        await transaction.rollback();
        logger.error('Failed to seed outlets: ', error);
        throw error;
    }
}

module.exports = outletSeeder;
