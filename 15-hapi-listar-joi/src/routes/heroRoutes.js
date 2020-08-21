const BaseRoute = require('./base/baseRoute')
const Joi = require('joi');

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
                    failAction: (request, headers, error) => {
                        throw error
                    },
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
                    return 'Erro interno no servidor'
                }
            }
        }
    }
}

module.exports = HeroRoutes;