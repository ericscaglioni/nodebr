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
            url: '/herois'
        });
        const statusCode = response.statusCode;
        const data = JSON.parse(response.payload);

        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(data));
    });

    it.only('GET /herois deve trazer 2 registros', async () => {
        const TAMANHO_LIMITE = 2;

        const response = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=2`
        });

        const statusCode = response.statusCode;
        const data = JSON.parse(response.payload);

        assert.deepEqual(statusCode, 200);
        assert.ok(data.length === TAMANHO_LIMITE);
    });
})