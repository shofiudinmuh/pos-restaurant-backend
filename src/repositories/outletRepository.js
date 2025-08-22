const { Op } = require('sequelize');
const { Outlet } = require('../models');
const ApiError = require('../utils/apiError');
const { v4: uuidv4 } = require('uuid');

class OutletRepository {
    async createOutlet({ name, address, phone, logoUrl, outletCode }) {
        try {
            return await Outlet.create({
                outlet_id: uuidv4(),
                name,
                address,
                phone,
                logoUrl,
                outletCode,
            });
        } catch (error) {
            throw new ApiError('Failed to create outlet', 500);
        }
    }

    async updateOutlet(outletId, { name, address, phone, logoUrl, outletCode }) {
        try {
            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (address !== undefined) updateData.address = address;
            if (phone !== undefined) updateData.phone = phone;
            if (outletCode !== undefined) updateData.outlet_code = outletCode;
            if (logoUrl !== undefined) updateData.logo_url = logoUrl; // Changed from logoUrl to logo_url

            if (Object.keys(updateData).length === 0) {
                throw new ApiError('No fields to update', 400);
            }

            const [updated] = await Outlet.update(updateData, {
                where: { outlet_id: outletId },
                returning: true,
            });

            if (!updated) {
                throw new ApiError('Outlet not found', 404);
            }

            return await Outlet.findByPk(outletId);
        } catch (error) {
            throw error instanceof ApiError ? error : new ApiError('Failed to update outlet', 500);
        }
    }

    async getOutletById(outletId) {
        try {
            return await Outlet.findByPk(outletId);
        } catch (error) {
            throw new ApiError('Failed to fetch outlet', 500);
        }
    }

    async getOutlets(options = {}) {
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

            const { count, rows } = await Outlet.findAndCountAll({
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
            throw new ApiError('Failed to fetch outlets', 500);
        }
    }

    async deleteOutlet(outletId) {
        try {
            const deleted = await Outlet.destroy({
                where: { outlet_id: outletId },
            });

            if (!deleted) {
                throw new ApiError('Outlet not found', 404);
            }
        } catch (error) {
            throw error instanceof ApiError ? error : new ApiError('Failed to delete outlet', 500);
        }
    }
}

module.exports = OutletRepository;
