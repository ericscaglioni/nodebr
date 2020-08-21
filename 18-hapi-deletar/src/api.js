// npm install hapi

const Hapi = require('@hapi/hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDb = require('./db/strategies/mongodb/mongoDbStrategy');
const HeroisSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const HeroRoutes = require('./routes/heroRoutes');
const app = Hapi.Server({
    port: 5000
});

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main () {
    const connection = MongoDb.connect();
    const context = new Context(new MongoDb(connection, HeroisSchema));
    
    app.route([
        ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods())
    ]);

    await app.start();
    console.log('servidor rodando na porta', app.info.port);
    return app;
}

module.exports = main()