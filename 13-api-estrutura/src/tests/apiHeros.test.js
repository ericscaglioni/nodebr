const assert = require('assert')
const api = require('./../api')

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
})