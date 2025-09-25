const {
    Ingredient,
    Inventory,
    ActivityLog,
    MenuIngredient,
    InventoryTransaction,
} = require('./models');
const IngredientRepository = require('./repositories/ingredientRepository');
const InventoryRepository = require('./repositories/inventoryRepository');
const MenuIngredientRepository = require('./repositories/menuIngredientRepository');

const ActivityLogService = require('./services/activity-log.service');
const IngredientService = require('./services/ingredient.service');
const InventoryService = require('./services/inventory.service');

const IngredientController = require('./controllers/ingredient.controller');

class Container {
    constructor() {
        this.models = {
            ActivityLog,
            Ingredient,
            Inventory,
            InventoryTransaction,
            MenuIngredient,
        };
        this.repositories = {};
        this.services = {};
        this.controllers = {};
    }

    initialize() {
        //Register repositories
        this.repositories.ingredientRepository = new IngredientRepository(
            this.models.Inventory,
            this.models.Ingredient
        );
        this.repositories.menuIngredientRepository = new MenuIngredientRepository(
            this.models.MenuIngredient
        );
        this.repositories.inventoryRepository = new InventoryRepository(
            this.models.Ingredient,
            this.models.Inventory,
            this.models.InventoryTransaction
        );

        //Register services
        this.services.activityLogService = new ActivityLogService(this.models.ActivityLog);
        this.services.ingredientService = new IngredientService(
            this.repositories.ingredientRepository,
            this.services.activityLogService
        );
        this.services.inventoryService = new InventoryService(
            this.repositories.InventoryService,
            this.services.activityLogService
        );

        //Register controller
        this.controllers.ingredientController = new IngredientController(
            this.services.ingredientService
        );

        return this;
    }

    getRepository(name) {
        return this.repositories[name];
    }

    getService(name) {
        return this.services[name];
    }

    getController(name) {
        return this.controllers[name];
    }
}

module.exports = new Container();
