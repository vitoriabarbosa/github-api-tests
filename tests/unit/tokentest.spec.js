const { test, expect } = require('@playwright/test')
require('dotenv').config()

test('Verificar se token está configurado', { tag: ['@unidade', '@alta', '@nucleo'] }, async () => {
    const token = process.env.GITHUB_TOKEN
    console.log('Token:', token ? `${token.substring(0, 10)}...` : 'NÃO ENCONTRADO')
    expect(token).toBeDefined()
    expect(token).not.toBe('')
})
