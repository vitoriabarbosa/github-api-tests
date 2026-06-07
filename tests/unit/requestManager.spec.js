const { test, expect } = require('@playwright/test')
const RequestManager = require('../../core/requestManager')

test.describe('RequestManager Tests', () => {
    test('RequestManager deve ser Singleton por request', { tag: ['@unidade', '@alta', '@nucleo'] }, async ({ request }) => {
        const baseURL = 'https://api.github.com'

        const instance1 = RequestManager.getInstance(request, baseURL)
        const instance2 = RequestManager.getInstance(request, baseURL)

        expect(instance1).toBe(instance2)
    })

    test('RequestManager deve manter headers configurados', { tag: ['@unidade', '@alta', '@nucleo'] }, async ({ request }) => {
        const baseURL = 'https://api.github.com'
        const options = {
            headers: { 'X-Custom': 'test' }
        }

        const manager = RequestManager.getInstance(request, baseURL, options)
        const headers = manager.getHeaders()

        expect(headers).toHaveProperty('X-Custom', 'test')
        expect(headers).toHaveProperty('Accept')
        expect(headers).toHaveProperty('User-Agent')
        expect(headers).toHaveProperty('Content-Type')
    })

    test('RequestManager deve permitir setAuthToken', { tag: ['@unidade', '@alta', '@nucleo'] }, async ({ request }) => {
        const baseURL = 'https://api.github.com'
        const manager = RequestManager.getInstance(request, baseURL)

        manager.setAuthToken('test-token-123')
        expect(manager.getHeaders()).toHaveProperty('Authorization', 'Bearer test-token-123')

        manager.setAuthToken(null)
        expect(manager.getHeaders()).not.toHaveProperty('Authorization')
    })
})
