const { test, expect } = require('@playwright/test')
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

<<<<<<< HEAD
    test('T007 - Deve buscar repositórios filtrados por linguagem', async () => {
        const service = serviceFactory.getReposService()
=======
    test('T003 - Teste de Validação de Parametrização de Linguagem', { tag: ['@funcional', '@media', '@filtros'] }, async ({ request }) => {
        const service = serviceFactory.getReposService(request)
>>>>>>> cf7e18bced28ef07028b5af4a6c6641d9a8ad190

        const response = await service.searchByLanguage(
            testData.searchLanguage
        )

        assertions.assertStatus(response, 200)

        const body = await response.json()

        expect(body).toHaveProperty('items')
        expect(Array.isArray(body.items)).toBeTruthy()
        expect(body.items.length).toBeGreaterThan(0)

        body.items.forEach(repo => {
            expect(repo).toHaveProperty('name')
            expect(repo).toHaveProperty('owner')
            expect(repo).toHaveProperty('html_url')

            expect(typeof repo.name).toBe('string')
            expect(typeof repo.html_url).toBe('string')
        })

        expect(body.total_count).toBeGreaterThan(0)
    })

<<<<<<< HEAD
    test('T008 - Deve respeitar limite de resultados por página', async () => {
        const service = serviceFactory.getIssuesService()
=======
    test('T004 - Teste de Limitação de Resultados por Página', { tag: ['@funcional', '@media', '@filtros'] }, async ({ request }) => {
        const service = serviceFactory.getIssuesService(request)
>>>>>>> cf7e18bced28ef07028b5af4a6c6641d9a8ad190

        const response = await service.listIssues(
            testData.owner,
            testData.repo,
            null,
            testData.pagination
        )

        const body = await response.json()

        assertions.assertStatus(response, 200)

        expect(Array.isArray(body)).toBeTruthy()

        expect(body.length)
            .toBeLessThanOrEqual(testData.pagination.perPage)

        body.forEach(issue => {
            expect(issue).toHaveProperty('id')
            expect(issue).toHaveProperty('title')
            expect(issue).toHaveProperty('state')

            expect(typeof issue.title).toBe('string')
        })
    })

    test('T009 - Deve retornar páginas diferentes', async () => {
        const service = serviceFactory.getIssuesService()

        const pageOne = await service.listIssues(
            testData.owner,
            testData.repo,
            null,
            {
                page: 1,
                perPage: 5
            }
        )

        const pageTwo = await service.listIssues(
            testData.owner,
            testData.repo,
            null,
            {
                page: 2,
                perPage: 5
            }
        )

        const issuesOne = await pageOne.json()
        const issuesTwo = await pageTwo.json()

        expect(issuesOne[0].id)
            .not.toBe(issuesTwo[0].id)
    })
    test('T010 - Deve retornar apenas issues abertas', async () => {
        const service = serviceFactory.getIssuesService()

        const response = await service.listIssues(
            testData.owner,
            testData.repo,
            'open'
        )

        const body = await response.json()

        assertions.assertStatus(response, 200)

        body.forEach(issue => {
            expect(issue.state).toBe('open')
        })
    })

    test.afterEach(() => {
        serviceFactory.cleanup()
    })
})
