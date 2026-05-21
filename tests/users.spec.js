// tests/refactored/users.spec.js (versão refatorada)
const { test } = require('@playwright/test');
const ServiceFactory = require('../core/serviceFactory');
const Assertions = require('../core/assertions');
const testData = require('../fixtures/testData');

test.describe('Users API Tests', () => {
    let serviceFactory;
    let assertions;
    
    test.beforeEach(async ({ request }) => {
        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        });
        assertions = new Assertions();
        
        // Se tiver token, configura uma vez para todos os testes
        if (process.env.GITHUB_TOKEN) {
            serviceFactory.setAuthToken(process.env.GITHUB_TOKEN);
        }
    });
    
    test('T007 - Validar busca de usuário válido', async () => {
        const usersService = serviceFactory.getUsersService();
        
        const response = await usersService.getUser(testData.validUser);
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

        const response=await service.getUser(testData.validUser)
        const body=await response.json()

        assertions.assertStatus(response, 200)
        assertions.assertContentType(response)
    });
    
    test.afterEach(() => {
        serviceFactory.cleanup();
    });
});