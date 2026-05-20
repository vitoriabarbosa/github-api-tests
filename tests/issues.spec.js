const {test, expect}=require('@playwright/test')
const IssuesService=require('../services/issuesService')
const Assertions=require('../core/assertions')
const testData=require('../fixtures/testData')

test('T005 - Validar listagem geral de issues', async ({ request }) => {
    const service = new IssuesService(request)
    const assertions = new Assertions()

    const response=await service.listIssues(testData.owner, testData.repo)
    const body=await response.json()

    assertions.assertStatus(response, 200)
    assertions.assertContentType(response)
})

test('T006 - Validar filtro de status das issues', async ({ request }) => {
    const service = new IssuesService(request)
    const assertions = new Assertions()

    const response=await service.listIssues(testData.owner, testData.repo, 'open')
    const body=await response.json()

    assertions.assertStatus(response, 200)
    body.forEach(issue => expect(issue.state).toBe('open'))
})
