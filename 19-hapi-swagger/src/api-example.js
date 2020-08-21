// npm install hapi

const Hapi = require('@hapi/hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDb = require('./db/strategies/mongodb/mongoDbStrategy');
const HeroisSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const app = Hapi.Server({
    port: 5000
})

async function main () {
    const connection = MongoDb.connect();
    const context = new Context(new MongoDb(connection, HeroisSchema));
    app.route([
        {
            path: '/herois',
            method: 'GET',
            handler: (request, head) => context.read()
        }
    ]);

    await app.start();
    console.log('servidor rodando na porta', app.info.port);
}

main()