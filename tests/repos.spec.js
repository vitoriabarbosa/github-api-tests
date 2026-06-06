const { test, expect } = require('@playwright/test')
const ServiceFactory = require('../core/serviceFactory')
const Assertions = require('../core/assertions')
const testData = require('../fixtures/testData')
const testContext = require('../core/testContext')
const dynamicCases = require('../fixtures/dynamic_test_cases.json')

test.describe('Repos API Tests', () => {
    let serviceFactory
    let assertions

    test.beforeAll(() => {
        if (process.env.GITHUB_TOKEN) {
            testContext.setGlobal('token', process.env.GITHUB_TOKEN)
        }
        testContext.setSuite('defaultUser', testData.validUser)
    })

    test.beforeEach(async ({ request }) => {
        testContext.clearTest()

        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        })
        assertions = new Assertions()

        const token = testContext.getGlobal('token')
        if (token) {
            serviceFactory.setAuthToken(token)
        }
    })

    dynamicCases.repos_scenarios.forEach((scenario) => {
        test(`${scenario.id} - ${scenario.description}`, async ({ request }) => {
            const service = serviceFactory.getReposService(request)
            const response = await service.getRepo(scenario.owner, scenario.repo)

            assertions.assertStatus(response, scenario.expected_status)

            if (scenario.expected_status === 200) {
                const body = await response.json()
                expect(body.private).toBe(scenario.private)
                expect(body.name).toBe(scenario.repo)
                expect(body.owner.login.toLowerCase()).toBe(scenario.owner.toLowerCase())
            }
        })
    })

    test('T018 - Listar repositórios com sucesso', async ({ request }) => {
        const service = serviceFactory.getReposService(request)
        const assertions = new Assertions()

        const user = testContext.getSuite('defaultUser')
        const response = await service.listRepos(user)
        const body = await response.json()

        assertions.assertStatus(response, 200)
        assertions.assertOwner(body, user)
    })

    test('T019 - Validar estrutura da resposta', async ({ request }) => {
        const service = serviceFactory.getReposService(request)
        const assertions = new Assertions()

        const user = testContext.getSuite('defaultUser')
        const response = await service.listRepos(user)

        assertions.assertStatus(response, 200)
    })

    test('T020 - Usuário inexistente', async ({ request }) => {
        const service = serviceFactory.getReposService(request)
        const assertions = new Assertions()

        testContext.setTest('invalidUserTarget', testData.invalidUser)

        const response = await service.listRepos(testContext.getTest('invalidUserTarget'))
        const body = await response.json()

        assertions.assertStatus(response, 404)
        assertions.assertNotFound(body)
    })

    test('T021 - Listar meus repositórios (autenticado)', async ({ request }) => {
        const hasToken = !!testContext.getGlobal('token')
        const isCI = process.env.GITHUB_ACTIONS === 'true'
        test.skip(
            !hasToken || isCI,
            'Este teste requer autenticação de usuário real (PAT) e é ignorado no CI'
        )
        const service = serviceFactory.getReposService()

        const response = await service.getAuthenticatedRepos()
        const body = await response.json()

        assertions.assertStatus(response, 200)
        expect(body).toBeInstanceOf(Array)
    })

    test.afterEach(() => {
        serviceFactory.cleanup()
    })

    test.afterAll(() => {
        testContext.clearSuite()
    })
})
