const BaseDto = require('../baseDto');

class DeleteInventoryDto extends BaseDto {
    constructor(params, user) {
        this.inventory_id = params.id;
        this.user_id = user.user_id;
    }

    toLogEntity(action = 'delete_inventory') {
        return {
            user_id: this.user_id,
            action,
            table_name: 'inventories',
            record: this.inventory_id,
            desctiption: `Deleted inventory : ${this.inventory_id}`,
        };
    }

    static formRequest(req) {
        DeleteInventoryDto.validateRequest(req);
        const dto = new DeleteInventoryDto(req.params, req.user);
        return dto;
    }
}

module.exports = DeleteInventoryDto;
