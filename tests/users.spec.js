const {test}=require('@playwright/test')
const UsersService=require('../services/usersService')
const Assertions=require('../core/assertions')
const testData=require('../fixtures/testData')

test('T007 - Validar busca de usuário válido', async ({ request }) => {
    const service = new UsersService(request)
    const assertions = new Assertions()

    const response=await service.getUser(testData.validUser)
    const body=await response.json()

    assertions.assertStatus(response, 200)
    assertions.assertContentType(response)
})

test('T008 - Validar comportamento para usuário inexistente', async ({ request }) => {
    const service = new UsersService(request)
    const assertions = new Assertions()

    const response=await service.getUser(testData.invalidUser)
    const body=await response.json()

    assertions.assertStatus(response, 404)
    assertions.assertNotFound(body)
})

test('T009 - Validar estrutura da resposta do usuário', async ({ request }) => {
    const service = new UsersService(request)
    const assertions = new Assertions()

    const response=await service.getUser(testData.validUser)
    const body=await response.json()

    assertions.assertStatus(response, 200)
    assertions.assertContentType(response)
})
