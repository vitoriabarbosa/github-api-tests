const { test, expect } = require('@playwright/test');
const ServiceFactory = require('../core/serviceFactory');
const Assertions = require('../core/assertions');
const testData = require('../fixtures/testData');

// testes para validar execucao paralela - atividade 4 do lab 6
// cada teste instancia seus proprios servicos no beforeEach

test.describe.parallel('Parallel Execution', () => {
    let serviceFactory;
    let assertions;

    test.beforeEach(async ({ request }) => {
        serviceFactory = new ServiceFactory(request, {
            baseURL: 'https://api.github.com'
        });

        assertions = new Assertions();
    });

    test(
        'P001 - Buscar usuario enquanto lista repos',
        {
            tag: [
                '@parallel',
                '@smoke',
                '@alta',
                '@users',
                '@repos',
                '@concorrencia'
            ]
        },
        async () => {
            const usersService = serviceFactory.getUsersService();

            const response =
                await usersService.getUser(testData.validUser);

            const body = await response.json();

            assertions.assertStatus(response, 200);
            assertions.assertContentType(response);

            expect(body.login).toBeTruthy();
        }
    );

    test(
        'P002 - Listar repos enquanto busca usuario',
        {
            tag: [
                '@parallel',
                '@funcional',
                '@media',
                '@repos',
                '@users',
                '@concorrencia'
            ]
        },
        async () => {
            const reposService = serviceFactory.getReposService();

            const response =
                await reposService.listRepos(testData.validUser);

            const body = await response.json();

            assertions.assertStatus(response, 200);

            expect(Array.isArray(body)).toBeTruthy();
        }
    );

    test(
        'P003 - Buscar commits em paralelo com issues',
        {
            tag: [
                '@parallel',
                '@commits',
                '@issues',
                '@concorrencia',
                '@media'
            ]
        },
        async () => {
            const commitsService =
                serviceFactory.getCommitsService();

            const response =
                await commitsService.listCommits(
                    testData.owner,
                    testData.repo
                );

            assertions.assertStatus(response, 200);
        }
    );

    test(
        'P004 - Buscar issues em paralelo com commits',
        {
            tag: [
                '@parallel',
                '@issues',
                '@commits',
                '@concorrencia',
                '@media'
            ]
        },
        async () => {
            const issuesService =
                serviceFactory.getIssuesService();

            const response =
                await issuesService.listIssues(
                    testData.owner,
                    testData.repo
                );

            assertions.assertStatus(response, 200);
        }
    );

    test(
        'P005 - Buscar pulls em paralelo com repos',
        {
            tag: [
                '@parallel',
                '@pulls',
                '@repos',
                '@concorrencia',
                '@media'
            ]
        },
        async () => {
            const pullsService =
                serviceFactory.getPullsService();

            const response =
                await pullsService.listPulls(
                    testData.owner,
                    testData.repo
                );

            assertions.assertStatus(response, 200);
        }
    );

    test(
        'P006 - Buscar usuario invalido em paralelo',
        {
            tag: [
                '@parallel',
                '@users',
                '@erro',
                '@negativo',
                '@404',
                '@concorrencia'
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
        'P007 - Mesmo endpoint, parametros distintos',
        {
            tag: [
                '@parallel',
                '@issues',
                '@filtro',
                '@concorrencia',
                '@race-condition',
                '@status'
            ]
        },
        async () => {
            const issuesService =
                serviceFactory.getIssuesService();

            const [resOpen, resClosed] =
                await Promise.all([
                    issuesService.listIssues(
                        testData.owner,
                        testData.repo,
                        'open'
                    ),
                    issuesService.listIssues(
                        testData.owner,
                        testData.repo,
                        'closed'
                    )
                ]);

            assertions.assertStatus(resOpen, 200);
            assertions.assertStatus(resClosed, 200);

            const openBody = await resOpen.json();
            const closedBody = await resClosed.json();

            openBody.forEach((issue) =>
                expect(issue.state).toBe('open')
            );

            closedBody.forEach((issue) =>
                expect(issue.state).toBe('closed')
            );
        }
    );

    test.afterEach(() => {
        serviceFactory.cleanup();
    });
});