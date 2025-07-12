const { Outlet } = require('../models');
const activityLogService = require('../services/activityLogService');
const StorageService = require('../services/storageService');
const ApiResponse = require('../utils/responseHandler');
const { v4: uuidv4 } = require('uuid');

exports.createOutlet = async (req, res, next) => {
    const transaction = await Outlet.sequelize.transaction();
    try {
        const { name, address, phone } = req.body;
        let logo_url = null;

        if (req.file) {
            logo_url = await StorageService.uploadFile(req.file, 'outlet_logos');
        }

        const outlet = await Outlet.create(
            {
                outlet_id: uuidv4(),
                name,
                address,
                phone,
                logo_url,
                outlet_code,
            },
            { transaction }
        );

        await activityLogService.logActivity(
            req.user.user_id,
            'create_outlet',
            'outlets',
            outlet.outlet_id,
            `Created outlet: ${name}`
        );

        await transaction.commit();

        return ApiResponse.success(res, outlet, 'Outlet created successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.getOutlets = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = 'asc', sortBy = 'name' } = req.query;
        const offset = (page - 1) * limit;

        const outlets = await Outlet.findAndCountAll({
            attributes: ['outlet_id', 'name', 'address', 'phone', 'outlet_code', 'logo_url'],
            order: [[sortBy, sort]],
            limit,
            offset,
        });

        return ApiResponse.success(
            res,
            {
                outlets: outlets.rows,
                pagination: {
                    total: outlets.count,
                    page,
                    limit,
                    totalPages: Math.ceil(outlets.count / limit),
                },
            },
            'Outlets retrivied successfully'
        );
    } catch (error) {
        next(error);
    }
};

exports.getOutletById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const outlet = await Outlet.findByPk(id);

        if (!outlet) {
            return ApiResponse.error(res, 'Outlet not found', 404);
        }

        return ApiResponse.success(res, outlet, 'Outlet retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.updateOutlet = async (req, res, next) => {
    const transaction = await Outlet.sequelize.transaction();
    try {
        const { id } = req.params;
        const { name, address, phone, outlet_code } = req.body;
        let logo_url = req.body.logo_url;

        const outlet = await Outlet.findByPk(id);
        if (!outlet) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Outlet not found', 404);
        }

        // prepared object fot update data
        const updateData = {};

        if (name !== undefined) updateData.name = req.body.name;
        if (address !== undefined) updateData.address = req.body.address;
        if (phone !== undefined) updateData.phone = req.body.phone;
        if (outlet_code !== undefined) updateData.outlet_code = req.body.outlet_code;

        if (req.file) {
            //delete old logo if exists
            if (outlet.logo_url) {
                await StorageService.deleteFile(outlet.logo_url);
            }

            logo_url = await StorageService.uploadFile(req.file, 'outlet_logos');
            updateData.logo_url = logo_url;
        }

        // Only update if there is at least 1 field to update
        if (Object.keys(updateData).length === 0) {
            await transaction.rollback();
            return ApiResponse.error(res, 'No field provided to update', 400);
        }

        await outlet.update(updateData, { transaction });

        await activityLogService.logActivity(
            req.user.user_id,
            'update_outlet',
            'outlets',
            id,
            `Updated outlet: ${name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, outlet, 'Outlet updated successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.deleteOutlet = async (req, res, next) => {
    const transaction = await Outlet.sequelize.transaction();
    try {
        const { id } = req.params;
        const outlet = await Outlet.findByPk(id);

        if (!outlet) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Outlet not found', 404);
        }

        //delete logo if exists
        if (outlet.logo_url) {
            await StorageService.deleteFile(outlet.logo_url);
        }

        await outlet.destroy({ transaction });
        await activityLogService.logActivity(
            req.user.user_id,
            'delete_outlet',
            'outlets',
            id,
            `Deleted outlet: ${outlet.name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, null, 'Outlet deleted successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};
