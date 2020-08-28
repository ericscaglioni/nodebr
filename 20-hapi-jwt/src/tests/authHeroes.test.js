const assert = require('assert')
const api = require('../api');

let app = {};

describe('Auth test suit', function () {
    this.beforeAll(async () => {
        app = await api;
    });

    it('Deve obter um token', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'teste',
                password: '123'
            }
        })

        const statusCode = response.statusCode
        const data = JSON.parse(response.payload)

        assert.deepEqual(statusCode, 200)
        assert.ok(data.token.length > 10)
    })
});