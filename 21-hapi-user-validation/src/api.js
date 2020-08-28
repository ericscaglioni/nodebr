// npm install hapi
// npm i @hapi/vision @hapi/inert hapi-swagger
// npm i hapi-auth-jwt2

// npm i bcrypt

const Hapi = require('@hapi/hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDb = require('./db/strategies/mongodb/mongoDbStrategy');
const HeroisSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const HeroRoutes = require('./routes/heroRoutes');
const AuthRoutes = require('./routes/authRoutes');
const HapiSwagger = require('hapi-swagger')
const Vision = require('@hapi/vision')
const Inert = require('@hapi/inert')
const HapiJwt = require('hapi-auth-jwt2')
const Postgres = require('./db/strategies/postgres/postgresSQLStrategy')
const UserSchema = require('./db/strategies/postgres/schemas/userSchema')

const JWT_SECRET = 'MEU_SEGREDÃO_123'

const app = Hapi.Server({
    port: 5000
});

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDb.connect();
    const context = new Context(new MongoDb(connection, HeroisSchema));

    const postgresConnection = await Postgres.connect()
    const model = await Postgres.defineModel(postgresConnection, UserSchema)
    const postgresContext = new Context(new Postgres(postgresConnection, model))

    const swaggerOptions = {
        info: {
            title: 'Api Herois - #CursoNodeBR',
            version: 'v1.0'
        }
    }

    await app.register([
        HapiJwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // },
        validate: async (data, request) => {
            // verifica no banco se usuário continua ativo
            // verifica no banco se usuário continua pagando
            const [user] = await postgresContext.read({
                username: data.username.toLowerCase()
            });

            if (!user) {
                return {
                    isValid: false
                }
            }

            return {
                isValid: true
            }
        }
    })

    app.auth.default('jwt')

    app.route([
        ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET, postgresContext), AuthRoutes.methods())
    ]);

    await app.start();
    console.log('servidor rodando na porta', app.info.port);
    return app;
}

module.exports = main()