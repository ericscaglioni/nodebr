const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'Eric@3211234'
const HASH = '$2b$04$XH/C8VU5c06MwvSqqZdiCOmHW.opynVQHwddLiyMYLsfkf6SeHWdm'

describe('PasswordHelper test suit', function () {
    it('deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)
        assert.ok(result.length > 10)
    })

    it('deve validar a senha a partir do HASH', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)
        assert.ok(result)
    })
})