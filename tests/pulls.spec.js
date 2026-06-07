const { test, expect } = require('@playwright/test')
const ServiceFactory = require('../core/serviceFactory')
const Assertions = require('../core/assertions')
const testData = require('../fixtures/testData')
const dynamicCases = require('../fixtures/dynamic_test_cases.json')

test.describe('Pulls API Tests', () => {
    let serviceFactory
    let assertions

    test.beforeEach(async ({ request }) => {
        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        })
        assertions = new Assertions()
    })

    dynamicCases.issues_pulls_filters.forEach((scenario) => {
        test(`${scenario.id} - ${scenario.description}`, { tag: [...scenario.tags, '@pulls'] }, async ({ request }) => {
            const service = serviceFactory.getPullsService(request)
            const response = await service.listPulls(testData.owner, testData.repo, scenario.state)

            assertions.assertStatus(response, 200)

            if (scenario.state === 'open' || scenario.state === 'closed') {
                const body = await response.json()
                body.forEach((pr) => expect(pr.state).toBe(scenario.state))
            }
        })
    })

    test('T001 - Pull Requests open', { tag: ['@smoke', '@alta', '@pulls'] }, async ({ request }) => {
        const service = serviceFactory.getPullsService(request)
        const assertions = new Assertions()

        const response = await service.listPulls(testData.owner, testData.repo, 'open')
        const body = await response.json()

        assertions.assertStatus(response, 200)
        body.forEach((pr) => expect(pr.state).toBe('open'))
    })

    test('T002 - Pull Requests closed', { tag: ['@funcional', '@alta', '@pulls'] }, async ({ request }) => {
        const service = serviceFactory.getPullsService(request)
        const assertions = new Assertions()

        const response = await service.listPulls(testData.owner, testData.repo, 'closed')
        const body = await response.json()

        assertions.assertStatus(response, 200)
        body.forEach((pr) => expect(pr.state).toBe('closed'))
    })

    test.afterEach(() => {
        serviceFactory.cleanup()
    })
})
