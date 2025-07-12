const { where } = require('sequelize');
const { Customer, CustomerPoint, Outlet } = require('../models');
const activityLogService = require('../services/activityLogService');
const ApiResponse = require('../utils/responseHandler');
const { v4: uuidv4 } = require('uuid');

exports.createCustomer = async (req, res, next) => {
    const transaction = await Customer.sequelize.transaction();
    try {
        const { outlet_id } = req.user;
        const { name, email, phone, address, membership_status, membership_start_date } = req.body;

        const outlet = await Outlet.findOne({
            where: { outlet_id },
            transaction,
        });

        if (!outletCode) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Outlet not found', 404);
        }
        const outletCode = outlet.outlet_code.toUpperCase();

        const currentTotalCustomer = await Customer.count({
            where: { outlet_id },
            transaction,
        });

        const sequenceNumber = (currentTotalCustomer + 1).toString().padStart(6, '0');
        const membership_number = `${outletCode}${new Date().getFullYear()}-${sequenceNumber}`;

        const customer = await Customer.create(
            {
                customer_id: uuidv4(),
                outlet_id,
                name,
                email,
                phone,
                address,
                membership_status,
                membership_start_date,
                membership_number,
            },
            {
                transaction,
            }
        );

        if (!customer) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Error creating customer', 500);
        }

        await CustomerPoint.create(
            {
                point_id: uuidv4(),
                outlet_id,
                customer_id: customer.customer_id,
                total_points: 0,
            },
            {
                transaction,
            }
        );

        await activityLogService.logActivity(
            req.user.user_id,
            'create_customer',
            'customers',
            customer.customer_id,
            `Created customer : ${name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, customer, 'Customer created successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.getCustomers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = 'asc', sortBy = 'name' } = req.query;
        const offset = (page - 1) * limit;

        const customers = await Customer.findAndCountAll({
            order: [[sortBy, sort]],
            include: ['CustomerPoint'],
            limit,
            offset,
        });

        return ApiResponse.success(
            res,
            {
                customers: customers.rows,
                pagintaion: {
                    total: customers.count,
                    page,
                    limit,
                    totalPage: Math.ceil(customers.count / limit),
                },
            },
            'Customers retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};

exports.getCustomerById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { outlet_id } = req.user;

        const customer = await Customer.findOne({
            where: { customer_id: id, outlet_id: outlet_id },
        });

        if (!customer) {
            return ApiResponse.error(res, 'Customer no found', 404);
        }

        return ApiResponse.success(res, customer, 'Customer retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.updateCustomer = async (req, res, next) => {
    const transaction = await Customer.sequelize.transaction();
    try {
        const { id } = req.params;
        const { name, email, phone, address, membership_status, membership_start_date } = req.body;

        const customer = await Customer.findOne({
            where: { customer_id: id },
        });

        if (!customer) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Customer not found', 404);
        }

        await customer.update(
            {
                name,
                email,
                phone,
                address,
                membership_status,
                membership_start_date,
            },
            { transaction }
        );

        await activityLogService.logActivity(
            req.user.user_id,
            'update_customer',
            'customers',
            id,
            `Updated customer : ${name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, customer, 'Customer updated successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.deleteCustomer = async (req, res, next) => {
    const transaction = await Customer.sequelize.transaction();
    try {
        const { id } = req.params;

        const customer = await Customer.findOne({
            where: { customer_id: id },
        });

        if (!customer) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Customer not found', 404);
        }

        await customer.destroy({ transaction });

        await transaction.commit();
        return ApiResponse.success(res, null, 'Customer deleted successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};
