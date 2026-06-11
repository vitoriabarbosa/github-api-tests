const { test, expect } = require('@playwright/test');
const ServiceFactory = require('../core/serviceFactory');
const Assertions = require('../core/assertions');
const testData = require('../fixtures/testData');
const testContext = require('../core/testContext');
const dynamicCases = require('../fixtures/dynamic_test_cases.json');

test.describe('Users API Tests', () => {
    let serviceFactory;
    let assertions;

    test.beforeAll(() => {
        if (process.env.GITHUB_TOKEN) {
            testContext.setGlobal(
                'token',
                process.env.GITHUB_TOKEN
            );
        }

        testContext.setSuite(
            'validUser',
            testData.validUser
        );
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

    dynamicCases.users_scenarios.forEach((scenario) => {
        test(
            `${scenario.id} - ${scenario.description}`,
            {
                tag: [
                    ...scenario.tags,
                    '@usuarios',
                    '@api',
                    '@github',
                    '@validacao',
                    '@usuario'
                ]
            },
            async () => {
                const usersService =
                    serviceFactory.getUsersService();

                const response =
                    await usersService.getUser(
                        scenario.username
                    );

                assertions.assertStatus(
                    response,
                    scenario.expected_status
                );

                if (scenario.expected_status === 200) {
                    assertions.assertContentType(response);
                }

                if (scenario.expected_status === 404) {
                    const body = await response.json();
                    assertions.assertNotFound(body);
                }
            }
        );
    });

    test(
        'T007 - Validar busca de usuário válido',
        {
            tag: [
                '@smoke',
                '@alta',
                '@usuarios',
                '@consulta',
                '@positivo',
                '@api'
            ]
        },
        async () => {
            const usersService =
                serviceFactory.getUsersService();

            const user =
                testContext.getSuite('validUser');

            const response =
                await usersService.getUser(user);

            const body = await response.json();

            assertions.assertStatus(response, 200);
            assertions.assertContentType(response);

            expect(body.login.toLowerCase())
                .toBe(user.toLowerCase());

            expect(body)
                .toHaveProperty('id');

            expect(body)
                .toHaveProperty('login');
        }
    );

    test(
        'T008 - Validar comportamento para usuário inexistente',
        {
            tag: [
                '@funcional',
                '@alta',
                '@usuarios',
                '@negativo',
                '@404',
                '@erro'
            ]
        },
        async () => {
            const usersService =
                serviceFactory.getUsersService();

            const response =
                await usersService.getUser(
                    testData.invalidUser
                );

            const body = await response.json();

            assertions.assertStatus(response, 404);
            assertions.assertNotFound(body);
        }
    );

    test(
        'T009 - Validar estrutura da resposta do usuário',
        {
            tag: [
                '@funcional',
                '@media',
                '@usuarios',
                '@schema',
                '@contrato'
            ]
        },
        async () => {
            const service =
                serviceFactory.getUsersService();

            const user =
                testContext.getSuite('validUser');

            const response =
                await service.getUser(user);

            const body = await response.json();

            assertions.assertStatus(response, 200);
            assertions.assertContentType(response);

            expect(body)
                .toHaveProperty('id');

            expect(body)
                .toHaveProperty('login');

            expect(body)
                .toHaveProperty('type');

            expect(body)
                .toHaveProperty('html_url');

            expect(body)
                .toHaveProperty('avatar_url');

            expect(typeof body.id)
                .toBe('number');

            expect(typeof body.login)
                .toBe('string');

            expect(typeof body.type)
                .toBe('string');

            expect(typeof body.html_url)
                .toBe('string');

            expect(typeof body.avatar_url)
                .toBe('string');
        }
    );

    test.afterEach(() => {
        serviceFactory.cleanup();
    });

    test.afterAll(() => {
        testContext.clearSuite();
    });
});