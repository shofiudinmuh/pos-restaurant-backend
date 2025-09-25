const ApiError = require('../utils/apiError');

class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async findById(id, options = {}) {
        try {
            return await this.model.findByPk(id, options);
        } catch (error) {
            throw new ApiError(`Failed to fetch model ${this.model.name}`, 500);
        }
    }

    async findAll(options = {}) {
        try {
            return await this.model.findAndCountAll(options);
        } catch (error) {
            throw new ApiError(`Failed to fetch ${this.model.name}s`, 500);
        }
    }

    async create(data, options = {}) {
        try {
            return await this.model.create(data, options);
        } catch (error) {
            throw new ApiError(`Failed to create ${this.model.name}`, 500);
        }
    }

    async update(id, data, options = {}) {
        try {
            const record = await this.model.findByPk(id);
            if (!record) {
                throw new ApiError(`${this.model.name} not found`, 404);
            }

            return await this.model.update(data, options);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError(`Failed to update ${this.model.name}`, 500);
        }
    }

    async delete(id, options = {}) {
        try {
            const record = await this.model.findByPk(id);
            if (!record) {
                throw new ApiError(`${this.model.name} not found`, 404);
            }

            return await this.model.destroy(options);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError(`Failed to delete ${this.model.name}`);
        }
    }

    async getSequelizeInstance() {
        return this.model.sequelize;
    }
}

module.exports = BaseRepository;
