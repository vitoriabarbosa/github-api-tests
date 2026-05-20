const {test}=require('@playwright/test')
const ReposService=require('../services/reposService')
const IssuesService=require('../services/issuesService')
const Assertions=require('../core/assertions')
const testData=require('../fixtures/testData')

test('T003 - Teste de Validação de Parametrização de Linguagem', async ({ request }) => {
    const service = new ReposService(request)
    const assertions = new Assertions()

    const response=await service.searchByLanguage(testData.searchLanguage)

    assertions.assertStatus(response, 200)
})

test('T004 - Teste de Limitação de Resultados por Página', async ({ request }) => {
    const service = new IssuesService(request)
    const assertions = new Assertions()

    const response=await service.listIssues(testData.owner, testData.repo, null, testData.pagination)
    const body=await response.json()

    assertions.assertStatus(response, 200)
    assertions.assertPagination(body, testData.pagination.perPage)
})
