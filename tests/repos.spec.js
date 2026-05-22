const {test, expect}=require('@playwright/test')
const ServiceFactory = require('../core/serviceFactory');
const Assertions=require('../core/assertions')
const testData=require('../fixtures/testData')
const testContext = require('../core/testContext');

test.describe('Repos API Tests', () => {
    let serviceFactory;
    let assertions;

    test.beforeAll(() => {
        if (process.env.GITHUB_TOKEN) {
            testContext.setGlobal('token', process.env.GITHUB_TOKEN);
        }
        testContext.setSuite('defaultUser', testData.validUser);
    });

    test.beforeEach(async ({ request }) => {
        testContext.clearTest();

        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        });
        assertions = new Assertions();

        const token = testContext.getGlobal('token');
        if (token) {
            serviceFactory.setAuthToken(token);
        }
    });

   
    test('T010 - Listar repositórios com sucesso', async ({ request }) => {
        const service = serviceFactory.getReposService(request)
        const assertions = new Assertions()

        const user = testContext.getSuite('defaultUser');
        const response=await service.listRepos(user)
        const body=await response.json()

        assertions.assertStatus(response, 200)
        assertions.assertOwner(body, user)
    })

    test('T011 - Validar estrutura da resposta', async ({ request }) => {
        const service = serviceFactory.getReposService(request)
        const assertions = new Assertions()

        const user = testContext.getSuite('defaultUser');
        const response=await service.listRepos(user)

        assertions.assertStatus(response, 200)
    })

    test('T012 - Usuário inexistente', async ({ request }) => {
        const service = serviceFactory.getReposService(request)
        const assertions = new Assertions()

        testContext.setTest('invalidUserTarget', testData.invalidUser);

        const response=await service.listRepos(testContext.getTest('invalidUserTarget'))
        const body=await response.json()

        assertions.assertStatus(response, 404)
        assertions.assertNotFound(body)
    })

    test('T015 - Listar meus repositórios (autenticado)', async ({ request }) => {
        const hasToken = !!testContext.getGlobal('token');
        test.skip(!hasToken, 'Este teste requer autenticação - configure a variável de escopo global token');
        const service = serviceFactory.getReposService();
        
        const response = await service.getAuthenticatedRepos();
        const body = await response.json();
        
        assertions.assertStatus(response, 200);
        expect(body).toBeInstanceOf(Array);
    });

    test.afterEach(() => {
        serviceFactory.cleanup();
    });

    test.afterAll(() => {
        // Limpeza dos dados da suite
        testContext.clearSuite();
    });

});