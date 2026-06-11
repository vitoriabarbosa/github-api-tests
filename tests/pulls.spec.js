const { test, expect } = require('@playwright/test');
const ServiceFactory = require('../core/serviceFactory');
const Assertions = require('../core/assertions');
const testData = require('../fixtures/testData');
const dynamicCases = require('../fixtures/dynamic_test_cases.json');

test.describe('Pulls API Tests', () => {
    let serviceFactory;
    let assertions;

    test.beforeEach(async ({ request }) => {
        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        });

        assertions = new Assertions();
    });

    dynamicCases.issues_pulls_filters.forEach((scenario) => {
        test(
            `${scenario.id} - ${scenario.description}`,
            {
                tag: [
                    ...scenario.tags,
                    '@pulls',
                    '@api',
                    '@github',
                    '@http',
                    '@regressao'
                ]
            },
            async () => {
                const service = serviceFactory.getPullsService();

                const response = await service.listPulls(
                    testData.owner,
                    testData.repo,
                    scenario.state
                );

                assertions.assertStatus(response, 200);

                if (
                    scenario.state === 'open' ||
                    scenario.state === 'closed'
                ) {
                    const body = await response.json();

                    body.forEach(pr => {
                        expect(pr.state).toBe(scenario.state);
                    });
                }
            }
        );
    });

    test(
        'T001 - Pull Requests open',
        {
            tag: [
                '@smoke',
                '@alta',
                '@pulls',
                '@consulta',
                '@api',
                '@positivo'
            ]
        },
        async () => {
            const service = serviceFactory.getPullsService();

            const response = await service.listPulls(
                testData.owner,
                testData.repo,
                'open'
            );

            const body = await response.json();

            assertions.assertStatus(response, 200);

            expect(Array.isArray(body)).toBeTruthy();

            if (body.length > 0) {
                const pr = body[0];

                expect(pr).toHaveProperty('id');
                expect(pr).toHaveProperty('number');
                expect(pr).toHaveProperty('title');
                expect(pr).toHaveProperty('state');
                expect(pr).toHaveProperty('user');

                expect(typeof pr.id).toBe('number');
                expect(typeof pr.number).toBe('number');
                expect(typeof pr.title).toBe('string');
                expect(typeof pr.state).toBe('string');

                expect(pr.state).toBe('open');
            }
        }
    );

    test(
        'T002 - Pull Requests closed',
        {
            tag: [
                '@funcional',
                '@alta',
                '@pulls',
                '@fechado',
                '@api',
                '@validacao'
            ]
        },
        async () => {
            const service = serviceFactory.getPullsService();

            const response = await service.listPulls(
                testData.owner,
                testData.repo,
                'closed'
            );

            const body = await response.json();

            assertions.assertStatus(response, 200);

            if (body.length > 0) {
                const pr = body[0];

                expect(pr.user).toHaveProperty('login');
                expect(pr.user).toHaveProperty('id');

                expect(typeof pr.user.login).toBe('string');
                expect(typeof pr.user.id).toBe('number');

                expect(pr.state).toBe('closed');
            }
        }
    );

    test(
        'T003 - Deve validar URLs do Pull Request',
        {
            tag: [
                '@url',
                '@estrutura',
                '@pulls',
                '@validacao',
                '@api'
            ]
        },
        async () => {
            const service = serviceFactory.getPullsService();

            const response = await service.listPulls(
                testData.owner,
                testData.repo
            );

            const body = await response.json();

            assertions.assertStatus(response, 200);

            if (body.length > 0) {
                const pr = body[0];

                expect(pr.html_url).toContain('github.com');
                expect(pr.url).toContain('api.github.com');
            }
        }
    );

    test(
        'T004 - Deve validar headers da resposta',
        {
            tag: [
                '@headers',
                '@http',
                '@pulls',
                '@api',
                '@infra'
            ]
        },
        async () => {
            const service = serviceFactory.getPullsService();

            const response = await service.listPulls(
                testData.owner,
                testData.repo
            );

            assertions.assertStatus(response, 200);

            const headers = response.headers();

            expect(headers['content-type'])
                .toContain('application/json');

            expect(headers)
                .toHaveProperty('x-ratelimit-limit');
        }
    );

    test(
        'T005 - Deve validar unicidade dos Pull Requests',
        {
            tag: [
                '@dados',
                '@integridade',
                '@pulls',
                '@qualidade',
                '@api'
            ]
        },
        async () => {
            const service = serviceFactory.getPullsService();

            const response = await service.listPulls(
                testData.owner,
                testData.repo
            );

            const body = await response.json();

            assertions.assertStatus(response, 200);

            const ids = body.map(pr => pr.id);
            const uniqueIds = [...new Set(ids)];

            expect(uniqueIds.length).toBe(ids.length);
        }
    );

    test(
        'T006 - Deve validar campos obrigatórios',
        {
            tag: [
                '@schema',
                '@contrato',
                '@pulls',
                '@api',
                '@estrutura'
            ]
        },
        async () => {
            const service = serviceFactory.getPullsService();

            const response = await service.listPulls(
                testData.owner,
                testData.repo
            );

            const body = await response.json();

            assertions.assertStatus(response, 200);

            body.forEach(pr => {
                expect(pr.id).toBeDefined();
                expect(pr.number).toBeDefined();
                expect(pr.title).toBeDefined();
                expect(pr.state).toBeDefined();
            });
        }
    );

    test.afterEach(() => {
        serviceFactory.cleanup();
    });
});