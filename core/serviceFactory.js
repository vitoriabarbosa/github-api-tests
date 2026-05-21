const { test, expect } = require('@playwright/test');
const RequestManager = require('../../core/requestManager');

test.describe('RequestManager Unit Tests', () => {
    test.beforeEach(() => {
        RequestManager.cleanupAll();
    });

    test('RequestManager deve ser Singleton por request', async ({ request }) => {
        const baseURL = 'https://api.github.com';
        
        const instance1 = RequestManager.getInstance(request, baseURL);
        const instance2 = RequestManager.getInstance(request, baseURL);
        
        expect(instance1).toBe(instance2);
    });
    
    test('RequestManager deve manter headers configurados', async ({ request }) => {
        const baseURL = 'https://api.github.com';
        const options = {
            headers: { 'X-Custom': 'test' }
        };
        
        const manager = RequestManager.getInstance(request, baseURL, options);
        const headers = manager.getHeaders();
        
        expect(headers).toHaveProperty('X-Custom', 'test');
        expect(headers).toHaveProperty('Accept', 'application/vnd.github.v3+json');
        expect(headers).toHaveProperty('User-Agent', 'Playwright-GitHub-API-Test');
        expect(headers).toHaveProperty('Content-Type', 'application/json');
    });
    
    test('RequestManager deve permitir setAuthToken', async ({ request }) => {
        const baseURL = 'https://api.github.com';
        const manager = RequestManager.getInstance(request, baseURL);
        
        manager.setAuthToken('test-token-123');
        expect(manager.getHeaders()).toHaveProperty('Authorization', 'Bearer test-token-123');
        
        manager.setAuthToken(null);
        expect(manager.getHeaders()).not.toHaveProperty('Authorization');
    });
    
    test('RequestManager deve ter instâncias diferentes para diferentes requests', async ({ request: request1 }, testInfo) => {
        const request2 = {
            get: async () => ({ status: () => 200 })
        };
        
        const baseURL = 'https://api.github.com';
        
        const instance1 = RequestManager.getInstance(request1, baseURL);
        const instance2 = RequestManager.getInstance(request2, baseURL);
        
        expect(instance1).not.toBe(instance2);
    });
});