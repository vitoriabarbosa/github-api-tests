const { test, expect } = require('@playwright/test');
const ServiceFactory = require('../core/serviceFactory');
const Assertions = require('../core/assertions');
const testData = require('../fixtures/testData');

test.describe('Filters API Tests', () => {
    let serviceFactory;
    let assertions;

    test.beforeEach(async ({ request }) => {
        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        });

        assertions = new Assertions();
    });

    test(
        'T003 - Teste de Validação de Parametrização de Linguagem',
        {
            tag: [
                '@funcional',
                '@media',
                '@filtros',
                '@repositorios',
                '@busca',
                '@linguagem',
                '@consulta'
            ]
        },
        async () => {
            const service = serviceFactory.getReposService();

            const response = await service.searchByLanguage(
                testData.searchLanguage
            );

            assertions.assertStatus(response, 200);

            const body = await response.json();

            expect(body).toHaveProperty('items');
            expect(Array.isArray(body.items)).toBeTruthy();
            expect(body.items.length).toBeGreaterThan(0);

            body.items.forEach(repo => {
                expect(repo).toHaveProperty('name');
                expect(repo).toHaveProperty('owner');
                expect(repo).toHaveProperty('html_url');

                expect(typeof repo.name).toBe('string');
                expect(typeof repo.html_url).toBe('string');
            });

            expect(body.total_count).toBeGreaterThan(0);
        }
    );

    test(
        'T004 - Teste de Limitação de Resultados por Página',
        {
            tag: [
                '@funcional',
                '@media',
                '@filtros',
                '@issues',
                '@paginacao',
                '@limite',
                '@consulta'
            ]
        },
        async () => {
            const service = serviceFactory.getIssuesService();

            const response = await service.listIssues(
                testData.owner,
                testData.repo,
                null,
                testData.pagination
            );

            assertions.assertStatus(response, 200);

            const body = await response.json();

            expect(Array.isArray(body)).toBeTruthy();

            expect(body.length)
                .toBeLessThanOrEqual(
                    testData.pagination.perPage
                );

            body.forEach(issue => {
                expect(issue).toHaveProperty('id');
                expect(issue).toHaveProperty('title');
                expect(issue).toHaveProperty('state');

                expect(typeof issue.title)
                    .toBe('string');
            });
        }
    );

    test(
        'T009 - Deve retornar páginas diferentes',
        {
            tag: [
                '@funcional',
                '@media',
                '@filtros',
                '@issues',
                '@paginacao',
                '@integridade',
                '@comparacao'
            ]
        },
        async () => {
            const service = serviceFactory.getIssuesService();

            const pageOne = await service.listIssues(
                testData.owner,
                testData.repo,
                null,
                {
                    page: 1,
                    perPage: 5
                }
            );

            const pageTwo = await service.listIssues(
                testData.owner,
                testData.repo,
                null,
                {
                    page: 2,
                    perPage: 5
                }
            );

            assertions.assertStatus(pageOne, 200);
            assertions.assertStatus(pageTwo, 200);

            const issuesOne = await pageOne.json();
            const issuesTwo = await pageTwo.json();

            expect(issuesOne.length)
                .toBeGreaterThan(0);

            expect(issuesTwo.length)
                .toBeGreaterThan(0);

            expect(issuesOne[0].id)
                .not.toBe(issuesTwo[0].id);
        }
    );

    test(
        'T010 - Deve retornar apenas issues abertas',
        {
            tag: [
                '@funcional',
                '@alta',
                '@filtros',
                '@issues',
                '@status',
                '@open',
                '@validacao'
            ]
        },
        async () => {
            const service = serviceFactory.getIssuesService();

            const response = await service.listIssues(
                testData.owner,
                testData.repo,
                'open'
            );

            assertions.assertStatus(response, 200);

            const body = await response.json();

            body.forEach(issue => {
                expect(issue.state)
                    .toBe('open');
            });
        }
    );

    test.afterEach(() => {
        serviceFactory.cleanup();
    });
});