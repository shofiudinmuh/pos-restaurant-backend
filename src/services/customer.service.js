const { Customer } = require('../models');
const CustomerRepository = require('../repositories/customerRepository');
const ApiError = require('../utils/apiError');

class CustomerService {
    constructor() {
        this.customerRepository = new CustomerRepository();
    }

    async createCustomer({
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        customerMemberStatus,
        customerMemberStartDate,
    }) {
        try {
            const { currentTotalCustomer } = await Customer.count();
            const sequenceNumber = (currentTotalCustomer + 1).toString().padStart(5, '0');
            const customerMemberNumber = `CM${sequenceNumber}`;
            return await this.customerRepository.createCustomer({
                customerName,
                customerEmail,
                customerPhone,
                customerAddress,
                customerMemberStatus,
                customerMemberStartDate,
                customerMemberNumber,
            });
        } catch (error) {
            throw error;
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
        }
    ) {
        try {
            return await this.customerRepository.updateCustomer(customerId, {
                customerName,
                customerEmail,
                customerPhone,
                customerAddress,
                customerMemberStatus,
                customerMemberStartDate,
            });
        } catch (error) {
            throw error;
        }
    }

    async getCustomers(queryParams) {
        this.validatePagination(queryParams);
        return this.customerRepository.getCustomers(queryParams);
    }

    async getCustomerById(customerId) {
        const customer = await this.customerRepository.getCustomerById(customerId);
        if (!customer) {
            throw new ApiError('Customer not found', 404);
        }
        return customer;
    }

    async deleteCustomer(customerId) {
        const customer = await this.customerRepository.getCustomerById(customerId);
        if (!customer) {
            throw new ApiError('Customer not found', 404);
        }

        return this.customerRepository.deleteCustomer(customerId);
    }

    validatePagination({ page, limit }) {
        if (page && isNaN(page)) {
            throw new ApiError('Invalid page number', 400);
        }
        if (limit && isNaN(limit)) {
            throw new ApiError('Invalid limit value', 400);
        }
    }
}

module.exports = CustomerService;
