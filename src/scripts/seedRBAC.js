require('dotenv').config();
const seedRBAC = require('../seeders/rbacSeeder');
const outletSeeder = require('../seeders/outletSeeder');

(async () => {
    try {
        console.log('Starting RBAC seeding process...');
        // await seedRBAC();
        // await outletSeeder();
        console.log('RBAC seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed RBAC:', error);
        process.exit(1);
    }
})();
