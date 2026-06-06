const { test, expect } = require('@playwright/test')
const ServiceFactory = require('../core/serviceFactory')
const Assertions = require('../core/assertions')
const testData = require('../fixtures/testData')
const dynamicCases = require('../fixtures/dynamic_test_cases.json')

test.describe('Issues API Tests', () => {
    let serviceFactory
    let assertions

    test.beforeEach(async ({ request }) => {
        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        })
        assertions = new Assertions()
    })

    dynamicCases.issues_pulls_filters.forEach((scenario) => {
        test(`${scenario.id} - ${scenario.description}`, async ({ request }) => {
            const service = serviceFactory.getIssuesService(request)
            const response = await service.listIssues(testData.owner, testData.repo, scenario.state)

            const expectedStatus = scenario.state === 'invalid_state_xyz' ? 422 : 200
            assertions.assertStatus(response, expectedStatus)

            if (scenario.state === 'open' || scenario.state === 'closed') {
                const body = await response.json()
                body.forEach((issue) => expect(issue.state).toBe(scenario.state))
            }
        })
    })

    test('T008 - Validar listagem geral de issues', async ({ request }) => {
        const service = serviceFactory.getIssuesService(request)
        const assertions = new Assertions()

        const response = await service.listIssues(testData.owner, testData.repo)
        const body = await response.json()

        assertions.assertStatus(response, 200)
        assertions.assertContentType(response)
    })

    test('T009 - Validar filtro de status das issues', async ({ request }) => {
        const service = serviceFactory.getIssuesService(request)
        const assertions = new Assertions()

        const response = await service.listIssues(testData.owner, testData.repo, 'open')
        const body = await response.json()

        assertions.assertStatus(response, 200)
        body.forEach((issue) => expect(issue.state).toBe('open'))
    })

    test('T010 - Deve validar estrutura das issues retornadas', async () => {
        const service = serviceFactory.getIssuesService()

        const response = await service.listIssues(
            testData.owner,
            testData.repo
        )

        const body = await response.json()

        assertions.assertStatus(response, 200)

        expect(Array.isArray(body)).toBeTruthy()

        if (body.length > 0) {
            const issue = body[0]

            expect(issue).toHaveProperty('id')
            expect(issue).toHaveProperty('number')
            expect(issue).toHaveProperty('title')
            expect(issue).toHaveProperty('state')
            expect(issue).toHaveProperty('user')

            expect(typeof issue.id).toBe('number')
            expect(typeof issue.number).toBe('number')
            expect(typeof issue.title).toBe('string')
            expect(typeof issue.state).toBe('string')
        }
    })
    test('T011 - Deve validar dados do autor da issue', async () => {
        const service = serviceFactory.getIssuesService()

        const response = await service.listIssues(
            testData.owner,
            testData.repo
        )

        const body = await response.json()

        if (body.length > 0) {
            const issue = body[0]

            expect(issue.user).toHaveProperty('login')
            expect(issue.user).toHaveProperty('id')

            expect(typeof issue.user.login).toBe('string')
            expect(typeof issue.user.id).toBe('number')
        }
    })
    test('T012 - Deve validar headers da resposta', async () => {
        const service = serviceFactory.getIssuesService()

        const response = await service.listIssues(
            testData.owner,
            testData.repo
        )

        assertions.assertStatus(response, 200)

        const headers = response.headers()

        expect(headers['content-type'])
            .toContain('application/json')

        expect(headers)
            .toHaveProperty('x-ratelimit-limit')
    })

    test('T013 - Deve validar unicidade dos IDs', async () => {
        const service = serviceFactory.getIssuesService()

        const response = await service.listIssues(
            testData.owner,
            testData.repo
        )

        const body = await response.json()

        const ids = body.map(issue => issue.id)

        const uniqueIds = [...new Set(ids)]

        expect(uniqueIds.length)
            .toBe(ids.length)
    })
    test('T014 - Deve respeitar paginação configurada', async () => {
        const service = serviceFactory.getIssuesService()

        const response = await service.listIssues(
            testData.owner,
            testData.repo,
            null,
            {
                page: 1,
                perPage: 5
            }
        )

        const body = await response.json()

        expect(body.length)
            .toBeLessThanOrEqual(5)
    })

    test.afterEach(() => {
        serviceFactory.cleanup()
    })
})
