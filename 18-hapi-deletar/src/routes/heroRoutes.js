const BaseRoute = require('./base/baseRoute')
const Joi = require('joi');
const Boom = require('boom');

const failAction = (request, headers, error) => {
    throw error
}

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super();
        this.db = db;
    }

    list() {
        return {
            method: 'GET',
            path: '/herois',
            config: {
                validate: {
                    // payload => body
                    // headers => header
                    // params => na URL:id
                    // query => skip=0&limit=10
                    failAction,
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    })
                }
            },
            handler: (request) => {
                try {
                    const {
                        skip,
                        limit,
                        nome
                    } = request.query

                    const query = {
                        nome: {
                            $regex: `.*${nome || ''}.*`
                        }
                    }

                    return this.db.read(
                        query,
                        skip,
                        limit
                    );
                } catch (error) {
                    console.error('DEU RUIM', error);
                    return Boom.internal();
                }
            }
        }
    }

    create() {
        return {
            method: 'POST',
            path: '/herois',
            config: {
                validate: {
                    failAction,
                    payload: Joi.object({
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(3).max(100)
                    })
                }
            },
            handler: async (request) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this.db.create({ nome, poder });
                    return {
                        _id: result._id,
                        message: 'Herói cadastrado com sucesso!'
                    }
                } catch (error) {
                    console.error('DEU RUIM', error);
                    return Boom.internal();
                }
            }
        }
    }

    update() {
        return {
            method: 'PATCH',
            path: '/herois/{id}',
            config: {
                validate: {
                    failAction,
                    params: Joi.object({
                        id: Joi.string().required()
                    }),
                    payload: Joi.object({
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(3).max(100)
                    })
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params
                    const { payload } = request
                    const strData = JSON.stringify(payload);
                    const data = JSON.parse(strData);

                    const result = await this.db.update(id, data);

                    if (result.nModified !== 1)
                        return Boom.preconditionFailed('Id não encontrado no banco de dados')

                    return {
                        message: 'Herói atualizado com sucesso!'
                    }
                } catch (error) {
                    console.error('DEU RUIM', error);
                    return Boom.internal();
                }
            }
        }
    }

    delete() {
        return {
            method: 'DELETE',
            path: '/herois/{id}',
            config: {
                validate: {
                    failAction,
                    params: Joi.object({
                        id: Joi.string().required()
                    })
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params

                    const result = await this.db.delete(id);
                    if (result.n !== 1)
                        return Boom.preconditionFailed('Id não encontrado no banco de dados')

                    return {
                        message: 'Herói removido com sucesso!'
                    }
                } catch (error) {
                    console.error('DEU RUIM', error);
                    return Boom.internal();
                }
            }
        }
    }
}

module.exports = HeroRoutes;