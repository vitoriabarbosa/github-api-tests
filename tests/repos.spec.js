const {test, expect}=require('@playwright/test')
const ServiceFactory = require('../core/serviceFactory');
const Assertions=require('../core/assertions')
const testData=require('../fixtures/testData')

test.describe('Repos API Tests', () => {
    let serviceFactory;
    let assertions;

    test.beforeEach(async ({ request }) => {
        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        });
        assertions = new Assertions();

        if (process.env.GITHUB_TOKEN) {
            serviceFactory.setAuthToken(process.env.GITHUB_TOKEN);
        }
    });

   
    test('T010 - Listar repositórios com sucesso', async ({ request }) => {
        const service = serviceFactory.getReposService(request)
        const assertions = new Assertions()

        const response=await service.listRepos(testData.validUser)
        const body=await response.json()

        assertions.assertStatus(response, 200)
        assertions.assertOwner(body, testData.validUser)
    })

    test('T011 - Validar estrutura da resposta', async ({ request }) => {
        const service = serviceFactory.getReposService(request)
        const assertions = new Assertions()

        const response=await service.listRepos(testData.validUser)

        assertions.assertStatus(response, 200)
    })

    test('T012 - Usuário inexistente', async ({ request }) => {
        const service = serviceFactory.getReposService(request)
        const assertions = new Assertions()

        const response=await service.listRepos(testData.invalidUser)
        const body=await response.json()

        assertions.assertStatus(response, 404)
        assertions.assertNotFound(body)
    })

    const hasToken = !!process.env.GITHUB_TOKEN;

    test('T015 - Listar meus repositórios (autenticado)', async ({ request }) => {
        test.skip(!hasToken, 'Este teste requer autenticação - configure GITHUB_TOKEN');
        const service = serviceFactory.getReposService();
        
        const response = await service.getAuthenticatedRepos();
        const body = await response.json();
        
        assertions.assertStatus(response, 200);
        expect(body).toBeInstanceOf(Array);
    });

    test.afterEach(() => {
        serviceFactory.cleanup();
    });

});