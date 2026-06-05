const { test, expect } = require('@playwright/test')
const ServiceFactory = require('../../core/serviceFactory')
const SchemaValidator = require('../../core/schemaValidator')
const testData = require('../../fixtures/testData')

test.describe('Schema Validation Tests', () => {
    let serviceFactory
    let validator

    test.beforeEach(async ({ request }) => {
        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        })
        validator = new SchemaValidator({ throwOnError: false })
    })

    test('SCHEMA-001 - Validar esquema de usuário com dados reais', async () => {
        const usersService = serviceFactory.getUsersService()
        const response = await usersService.getUser(testData.validUser)
        const body = await response.json()
        expect(body).toHaveProperty('id')
        expect(body).toHaveProperty('login')
        expect(body).toHaveProperty('avatar_url')
        expect(body).toHaveProperty('type')
        
        console.log('Usuário validado:', body.login)
    })

    test('SCHEMA-002 - Validar esquema de repositório', async () => {
        const reposService = serviceFactory.getReposService()
        const response = await reposService.getRepo(testData.owner, testData.repo)
        const body = await response.json()

        expect(body).toHaveProperty('id')
        expect(body).toHaveProperty('name')
        expect(body).toHaveProperty('full_name')
        expect(body).toHaveProperty('private')
        expect(body.owner).toHaveProperty('login')
        
        console.log('Repositório validado:', body.full_name)
    })

    test('SCHEMA-003 - Validar que o UsersService funciona com validação', async () => {
        const usersService = serviceFactory.getUsersService()
        
        const response = await usersService.getUser(testData.validUser)
        expect(response.status()).toBe(200)
        
        console.log('UsersService validation passed')
    })
})