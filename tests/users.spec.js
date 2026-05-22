const { test } = require('@playwright/test');
const ServiceFactory = require('../core/serviceFactory');
const Assertions = require('../core/assertions');
const testData = require('../fixtures/testData');
const testContext = require('../core/testContext');

test.describe('Users API Tests', () => {
    let serviceFactory;
    let assertions;
    
    test.beforeAll(() => {
        if (process.env.GITHUB_TOKEN) {
            testContext.setGlobal('token', process.env.GITHUB_TOKEN);
        }
        testContext.setSuite('validUser', testData.validUser);
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
    
    test('T007 - Validar busca de usuário válido', async () => {
        const usersService = serviceFactory.getUsersService();
        
        const user = testContext.getSuite('validUser');
        const response = await usersService.getUser(user);
        const body = await response.json();
        
        assertions.assertStatus(response, 200);
        assertions.assertContentType(response);
    });
    
    test('T008 - Validar comportamento para usuário inexistente', async () => {
        const usersService = serviceFactory.getUsersService();
        
        const response = await usersService.getUser(testData.invalidUser);
        const body = await response.json();
        
        assertions.assertStatus(response, 404);
        assertions.assertNotFound(body);
    });

    test('T009 - Validar estrutura da resposta do usuário', async ({ request }) => {
        const service = serviceFactory.getUsersService(request)
        const assertions = new Assertions()

        const user = testContext.getSuite('validUser');
        const response=await service.getUser(user)
        const body=await response.json()

        assertions.assertStatus(response, 200)
        assertions.assertContentType(response)
    });
    
    test.afterEach(() => {
        serviceFactory.cleanup();
    });

    test.afterAll(() => {
        testContext.clearSuite();
    });
});