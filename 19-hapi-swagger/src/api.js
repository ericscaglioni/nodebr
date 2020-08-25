// npm install hapi
// npm i @hapi/vision @hapi/inert hapi-swagger

const Hapi = require('@hapi/hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDb = require('./db/strategies/mongodb/mongoDbStrategy');
const HeroisSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const HeroRoutes = require('./routes/heroRoutes');
const HapiSwagger = require('hapi-swagger')
const Vision = require('@hapi/vision')
const Inert = require('@hapi/inert')

const app = Hapi.Server({
    port: 5000
});

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main () {
    const connection = MongoDb.connect();
    const context = new Context(new MongoDb(connection, HeroisSchema));
    
    const swaggerOptions = {
        info: {
            title: 'Api Herois - #CursoNodeBR',
            version: 'v1.0'
        }
    }

    await app.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.route(
        mapRoutes(new HeroRoutes(context), HeroRoutes.methods())
    );

    await app.start();
    console.log('servidor rodando na porta', app.info.port);
    return app;
}

module.exports = main()