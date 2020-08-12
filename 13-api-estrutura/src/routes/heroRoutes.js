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
            handler: (request, headers) => {
                try {
                    console.log('chegou', request)
                    const {
                        skip,
                        limit,
                        nome
                    } = request.query

                    console.log('skip', skip)
                    console.log('limit', limit)

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