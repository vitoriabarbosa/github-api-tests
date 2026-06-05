# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/unit/schemaValidation.spec.js >> Schema Validation Tests >> SCHEMA-002 - Validar esquema de repositório
- Location: tests/unit/schemaValidation.spec.js:38:5

# Error details

```
Error: Cannot find module '../schemas/repos.schema'
Require stack:
- /home/mariaheb/Documentos/github-api-tests/tests/unit/schemaValidation.spec.js
- /home/mariaheb/Documentos/github-api-tests/node_modules/playwright/lib/common/index.js
- /home/mariaheb/Documentos/github-api-tests/node_modules/playwright/lib/worker/workerProcessEntry.js
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test')
  2   | const ServiceFactory = require('../../core/serviceFactory')
  3   | const SchemaValidator = require('../../core/schemaValidator')
  4   | const testData = require('../../fixtures/testData')
  5   | 
  6   | test.describe('Schema Validation Tests', () => {
  7   |     let serviceFactory
  8   |     let validator
  9   | 
  10  |     test.beforeEach(async ({ request }) => {
  11  |         serviceFactory = new ServiceFactory(request, {
  12  |             baseURL: 'https://api.github.com'
  13  |         })
  14  |         validator = new SchemaValidator()
  15  |     })
  16  | 
  17  |     test('SCHEMA-001 - Validar esquema de usuário com dados reais', async () => {
  18  |         const usersService = serviceFactory.getUsersService()
  19  |         const response = await usersService.getUser(testData.validUser)
  20  |         const body = await response.json()
  21  |         
  22  |         const schema = require('../schemas/users.schema')
  23  |         
  24  |         const result = validator.validateSilent(body, schema, 'user')
  25  |         
  26  |         if (!result.valid) {
  27  |             console.log('⚠️ Schema validation warnings:', result.errors)
  28  |         }
  29  |         
  30  |         expect(body).toHaveProperty('id')
  31  |         expect(body).toHaveProperty('login')
  32  |         expect(body).toHaveProperty('avatar_url')
  33  |         expect(body).toHaveProperty('type')
  34  |         
  35  |         expect(result.valid || true).toBeTruthy()
  36  |     })
  37  | 
  38  |     test('SCHEMA-002 - Validar esquema de repositório', async () => {
  39  |         const reposService = serviceFactory.getReposService()
  40  |         const response = await reposService.getRepo(testData.owner, testData.repo)
  41  |         const body = await response.json()
  42  | 
> 43  |         const schema = require('../schemas/repos.schema')
      |                        ^ Error: Cannot find module '../schemas/repos.schema'
  44  |         const result = validator.validateSilent(body, schema, 'repo')
  45  |         
  46  |         expect(body).toHaveProperty('id')
  47  |         expect(body).toHaveProperty('name')
  48  |         expect(body).toHaveProperty('full_name')
  49  |         expect(body).toHaveProperty('private')
  50  |         expect(body).toHaveProperty('owner')
  51  |         expect(body.owner).toHaveProperty('login')
  52  |         
  53  |         if (!result.valid) {
  54  |             console.log('Schema validation warnings for repo:', result.errors)
  55  |         }
  56  |         
  57  |         expect(result.valid || true).toBeTruthy()
  58  |     })
  59  | 
  60  |     test('SCHEMA-003 - Validar múltiplos itens em array', async () => {
  61  |         const reposService = serviceFactory.getReposService()
  62  |         
  63  |         const reposResponse = await reposService.listRepos(testData.validUser)
  64  |         const repos = await reposResponse.json()
  65  |         
  66  |         expect(Array.isArray(repos)).toBeTruthy()
  67  |         
  68  |         for (let i = 0; i < Math.min(repos.length, 10); i++) {
  69  |             const repo = repos[i]
  70  |             expect(repo).toHaveProperty('id')
  71  |             expect(repo).toHaveProperty('name')
  72  |             expect(repo).toHaveProperty('full_name')
  73  |             expect(repo.owner).toHaveProperty('login')
  74  |         }
  75  |         
  76  |         const schema = require('../schemas/repos.schema')
  77  |         
  78  |         try {
  79  |             const results = validator.validateArrayItem(repos.slice(0, 5), schema, 'repo')
  80  |             console.log(` Validated ${results.valid}/${results.total} repos successfully`)
  81  |             expect(results.valid).toBeGreaterThan(0)
  82  |         } catch (error) {
  83  |             console.log(' Array validation had issues:', error.message)
  84  |          
  85  |             expect(true).toBeTruthy()
  86  |         }
  87  |     })
  88  | 
  89  |     test('SCHEMA-004 - Validar campos essenciais manualmente', async () => {
  90  |         const usersService = serviceFactory.getUsersService()
  91  |         const response = await usersService.getUser(testData.validUser)
  92  |         const body = await response.json()
  93  |         
  94  |         const essentialFields = ['id', 'login', 'avatar_url', 'type', 'public_repos', 'followers']
  95  |         
  96  |         expect(() => validator.validateEssential(body, essentialFields)).not.toThrow()
  97  |     })
  98  | 
  99  |     test('SCHEMA-005 - Validar que o UsersService já faz validação automática', async () => {
  100 |    
  101 |         const usersService = serviceFactory.getUsersService()
  102 |         
  103 |         await expect(usersService.getUser(testData.validUser)).resolves.toBeDefined()
  104 |     })
  105 | })
```