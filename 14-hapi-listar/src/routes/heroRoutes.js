const BaseRoute = require('./base/baseRoute')

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super();
        this.db = db;
    }

    list() {
        return {
            method: 'GET',
            path: '/herois',
            handler: (request) => {
                try {
                    const {
                        skip,
                        limit,
                        nome
                    } = request.query

                    let query = {}
                    if (nome) {
                        query.nome = nome
                    }

                    return this.db.read(
                        query,
                        parseInt(skip),
                        parseInt(limit)
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