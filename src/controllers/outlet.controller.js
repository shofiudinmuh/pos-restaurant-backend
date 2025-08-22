const OutletService = require('../services/outlet.service');
const OutletDto = require('../dtos/outletDto');
const ApiResponse = require('../utils/responseHandler');

class OutletController {
    constructor(outletService = new OutletService()) {
        this.outletService = outletService;
        this.createOutlet = this.createOutlet.bind(this);
        this.getOutletById = this.getOutletById.bind(this);
        this.getOutlets = this.getOutlets.bind(this);
        this.updateOutlet = this.updateOutlet.bind(this);
        this.deleteOutlet = this.deleteOutlet.bind(this);
    }

    /**
     * Create a new outlet
     * @param {Object} req - Express request object
     * @param {Object} res - Express response obejct
     * @param {function} next - Express next middleware
     */
    async createOutlet(req, res, next) {
        try {
            const outletData = OutletDto.createOutletDto(req);
            const outlet = await this.outletService.createOutlet(outletData);
            ApiResponse.success(res, outlet, 'Outlet created successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get outlet by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async getOutletById(req, res, next) {
        try {
            const outlet = await this.outletService.getOutletById(req.params.id);
            ApiResponse.success(res, outlet, 'Outlet retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get pagiinated list of outlets
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async getOutlets(req, res, next) {
        try {
            const queryParams = OutletDto.outletQueryDto(req.query);
            const result = await this.outletService.getOutlet(queryParams);
            ApiResponse.success(res, result, 'Outlets retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update an existing outlet
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async updateOutlet(req, res, next) {
        try {
            const updateData = OutletDto.updateOutletDto(req);
            const updatedOutlet = this.outletService.updateOutlet(updateData);
            ApiResponse.success(res, updatedOutlet, 'Outlet updated successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete an outlet
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async deleteOutlet(req, res, next) {
        try {
            await this.outletService.deleteOutlet(req.params.id);
            ApiResponse.success(res, null, 'Outlet deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = OutletController;
// const { Outlet } = require('../models');
// const activityLogService = require('../services/activityLogService');
// const StorageService = require('../services/storageService');
// const ApiResponse = require('../utils/responseHandler');
// const { v4: uuidv4 } = require('uuid');

// exports.createOutlet = async (req, res, next) => {
//     const transaction = await Outlet.sequelize.transaction();
//     try {
//         const { name, address, phone, outlet_code } = req.body;
//         let logo_url = null;

//         if (req.file) {
//             logo_url = await StorageService.uploadFile(req.file, 'outlet_logos');
//         }

//         const outlet = await Outlet.create(
//             {
//                 outlet_id: uuidv4(),
//                 name,
//                 address,
//                 phone,
//                 logo_url,
//                 outlet_code,
//             },
//             { transaction }
//         );

//         await activityLogService.logActivity(
//             req.user.user_id,
//             'create_outlet',
//             'outlets',
//             outlet.outlet_id,
//             `Created outlet: ${name}`
//         );

//         await transaction.commit();

//         return ApiResponse.success(res, outlet, 'Outlet created successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };

// exports.getOutlets = async (req, res, next) => {
//     try {
//         const { page = 1, limit = 10, sort = 'asc', sortBy = 'name' } = req.query;
//         const offset = (page - 1) * limit;

//         const outlets = await Outlet.findAndCountAll({
//             attributes: ['outlet_id', 'name', 'address', 'phone', 'outlet_code', 'logo_url'],
//             order: [[sortBy, sort]],
//             limit,
//             offset,
//         });

//         return ApiResponse.success(
//             res,
//             {
//                 outlets: outlets.rows,
//                 pagination: {
//                     total: outlets.count,
//                     page,
//                     limit,
//                     totalPages: Math.ceil(outlets.count / limit),
//                 },
//             },
//             'Outlets retrivied successfully'
//         );
//     } catch (error) {
//         next(error);
//     }
// };

// exports.getOutletById = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const outlet = await Outlet.findByPk(id);

//         if (!outlet) {
//             return ApiResponse.error(res, 'Outlet not found', 404);
//         }

//         return ApiResponse.success(res, outlet, 'Outlet retrieved successfully');
//     } catch (error) {
//         next(error);
//     }
// };

// exports.updateOutlet = async (req, res, next) => {
//     const transaction = await Outlet.sequelize.transaction();
//     try {
//         const { id } = req.params;
//         const { name, address, phone, outlet_code } = req.body;
//         let logo_url = req.body.logo_url;

//         const outlet = await Outlet.findByPk(id);
//         if (!outlet) {
//             await transaction.rollback();
//             return ApiResponse.error(res, 'Outlet not found', 404);
//         }

//         // prepared object fot update data
//         const updateData = {};

//         if (name !== undefined) updateData.name = req.body.name;
//         if (address !== undefined) updateData.address = req.body.address;
//         if (phone !== undefined) updateData.phone = req.body.phone;
//         if (outlet_code !== undefined) updateData.outlet_code = req.body.outlet_code;

//         if (req.file) {
//             //delete old logo if exists
//             if (outlet.logo_url) {
//                 await StorageService.deleteFile(outlet.logo_url);
//             }

//             logo_url = await StorageService.uploadFile(req.file, 'outlet_logos');
//             updateData.logo_url = logo_url;
//         }

//         // Only update if there is at least 1 field to update
//         if (Object.keys(updateData).length === 0) {
//             await transaction.rollback();
//             return ApiResponse.error(res, 'No field provided to update', 400);
//         }

//         await outlet.update(updateData, { transaction });

//         await activityLogService.logActivity(
//             req.user.user_id,
//             'update_outlet',
//             'outlets',
//             id,
//             `Updated outlet: ${name}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, outlet, 'Outlet updated successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };

// exports.deleteOutlet = async (req, res, next) => {
//     const transaction = await Outlet.sequelize.transaction();
//     try {
//         const { id } = req.params;
//         const outlet = await Outlet.findByPk(id);

//         if (!outlet) {
//             await transaction.rollback();
//             return ApiResponse.error(res, 'Outlet not found', 404);
//         }

//         //delete logo if exists
//         if (outlet.logo_url) {
//             await StorageService.deleteFile(outlet.logo_url);
//         }

//         await outlet.destroy({ transaction });
//         await activityLogService.logActivity(
//             req.user.user_id,
//             'delete_outlet',
//             'outlets',
//             id,
//             `Deleted outlet: ${outlet.name}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, null, 'Outlet deleted successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };
