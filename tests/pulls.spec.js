const {test, expect}=require('@playwright/test')
const ServiceFactory = require('../core/serviceFactory');
const Assertions=require('../core/assertions')
const testData=require('../fixtures/testData')

test.describe('Pulls API Tests', () => {
    let serviceFactory;
    let assertions;

    test.beforeEach(async ({ request }) => {
        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        });
        assertions = new Assertions();
    });

    test('T001 - Pull Requests open', async ({ request }) => {
        const service = serviceFactory.getPullsService(request)
        const assertions = new Assertions()

        const response=await service.listPulls(testData.owner, testData.repo, 'open')
        const body=await response.json()

        assertions.assertStatus(response, 200)
        body.forEach(pr => expect(pr.state).toBe('open'))
    })

    test('T002 - Pull Requests closed', async ({ request }) => {
        const service = serviceFactory.getPullsService(request)
        const assertions = new Assertions()

        const response=await service.listPulls(testData.owner, testData.repo, 'closed')
        const body=await response.json()

        assertions.assertStatus(response, 200)
        body.forEach(pr => expect(pr.state).toBe('closed'))
    })

    test.afterEach(() => {
        serviceFactory.cleanup();
    });
});