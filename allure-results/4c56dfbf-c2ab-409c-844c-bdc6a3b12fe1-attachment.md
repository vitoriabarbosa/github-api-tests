# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/users.spec.js >> Users API Tests >> T009 - Validar estrutura da resposta do usuário
- Location: tests/users.spec.js:69:5

# Error details

```
TypeError: Cannot read properties of undefined (reading 'json')
```

# Test source

```ts
  1  | const { test } = require('@playwright/test')
  2  | const ServiceFactory = require('../core/serviceFactory')
  3  | const Assertions = require('../core/assertions')
  4  | const testData = require('../fixtures/testData')
  5  | const testContext = require('../core/testContext')
  6  | const dynamicCases = require('../fixtures/dynamic_test_cases.json')
  7  | 
  8  | test.describe('Users API Tests', () => {
  9  |     let serviceFactory
  10 |     let assertions
  11 | 
  12 |     test.beforeAll(() => {
  13 |         if (process.env.GITHUB_TOKEN) {
  14 |             testContext.setGlobal('token', process.env.GITHUB_TOKEN)
  15 |         }
  16 |         testContext.setSuite('validUser', testData.validUser)
  17 |     })
  18 | 
  19 |     test.beforeEach(async ({ request }) => {
  20 |         testContext.clearTest()
  21 |         serviceFactory = new ServiceFactory(request, {
  22 |             baseURL: 'https://api.github.com'
  23 |         })
  24 |         assertions = new Assertions()
  25 | 
  26 |         const token = testContext.getGlobal('token')
  27 |         if (token) {
  28 |             serviceFactory.setAuthToken(token)
  29 |         }
  30 |     })
  31 | 
  32 |     dynamicCases.users_scenarios.forEach((scenario) => {
  33 |         test(`${scenario.id} - ${scenario.description}`, async () => {
  34 |             const usersService = serviceFactory.getUsersService()
  35 |             const response = await usersService.getUser(scenario.username)
  36 | 
  37 |             assertions.assertStatus(response, scenario.expected_status)
  38 | 
  39 |             if (scenario.expected_status === 200) {
  40 |                 assertions.assertContentType(response)
  41 |             } else if (scenario.expected_status === 404) {
  42 |                 const body = await response.json()
  43 |                 assertions.assertNotFound(body)
  44 |             }
  45 |         })
  46 |     })
  47 | 
  48 |     test('T007 - Validar busca de usuário válido', async () => {
  49 |         const usersService = serviceFactory.getUsersService()
  50 | 
  51 |         const user = testContext.getSuite('validUser')
  52 |         const response = await usersService.getUser(user)
  53 |         const body = await response.json()
  54 | 
  55 |         assertions.assertStatus(response, 200)
  56 |         assertions.assertContentType(response)
  57 |     })
  58 | 
  59 |     test('T008 - Validar comportamento para usuário inexistente', async () => {
  60 |         const usersService = serviceFactory.getUsersService()
  61 | 
  62 |         const response = await usersService.getUser(testData.invalidUser)
  63 |         const body = await response.json()
  64 | 
  65 |         assertions.assertStatus(response, 404)
  66 |         assertions.assertNotFound(body)
  67 |     })
  68 | 
  69 |     test('T009 - Validar estrutura da resposta do usuário', async ({ request }) => {
  70 |         const service = serviceFactory.getUsersService(request)
  71 |         const assertions = new Assertions()
  72 | 
  73 |         const user = testContext.getSuite('validUser')
  74 |         const response = await service.getUser(user)
> 75 |         const body = await response.json()
     |                                     ^ TypeError: Cannot read properties of undefined (reading 'json')
  76 | 
  77 |         assertions.assertStatus(response, 200)
  78 |         assertions.assertContentType(response)
  79 |     })
  80 | 
  81 |     test.afterEach(() => {
  82 |         serviceFactory.cleanup()
  83 |     })
  84 | 
  85 |     test.afterAll(() => {
  86 |         testContext.clearSuite()
  87 |     })
  88 | })
  89 | 
```