const assert = require('assert')
const api = require('../api');
const Context = require('../db/strategies/base/contextStrategy')
const Postgres = require('../db/strategies/postgres/postgresSQLStrategy')
const UserSchema = require('../db/strategies/postgres/schemas/userSchema')

let app = {};

const USER = {
    username: 'teste',
    password: '123'
}

const USER_DB = {
    ...USER,
    password: '$2b$04$aWoCo3TESv/1BsNN0CX.jOpRoVPTFBaqwbcIIfIj4QkMgEqgsoSSy'
}

describe('Auth test suit', function () {
    this.beforeAll(async () => {
        app = await api;

        const connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection, UserSchema)
        const postgresContext = new Context(new Postgres(connection, model))
        await postgresContext.update(null, USER_DB, true)
    }); 

    it('Deve obter um token', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        })

        const statusCode = response.statusCode
        const data = JSON.parse(response.payload)

        assert.deepEqual(statusCode, 200)
        assert.ok(data.token.length > 10)
    })

    it('Não deve encontrar o usuário', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'eric',
                password: '123'
            }
        })

        const expectedResult = {
            statusCode: 401,
            error: 'Unauthorized',
            message: 'O usuário informado não existe'
        }

        const statusCode = response.statusCode
        const data = JSON.parse(response.payload)

        assert.deepEqual(statusCode, 401)
        assert.deepEqual(data, expectedResult)
    })

    it('Deve retornar usuário ou senha inválidos', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'teste',
                password: '12345'
            }
        })

        const expectedResult = {
            statusCode: 401,
            error: 'Unauthorized',
            message: 'Usuário ou senha inválidos'
        }

        const statusCode = response.statusCode
        const data = JSON.parse(response.payload)

        assert.deepEqual(statusCode, 401)
        assert.deepEqual(data, expectedResult)
    })
});