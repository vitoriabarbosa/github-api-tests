const {test}=require('@playwright/test')
const CommitsService=require('../services/commitsService')
const Assertions=require('../core/assertions')
const testData=require('../fixtures/testData')

test('T013 - Listar commits de um repositório', async ({ request }) => {
    const service = new CommitsService(request)
    const assertions = new Assertions()

    const response=await service.listCommits(testData.owner, testData.repo)

    assertions.assertStatus(response, 200)
})

test('T014 - Validar tratamento de erros para repositório inexistente', async ({ request }) => {
    const service = new CommitsService(request)
    const assertions = new Assertions()

    const response=await service.listCommits(testData.invalidOwner, testData.repo)
    const body=await response.json()

    assertions.assertStatus(response, 404)
    assertions.assertNotFound(body)
})
