const assert = require('assert')
const api = require('../api')

let app = {};

const MOCK_HEROI_INICIAL = {
    nome: 'Vegeta',
    poder: 'Galick Ho'
}

describe('Suite de testes da API Heroes', function () {
    this.beforeAll(async () => {
        app = await api;

        const response = await app.inject({
            method: 'POST',
            url: '/herois',
            payload: JSON.stringify(MOCK_HEROI_INICIAL)
        })

        const { _id } = JSON.parse(response.payload)
        MOCK_HEROI_INICIAL._id = _id
    });

    it('GET /herois', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=10'
        });
        const statusCode = response.statusCode;
        const data = JSON.parse(response.payload);

        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(data));
    });

    it('GET /herois deve trazer 2 registros', async () => {
        const TAMANHO_LIMITE = 2;

        const response = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        });

        const statusCode = response.statusCode;
        const data = JSON.parse(response.payload);

        assert.deepEqual(statusCode, 200);
        assert.ok(data.length === TAMANHO_LIMITE);
    });

    it('GET /herois deve dar exceção', async () => {
        const TAMANHO_LIMITE = 'TESTE';

        const response = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        });

        const statusCode = response.statusCode;
        const result = JSON.parse(response.payload);
        
        const errorResult = {
            statusCode: 400,
            error: 'Bad Request',
            message: '\"limit\" must be a number',
            validation: {
                source: 'query',
                keys: [ 'limit']
            }
        }

        assert.deepEqual(statusCode, 400);
        assert.deepEqual(result, errorResult);
    });

    it('GET /herois deve retornar apenas 1 item', async () => {
        const TAMANHO_LIMITE = 1000;
        const NOME = 'Mulher Maravilha';

        const response = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}&nome=${NOME}`
        });

        const dados = JSON.parse(response.payload);
        assert.deepEqual(response.statusCode, 200);
        assert.deepEqual(dados[0].nome, NOME);
    });

    it('POST /herois', async () => {
        const MOCK_HEROI_CADASTRAR = {
            nome: 'Goku',
            poder: 'Kamehameha'
        };

        const response = await app.inject({
            method: 'POST',
            url: `/herois`,
            payload: MOCK_HEROI_CADASTRAR
        });

        const statusCode = response.statusCode;
        const { message, _id } = JSON.parse(response.payload)
        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, 'Herói cadastrado com sucesso!')
    });

    it('PATCH /herois/:id - success', async () => {
        const MOCK_HEROI_ATUALIZAR = {
            nome: 'Vegeta',
            poder: 'Final Flash'
        }

        const response = await app.inject({
            method: 'PATCH',
            url: `/herois/${MOCK_HEROI_INICIAL._id}`,
            payload: MOCK_HEROI_ATUALIZAR
        });

        const statusCode = response.statusCode;
        const { message } = JSON.parse(response.payload)
        assert.ok(statusCode === 200)
        assert.deepEqual(message, 'Herói atualizado com sucesso!')
    });

    it('PATCH /herois/:id - fail to update', async () => {
        const MOCK_HEROI_ATUALIZAR = {
            nome: 'Vegeta',
            poder: 'Final Flash'
        }

        const response = await app.inject({
            method: 'PATCH',
            url: `/herois/5f401b7586856e26b89fbb57`,
            payload: MOCK_HEROI_ATUALIZAR
        });

        const expectedPayload = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id não encontrado no banco de dados'
        }

        const statusCode = response.statusCode;
        const data = JSON.parse(response.payload)
        assert.ok(statusCode === 412)
        assert.deepEqual(data, expectedPayload)
    });

    it('PATCH /herois/:id - exception', async () => {
        const MOCK_HEROI_ATUALIZAR = {
            nome: 'Vegeta',
            poder: 'Final Flash'
        }

        const response = await app.inject({
            method: 'PATCH',
            url: `/herois/ID_INVALIDO`,
            payload: MOCK_HEROI_ATUALIZAR
        });

        const expectedPayload = {
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'An internal server error occurred'
        }

        const statusCode = response.statusCode;
        const data = JSON.parse(response.payload)
        assert.ok(statusCode === 500)
        assert.deepEqual(data, expectedPayload)
    });

    it('DELETE /herois/:id - success', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: `/herois/${MOCK_HEROI_INICIAL._id}`
        });

        const statusCode = response.statusCode;
        const { message } = JSON.parse(response.payload)
        assert.ok(statusCode === 200)
        assert.deepEqual(message, 'Herói removido com sucesso!')
    });

    it('DELETE /herois/:id - fail to remove', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: `/herois/5f4027c1a426f53762b7ba89`
        });

        const expectedPayload = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id não encontrado no banco de dados'
        }

        const statusCode = response.statusCode;
        const data = JSON.parse(response.payload)

        assert.ok(statusCode === 412)
        assert.deepEqual(data, expectedPayload)
    });

    it('DELETE /herois/:id - exception', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: `/herois/ID_INVALIDO`
        });

        const expectedPayload = {
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'An internal server error occurred'
        }

        const statusCode = response.statusCode;
        const data = JSON.parse(response.payload)

        assert.ok(statusCode === 500)
        assert.deepEqual(data, expectedPayload)
    });
})