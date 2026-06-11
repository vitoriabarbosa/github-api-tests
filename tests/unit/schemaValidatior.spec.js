const { test, expect } = require('@playwright/test');
const ServiceFactory = require('../../core/serviceFactory');
const SchemaValidator = require('../../core/schemaValidator');
const testData = require('../../fixtures/testData');

test.describe('Schema Validation Tests', () => {
    let serviceFactory;
    let validator;

    test.beforeEach(async ({ request }) => {
        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        });

        validator = new SchemaValidator({
            throwOnError: false
        });
    });

    test(
        'SCHEMA-001 - Validar esquema de usuário com dados reais',
        { tag: ['@schema', '@alta', '@validacao'] },
        async () => {
            const usersService =
                serviceFactory.getUsersService();

            const response =
                await usersService.getUser(
                    testData.validUser
                );

            const body = await response.json();

            expect(response.status())
                .toBe(200);

            expect(body)
                .toHaveProperty('id');

            expect(body)
                .toHaveProperty('login');

            expect(body)
                .toHaveProperty('avatar_url');

            expect(body)
                .toHaveProperty('type');
        }
    );

    test(
        'SCHEMA-002 - Validar esquema de repositório',
        { tag: ['@schema', '@alta', '@validacao'] },
        async () => {
            const reposService =
                serviceFactory.getReposService();

            const response =
                await reposService.getRepo(
                    testData.owner,
                    testData.repo
                );

            const body = await response.json();

            expect(response.status())
                .toBe(200);

            expect(body)
                .toHaveProperty('id');

            expect(body)
                .toHaveProperty('name');

            expect(body)
                .toHaveProperty('full_name');

            expect(body)
                .toHaveProperty('private');

            expect(body.owner)
                .toHaveProperty('login');
        }
    );

    test(
        'SCHEMA-003 - Validar que o UsersService funciona com validação',
        { tag: ['@schema', '@media', '@validacao'] },
        async () => {
            const usersService =
                serviceFactory.getUsersService();

            const response =
                await usersService.getUser(
                    testData.validUser
                );

            expect(response.status())
                .toBe(200);
        }
    );

    test.afterEach(() => {
        serviceFactory.cleanup();
    });
});