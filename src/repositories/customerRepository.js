const { Op } = require('sequelize');
const { Customers } = require('../models');
const ApiError = require('../utils/apiError');
const { v4: uuidv4 } = require('uuid');

class CustomerRepository {
    async createCustomer({
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        customerMemberStatus,
        customerMemberStartDate,
        customerMemberNumber,
    }) {
        try {
            return await Customers.create({
                customer_id: uuidv4(),
                customerName,
                customerEmail,
                customerPhone,
                customerAddress,
                customerMemberStatus,
                customerMemberStartDate,
                customerMemberNumber,
            });
        } catch (error) {
            throw new ApiError('Failed to create customer', 500);
        }
    }

    async updateCustomer(
        customerId,
        {
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
            customerMemberStatus,
            customerMemberStartDate,
            customerMemberNumber,
        }
    ) {
        try {
            const updateData = {};
            if (customerName && !undefined) updateData.name = customerName;
            if (customerEmail && !undefined) updateData.email = customerEmail;
            if (customerPhone & !undefined) updateData.phone = customerPhone;
            if (customerAddress && !undefined) updateData.address = customerAddress;
            if (customerMemberStatus && !undefined)
                updateData.membership_status = customerMemberStatus;
            if (customerMemberStartDate && !undefined)
                updateData.membership_start_date = customerMemberStartDate;
            if (customerMemberNumber && !undefined)
                updateData.membership_number = customerMemberNumber;

            if (Object.keys(updateData).length === 0) {
                throw new ApiError('No valid field provided for update', 400);
            }

            const [updatedCount] = await Customers.update(updateData, {
                where: { customer_id: customerId },
                returning: true,
            });

            if (updatedCount === 0) {
                throw new ApiError('Customer not found', 404);
            }

            return await Customers.findByPk(customerId);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError('Failed to update customer', 500);
        }
    }

    async getCustomerById(customerId) {
        try {
            return await Customers.findByPk(customerId);
        } catch (error) {
            throw new ApiError('Failed to fetch customer', 500);
        }
    }

    async getCustomers(options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                sortBy = 'name',
                sortOrder = 'ASC',
                search,
                searchField = 'name',
            } = options;
            const where = {};

            if (search) {
                where[searchField] = {
                    [Op.iLike]: `%${search}%`,
                };
            }

            const { count, rows } = await Customers.findAndCountAll({
                where,
                order: [[sortBy, sortOrder]],
                limit: parseInt(limit),
                offset: parseInt(page - 1) * parseInt(limit),
            });

            return {
                data: rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalItems: count,
                    totalPages: Math.ceil(count / parseInt(limit)),
                    itemsPerPage: parseInt(limit),
                    hasNextPage: parseInt(page) < Math.ceil(count / parseInt(limit)),
                    hasPreviousPage: parseInt(page) > 1,
                },
            };
        } catch (error) {
            throw new ApiError('Failed to fetch customers', 500);
        }
    }

    async deleteCustomer(customerId) {
        try {
            const deleted = await Customers.destroy({
                where: { customer_id: customerId },
            });

            if (!deleted) {
                throw new ApiError('Customer not found', 404);
            }
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError('Failed to delete customer', 500);
        }
    }
}

module.exports = CustomerRepository;
