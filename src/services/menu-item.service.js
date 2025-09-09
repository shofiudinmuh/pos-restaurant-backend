const MenuItemRepository = require('../repositories/menuItemRepository');
const StorageService = require('../services/storageService');
const ApiError = require('../utils/apiError');

class MenuItemService {
    constructor() {
        this.menuItemRespository = new MenuItemRepository();
        this.storageService = new StorageService();
    }

    async createMenu({
        outletId,
        categoryId,
        menuItemName,
        menuItemDesc,
        menuItemPrice,
        menuItemIsActive,
        file,
    }) {
        try {
            const photoUrl = file ? await this.storageService.uploadFile('menu_photos') : null;
            return await this.menuItemRespository.createMenuItem({
                outletId,
                categoryId,
                menuItemName,
                menuItemDesc,
                menuItemPrice,
                photoUrl,
                menuItemIsActive,
            });
        } catch (error) {
            if (file) {
                await this.storageService.deleteFile(this.storageService.getFileKey(file));
            }
            throw error;
        }
    }

    async updateMenu(
        menuId,
        { categoryId, menuItemName, menuItemDesc, menuItemPrice, menuItemIsActive, file }
    ) {
        const menuItem = await this.menuItemRespository.getMenuItemById(menuId);
        let photoUrl = menuItem.photo_url;

        try {
            if (file) {
                if (photoUrl) {
                    await this.storageService.deleteFile(photoUrl);
                }
                photoUrl = await this.storageService.uploadFile(file, 'menu_photos');
            }
            return await this.menuItemRespository.updateMenuItem(menuId, {
                categoryId,
                menuItemName,
                menuItemDesc,
                menuItemPrice,
                photoUrl,
                menuItemIsActive,
            });
        } catch (error) {
            if (file && photoUrl) {
                await this.storageService.deleteFile(photoUrl);
            }
            throw error;
        }
    }

    async getMenuItems(queryParams) {
        this.validatePagination(queryParams);
        return this.menuItemRespository.getMenuItems(queryParams);
    }

    async getMenuItemById(menuId) {
        const menuItem = await this.menuItemRespository.getMenuItemById(menuId);
        if (!menuItem) {
            throw new ApiError('Menu item not found', 404);
        }
        return menuItem;
    }

    async deleteMenuItem(menuId) {
        const menuItem = await this.menuItemRespository.getMenuItemById(menuId);
        if (menuItem.photo_url) {
            await this.storageService.deleteFile(menuItem.photo_url);
        }
        return await this.menuItemRespository.deleteMenuItem(menuId);
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

module.exports = MenuItemService;
