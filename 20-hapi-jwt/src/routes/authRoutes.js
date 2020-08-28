// npm i jsonwebtoken

const BaseRoute = require('./base/baseRoute')
const Joi = require('joi');
const Boom = require('boom');
const Jwt = require('jsonwebtoken')

const failAction = (request, headers, error) => {
    throw error
}

const USER = {
    username: 'teste',
    password: '123'
}

class AuthRoutes extends BaseRoute {
    constructor(secret) {
        super()
        this.secret = secret
    }

    login() {
        return {
            method: 'POST',
            path: '/login',
            config: {
                auth: false,
                description: 'Obter token',
                notes: 'Faz login com user e senha do banco',
                tags: ['api'],
                validate: {
                    failAction,
                    payload: Joi.object({
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    })
                },
                handler: async (request) => {
                    const {
                        username,
                        password
                    } = request.payload

                    if (username.toLowerCase() !== USER.username ||
                        password !== USER.password) {
                        return Boom.unauthorized()
                    }

                    return {
                        token: Jwt.sign({
                            username,
                            id: 1
                        }, this.secret)
                    }
                }
            }
        }
    }
}

module.exports = AuthRoutes