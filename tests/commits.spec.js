const { test } = require('@playwright/test')
const ServiceFactory = require('../core/serviceFactory')
const Assertions = require('../core/assertions')
const testData = require('../fixtures/testData')

test.describe('Commits API Tests', () => {
    let serviceFactory
    let assertions

    test.beforeEach(async ({ request }) => {
        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        })
        assertions = new Assertions()
    })

    test('T013 - Listar commits de um repositório', { tag: ['@smoke', '@alta', '@commits'] }, async () => {
        const service = serviceFactory.getCommitsService()

        const response = await service.listCommits(testData.owner, testData.repo)

        assertions.assertStatus(response, 200)
    })

    test('T014 - Validar tratamento de erros para repositório inexistente', { tag: ['@funcional', '@alta', '@commits'] }, async ({ request }) => {
        const service = serviceFactory.getCommitsService()
        const response = await service.listCommits(testData.invalidOwner, testData.repo)
        const body = await response.json()

        assertions.assertStatus(response, 404)
        assertions.assertNotFound(body)
    })

    test.afterEach(() => {
        serviceFactory.cleanup()
    })
})
