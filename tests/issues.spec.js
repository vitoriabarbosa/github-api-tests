const {test, expect}=require('@playwright/test')
const ServiceFactory = require('../core/serviceFactory');
const Assertions=require('../core/assertions')
const testData=require('../fixtures/testData')

test.describe('Issues API Tests', () => {
    let serviceFactory;
    let assertions;

    test.beforeEach(async ({ request }) => {
        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        });
        assertions = new Assertions();
    });

    test('T005 - Validar listagem geral de issues', async ({ request }) => {
        const service = serviceFactory.getIssuesService(request)
        const assertions = new Assertions()

    const response=await service.listIssues(testData.owner, testData.repo)
    const body=await response.json()

    assertions.assertStatus(response, 200)
    assertions.assertContentType(response)
})

    test('T006 - Validar filtro de status das issues', async ({ request }) => {
        const service = serviceFactory.getIssuesService(request)
    const assertions = new Assertions()

    const response=await service.listIssues(testData.owner, testData.repo, 'open')
    const body=await response.json()

    assertions.assertStatus(response, 200)
    body.forEach(issue => expect(issue.state).toBe('open'))
    })

    test.afterEach(() => {
        serviceFactory.cleanup();
    });
});
