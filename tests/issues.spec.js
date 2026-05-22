const {test, expect}=require('@playwright/test')
const ServiceFactory = require('../core/serviceFactory');
const Assertions=require('../core/assertions')
const testData=require('../fixtures/testData')
const dynamicCases = require('../fixtures/dynamic_test_cases.json');

test.describe('Issues API Tests', () => {
    let serviceFactory;
    let assertions;

    test.beforeEach(async ({ request }) => {
        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        });
        assertions = new Assertions();
    });

    dynamicCases.issues_pulls_filters.forEach((scenario) => {
        test(`${scenario.id} - ${scenario.description}`, async ({ request }) => {
            const service = serviceFactory.getIssuesService(request);
            const response = await service.listIssues(testData.owner, testData.repo, scenario.state);
            
            const expectedStatus = scenario.state === 'invalid_state_xyz' ? 422 : 200;
            assertions.assertStatus(response, expectedStatus);
            
            if (scenario.state === 'open' || scenario.state === 'closed') {
                const body = await response.json();
                body.forEach(issue => expect(issue.state).toBe(scenario.state));
            }
        });
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
