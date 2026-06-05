# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/unit/schemaValidation.spec.js >> Schema Validation Tests >> SCHEMA-001 - Validar esquema de usuário com dados reais
- Location: tests/unit/schemaValidation.spec.js:17:5

# Error details

```
Error: expect(received).not.toThrow()

Error name:    "Error"
Error message: "Cannot find module '../schemas/users.schema'
Require stack:
- /home/mariaheb/Documentos/github-api-tests/tests/unit/schemaValidation.spec.js
- /home/mariaheb/Documentos/github-api-tests/node_modules/playwright/lib/common/index.js
- /home/mariaheb/Documentos/github-api-tests/node_modules/playwright/lib/worker/workerProcessEntry.js"

      20 |         const body = await response.json()
      21 |
    > 22 |         expect(() => validator.validate(body, require('../schemas/users.schema')))
         |                                               ^
      23 |             .not.toThrow()
      24 |     })
      25 |

      at Module.resolveFilename [as _resolveFilename] (node_modules/playwright/lib/common/index.js:1076:36)
      at tests/unit/schemaValidation.spec.js:22:47
      at Object.<anonymous> (node_modules/playwright/lib/matchers/expect.js:11428:9)
      at invokeMatcher (node_modules/playwright/lib/matchers/expect.js:12921:20)
      at invoke (node_modules/playwright/lib/matchers/expect.js:12900:109)
      at _Zone.run (node_modules/playwright-core/lib/coreBundle.js:8422:40)
      at callMatcherAsStep (node_modules/playwright/lib/matchers/expect.js:12901:64)
      at Object.toThrow (node_modules/playwright/lib/matchers/expect.js:12863:23)
      at tests/unit/schemaValidation.spec.js:23:18
      at node_modules/playwright/lib/worker/workerProcessEntry.js:3045:9
      at node_modules/playwright/lib/worker/workerProcessEntry.js:2537:11
      at TimeoutManager.withRunnable (node_modules/playwright/lib/worker/workerProcessEntry.js:1816:14)
      at TestInfoImpl._runWithTimeout (node_modules/playwright/lib/worker/workerProcessEntry.js:2535:7)
      at node_modules/playwright/lib/worker/workerProcessEntry.js:3043:7
      at WorkerMain._runTest (node_modules/playwright/lib/worker/workerProcessEntry.js:3016:5)
      at WorkerMain.runTestGroup (node_modules/playwright/lib/worker/workerProcessEntry.js:2911:9)
      at process.<anonymous> (node_modules/playwright/lib/common/index.js:1955:25)
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test')
  2  | const ServiceFactory = require('../../core/serviceFactory')
  3  | const SchemaValidator = require('../../core/schemaValidator')
  4  | const testData = require('../../fixtures/testData')
  5  | 
  6  | test.describe('Schema Validation Tests', () => {
  7  |     let serviceFactory
  8  |     let validator
  9  | 
  10 |     test.beforeEach(async ({ request }) => {
  11 |         serviceFactory = new ServiceFactory(request, {
  12 |             baseURL: 'https://api.github.com'
  13 |         })
  14 |         validator = new SchemaValidator()
  15 |     })
  16 | 
  17 |     test('SCHEMA-001 - Validar esquema de usuário com dados reais', async () => {
  18 |         const usersService = serviceFactory.getUsersService()
  19 |         const response = await usersService.getUser(testData.validUser)
  20 |         const body = await response.json()
  21 | 
  22 |         expect(() => validator.validate(body, require('../schemas/users.schema')))
> 23 |             .not.toThrow()
     |                  ^ Error: expect(received).not.toThrow()
  24 |     })
  25 | 
  26 |     test('SCHEMA-002 - Validar esquema de repositório', async () => {
  27 |         const reposService = serviceFactory.getReposService()
  28 |         const response = await reposService.getRepo(testData.owner, testData.repo)
  29 |         const body = await response.json()
  30 | 
  31 |         expect(() => validator.validate(body, require('../schemas/repos.schema')))
  32 |             .not.toThrow()
  33 |     })
  34 | 
  35 |     test('SCHEMA-003 - Validar múltiplos itens em array', async () => {
  36 |         const usersService = serviceFactory.getUsersService()
  37 |         const reposService = serviceFactory.getReposService()
  38 |         
  39 |         // Busca lista de repositórios
  40 |         const reposResponse = await reposService.listRepos(testData.validUser)
  41 |         const repos = await reposResponse.json()
  42 |         
  43 |         // Valida cada repositório individualmente
  44 |         const schema = require('../schemas/repos.schema')
  45 |         const results = validator.validateArrayItem(repos, schema, 'repo')
  46 |         
  47 |         expect(results.valid).toBe(results.total)
  48 |         expect(results.invalid).toBe(0)
  49 |     })
  50 | 
  51 |     test('SCHEMA-004 - Comparação entre esquema atual e OpenAPI', async () => {
  52 |         // Verifica se o schema está atualizado
  53 |         const usersService = serviceFactory.getUsersService()
  54 |         const response = await usersService.getUser(testData.validUser)
  55 |         const actualData = await response.json()
  56 |         
  57 |         const currentSchema = require('../schemas/users.schema')
  58 |         
  59 |         // Verifica se todas as propriedades requeridas existem no objeto real
  60 |         if (currentSchema.required) {
  61 |             for (const requiredField of currentSchema.required) {
  62 |                 expect(actualData).toHaveProperty(requiredField)
  63 |             }
  64 |         }
  65 |     })
  66 | })
```