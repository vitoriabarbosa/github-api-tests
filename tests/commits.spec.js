const { test, expect } = require('@playwright/test');
const ServiceFactory = require('../core/serviceFactory');
const Assertions = require('../core/assertions');
const testData = require('../fixtures/testData');

test.describe('Commits API Tests', () => {
    let serviceFactory;
    let assertions;

    test.beforeEach(async ({ request }) => {
        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        });

        assertions = new Assertions();
    });

    test(
        'T013 - Listar commits de um repositório',
        {
            tag: [
                '@smoke',
                '@alta',
                '@commits',
                '@listagem',
                '@estrutura',
                '@headers'
            ]
        },
        async () => {
            const service = serviceFactory.getCommitsService();

            const response = await service.listCommits(
                testData.owner,
                testData.repo
            );

            const body = await response.json();

            assertions.assertStatus(response, 200);

            expect(Array.isArray(body)).toBeTruthy();
            expect(body.length).toBeGreaterThan(0);

            const firstCommit = body[0];

            expect(firstCommit).toHaveProperty('sha');
            expect(firstCommit).toHaveProperty('commit');

            expect(typeof firstCommit.sha)
                .toBe('string');

            expect(firstCommit.commit)
                .toHaveProperty('message');

            expect(firstCommit.commit)
                .toHaveProperty('author');

            expect(typeof firstCommit.commit.message)
                .toBe('string');

            expect(firstCommit.commit.author)
                .toHaveProperty('name');

            expect(firstCommit.commit.author)
                .toHaveProperty('date');

            const headers = response.headers();

            expect(headers['content-type'])
                .toContain('application/json');
        }
    );

    test(
        'T014 - Validar tratamento de erros para repositório inexistente',
        {
            tag: [
                '@funcional',
                '@alta',
                '@commits',
                '@erro',
                '@negativo',
                '@404'
            ]
        },
        async () => {
            const service = serviceFactory.getCommitsService();

            const response = await service.listCommits(
                testData.invalidOwner,
                testData.repo
            );

            const body = await response.json();

            assertions.assertStatus(response, 404);
            assertions.assertNotFound(body);

            expect(body.message)
                .toBe('Not Found');
        }
    );

    test(
        'T015 - Deve retornar 404 para repositório inexistente',
        {
            tag: [
                '@funcional',
                '@media',
                '@commits',
                '@erro',
                '@404',
                '@validacao'
            ]
        },
        async () => {
            const service = serviceFactory.getCommitsService();

            const response = await service.listCommits(
                testData.invalidOwner,
                testData.repo
            );

            const body = await response.json();

            assertions.assertStatus(response, 404);
            assertions.assertNotFound(body);

            expect(body.message)
                .toBe('Not Found');
        }
    );

    test(
        'T016 - Deve validar estrutura do primeiro commit',
        {
            tag: [
                '@funcional',
                '@media',
                '@commits',
                '@estrutura',
                '@schema',
                '@dados'
            ]
        },
        async () => {
            const service = serviceFactory.getCommitsService();

            const response = await service.listCommits(
                testData.owner,
                testData.repo
            );

            const commits = await response.json();

            assertions.assertStatus(response, 200);

            const commit = commits[0];

            expect(commit.sha)
                .toMatch(/^[a-f0-9]{40}$/);

            expect(commit.commit.author.name)
                .not.toBeNull();

            expect(commit.commit.message.length)
                .toBeGreaterThan(0);
        }
    );

    test(
        'T017 - Deve validar que todos os commits possuem SHA válido',
        {
            tag: [
                '@funcional',
                '@media',
                '@commits',
                '@integridade',
                '@sha',
                '@validacao'
            ]
        },
        async () => {
            const service = serviceFactory.getCommitsService();

            const response = await service.listCommits(
                testData.owner,
                testData.repo
            );

            const commits = await response.json();

            assertions.assertStatus(response, 200);

            commits.forEach(commit => {
                expect(commit.sha)
                    .toMatch(/^[a-f0-9]{40}$/);
            });
        }
    );

    test.afterEach(() => {
        serviceFactory.cleanup();
    });
});