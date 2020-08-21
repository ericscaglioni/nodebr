const assert = require('assert')
const api = require('../api')

let app = {};

describe('Suite de testes da API Heroes', function () {
    this.beforeAll(async () => {
        app = await api
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

        assert.deepEqual(response.payload, 'Erro interno no servidor');
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
})