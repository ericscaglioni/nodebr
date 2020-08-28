// npm i jsonwebtoken

const BaseRoute = require('./base/baseRoute')
const Joi = require('joi');
const Boom = require('boom');
const Jwt = require('jsonwebtoken')
const PasswordHelper = require('../helpers/passwordHelper')

const failAction = (request, headers, error) => {
    throw error
}

const USER = {
    username: 'teste',
    password: '123'
}

class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super()
        this.secret = secret
        this.db = db
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

                    const [user] = await this.db.read({
                        username: username.toLowerCase()
                    })

                    if (!user) {
                        return Boom.unauthorized('O usuário informado não existe')
                    }

                    const match = await PasswordHelper
                        .comparePassword(password, user.password);

                    if (!match) {
                        return Boom.unauthorized('Usuário ou senha inválidos')
                    }

                    // if (username.toLowerCase() !== USER.username ||
                    //     password !== USER.password) {
                    //     return Boom.unauthorized()
                    // }

                    return {
                        token: Jwt.sign({
                            username,
                            id: user.id
                        }, this.secret)
                    }
                }
            }
        }
    }
}

module.exports = AuthRoutes