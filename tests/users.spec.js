const { test } = require('@playwright/test')
const ServiceFactory = require('../core/serviceFactory')
const Assertions = require('../core/assertions')
const testData = require('../fixtures/testData')
const testContext = require('../core/testContext')
const dynamicCases = require('../fixtures/dynamic_test_cases.json')

test.describe('Users API Tests', () => {
    let serviceFactory
    let assertions

    test.beforeAll(() => {
        if (process.env.GITHUB_TOKEN) {
            testContext.setGlobal('token', process.env.GITHUB_TOKEN)
        }
        testContext.setSuite('validUser', testData.validUser)
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

    dynamicCases.users_scenarios.forEach((scenario) => {
        test(`${scenario.id} - ${scenario.description}`, async () => {
            const usersService = serviceFactory.getUsersService()
            const response = await usersService.getUser(scenario.username)

            assertions.assertStatus(response, scenario.expected_status)

            if (scenario.expected_status === 200) {
                assertions.assertContentType(response)
            } else if (scenario.expected_status === 404) {
                const body = await response.json()
                assertions.assertNotFound(body)
            }
        })
    })

    test('T011 - Validar busca de usuário válido', async () => {
        const usersService = serviceFactory.getUsersService()

        const user = testContext.getSuite('validUser')
        const response = await usersService.getUser(user)
        const body = await response.json()

        assertions.assertStatus(response, 200)
        assertions.assertContentType(response)
    })

    test('T012 - Validar comportamento para usuário inexistente', async () => {
        const usersService = serviceFactory.getUsersService()

        const response = await usersService.getUser(testData.invalidUser)
        const body = await response.json()

        assertions.assertStatus(response, 404)
        assertions.assertNotFound(body)
    })

    test('T013 - Validar estrutura da resposta do usuário', async ({ request }) => {
        const service = serviceFactory.getUsersService(request)
        const assertions = new Assertions()

        const user = testContext.getSuite('validUser')
        const response = await service.getUser(user)
        const body = await response.json()

        assertions.assertStatus(response, 200)
        assertions.assertContentType(response)
    })

    test.afterEach(() => {
        serviceFactory.cleanup()
    })

    test.afterAll(() => {
        testContext.clearSuite()
    })
})
