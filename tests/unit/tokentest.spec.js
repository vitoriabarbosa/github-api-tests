const { test, expect } = require('@playwright/test')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

test('Verificar se token está configurado', async () => {
    const token = process.env.GITHUB_TOKEN
    console.log('Token:', token ? `${token.substring(0, 10)}...` : 'NÃO ENCONTRADO')
    expect(token).toBeDefined()
    expect(token).not.toBe('')
})
