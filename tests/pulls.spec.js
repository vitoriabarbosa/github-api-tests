const {test, expect}=require('@playwright/test')
const PullsService=require('../services/pullsService')
const Assertions=require('../core/assertions')
const testData=require('../fixtures/testData')

test('T001 - Pull Requests open', async ({ request }) => {
    const service = new PullsService(request)
    const assertions = new Assertions()

    const response=await service.listPulls(testData.owner, testData.repo, 'open')
    const body=await response.json()

    assertions.assertStatus(response, 200)
    body.forEach(pr => expect(pr.state).toBe('open'))
})

test('T002 - Pull Requests closed', async ({ request }) => {
    const service = new PullsService(request)
    const assertions = new Assertions()

    const response=await service.listPulls(testData.owner, testData.repo, 'closed')
    const body=await response.json()

    assertions.assertStatus(response, 200)
    body.forEach(pr => expect(pr.state).toBe('closed'))
})
