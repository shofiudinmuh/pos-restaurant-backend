const BaseDto = require('../baseDto');

class MenuIngredientResponseDto {
    constructor(menuIngredient) {
        super();
        this.menu_ingredient_id = menuIngredient.menu_ingredient_id;
        this.outlet_id = menuIngredient.outlet_id;
        this.menu_id = menuIngredient.menu_id;
        this.ingredient_id = menuIngredient.ingredient_id;
        this.quantity = menuIngredient.quantity;
        this.created_at = menuIngredient.created_at;
        this.updated_at = menuIngredient.updated_at;

        if (menuIngredient.Outlet) {
            this.outlet = {
                outlet_id: menuIngredient.Outlet.outlet_id,
                name: menuIngredient.Outlet.name,
            };
        }

        if (menuIngredient.MenuItem) {
            this.menu = {
                menu_id: menuIngredient.MenuItem.menu_id,
                name: menuIngredient.MenuItem.name,
            };
        }

        if (menuIngredient.Ingredient) {
            this.ingredient = {
                ingredient_id: menuIngredient.Ingredient.ingredient_id,
                name: menuIngredient.Ingredient.name,
            };
        }
    }

    toResponse() {
        return {
            menu_ingredient_id: this.menu_ingredient_id,
            outlet_id: this.outlet_id,
            menu_id: this.menu_id,
            ingredient_id: this.ingredient_id,
            quantity: this.quantity,
            created_at: this.created_at,
            updated_at: this.updated_at,
            ...(this.outlet && { outlet: this.outlet }),
            ...(this.menu && { menu: this.menu }),
            ...(this.ingredient && { ingredient: this.ingredient }),
        };
    }

    static formEntity(menuIngredient) {
        const dto = new MenuIngredientResponseDto(menuIngredient);
        return dto.toResponse();
    }

    static formEntities(menuIngredients) {
        return menuIngredients.map((menuIngredient) =>
            MenuIngredientResponseDto.formEntity(menuIngredient)
        );
    }
}

module.exports = MenuIngredientResponseDto;
