const {test}=require('@playwright/test')
const ReposService=require('../services/reposService')
const Assertions=require('../core/assertions')
const testData=require('../fixtures/testData')

test('T010 - Listar repositórios com sucesso', async ({ request }) => {
    const service = new ReposService(request)
    const assertions = new Assertions()

    const response=await service.listRepos(testData.validUser)
    const body=await response.json()

    assertions.assertStatus(response, 200)
    assertions.assertOwner(body, testData.validUser)
})

test('T011 - Validar estrutura da resposta', async ({ request }) => {
    const service = new ReposService(request)
    const assertions = new Assertions()

    const response=await service.listRepos(testData.validUser)

    assertions.assertStatus(response, 200)
})

test('T012 - Usuário inexistente', async ({ request }) => {
    const service = new ReposService(request)
    const assertions = new Assertions()

    const response=await service.listRepos(testData.invalidUser)
    const body=await response.json()

    assertions.assertStatus(response, 404)
    assertions.assertNotFound(body)
})
