export default class BaseEntity {
    protected modelName: any

    constructor(modelname: any) {
        this.modelName = modelname;
    }

    async findOne(condition: any) {
        return await this.modelName.findOne({ where: condition })
    }
    async findAll(condition: any) {
        return await this.modelName.findAll(condition)
    }
    async findAllwithAttributes(condition: any) {
        return await this.modelName.findAll(condition)
    }
    async findAllcondition(condition: any) {
        return await this.modelName.findAll({ where: condition })
    }
    async create(payload: any) {
        return await this.modelName.create(payload)
    }
    async destroy(dataToDelete: any) {
        return await dataToDelete.destroy();
    }
    async update(payload: any, condition: any) {
        return await this.modelName.update(payload, condition);
    }
    async findByPk(condition: any, payload: any) {
        return await this.modelName.findByPk(condition, payload)

    }
}