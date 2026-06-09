const { test } = require('@playwright/test')
const ServiceFactory = require('../core/serviceFactory')
const Assertions = require('../core/assertions')
const testData = require('../fixtures/testData')

test.describe('Filters API Tests', () => {
    let serviceFactory
    let assertions

    test.beforeEach(async ({ request }) => {
        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        })
        assertions = new Assertions()
    })

    test('T003 - Teste de Validação de Parametrização de Linguagem', { tag: ['@funcional', '@media', '@filtros'] }, async ({ request }) => {
        const service = serviceFactory.getReposService(request)

        const response = await service.searchByLanguage(testData.searchLanguage)

        assertions.assertStatus(response, 200)
    })

    test('T004 - Teste de Limitação de Resultados por Página', { tag: ['@funcional', '@media', '@filtros'] }, async ({ request }) => {
        const service = serviceFactory.getIssuesService(request)

        const response = await service.listIssues(
            testData.owner,
            testData.repo,
            null,
            testData.pagination
        )
        const body = await response.json()

        assertions.assertStatus(response, 200)
        assertions.assertPagination(body, testData.pagination.perPage)
    })

    test.afterEach(() => {
        serviceFactory.cleanup()
    })
})
