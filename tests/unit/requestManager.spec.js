const { test, expect, beforeEach } = require('@playwright/test');
const RequestManager = require('../../core/requestManager');

test.describe('RequestManager', () => {
    let mockRequest;

    beforeEach(() => {
        RequestManager.cleanupAll();

        mockRequest = {
            get: async () => ({
                status: () => 200
            }),
            post: async () => ({
                status: () => 201
            }),
            put: async () => ({
                status: () => 200
            }),
            delete: async () => ({
                status: () => 204
            })
        };
    });

    test('deve manter comportamento singleton', () => {
        const rm1 = RequestManager.getInstance(
            mockRequest,
            'https://api.github.com'
        );

        const rm2 = RequestManager.getInstance(
            mockRequest,
            'https://api.github.com'
        );

        expect(rm1).toBe(rm2);
    });

    test('deve configurar headers padrão', () => {
        const rm = new RequestManager(
            mockRequest,
            'https://api.github.com'
        );

        const headers = rm.getHeaders();

        expect(headers.Accept)
            .toBe('application/vnd.github.v3+json');

        expect(headers['Content-Type'])
            .toBe('application/json');

        expect(headers['User-Agent'])
            .toBe('Playwright-GitHub-API-Test');
    });

    test('deve adicionar token na criação', () => {
        const rm = new RequestManager(
            mockRequest,
            'https://api.github.com',
            {
                authToken: 'github_pat_xxxxxxxxxxxxxxx'
            }
        );

        expect(
            rm.getHeaders().Authorization
        ).toBe('Bearer github_pat_xxxxxxxxxxxxxxx');
    });

    test('deve atualizar token com setAuthToken', () => {
        const rm = new RequestManager(
            mockRequest,
            'https://api.github.com'
        );

        rm.setAuthToken('novo-token');

        expect(
            rm.getHeaders().Authorization
        ).toBe('Bearer novo-token');
    });

    test('deve remover token quando null', () => {
        const rm = new RequestManager(
            mockRequest,
            'https://api.github.com',
            {
                authToken: 'token123'
            }
        );

        rm.setAuthToken(null);

        expect(
            rm.getHeaders().Authorization
        ).toBeUndefined();
    });
    test('deve executar GET corretamente', async () => {
        const responseMock = {
            status: () => 200
        };

        mockRequest.get = async (url, options) => {
            expect(url).toBe(
                'https://api.github.com/users'
            );

            expect(options.params.page).toBe(1);

            return responseMock;
        };

        const rm = new RequestManager(
            mockRequest,
            'https://api.github.com'
        );

        const response = await rm.get(
            '/users',
            { page: 1 }
        );

        expect(response).toBe(responseMock);
    });
    test('constructor deve retornar instancia existente', () => {
        const request = {};

        const rm1 = new RequestManager(
            request,
            'https://api.github.com'
        );

        const rm2 = new RequestManager(
            request,
            'https://api.github.com'
        );

        expect(rm1).toBe(rm2);
    });
    test('deve mesclar headers customizados', () => {
        const rm = new RequestManager(
            {},
            'https://api.github.com',
            {
                headers: {
                    'X-Custom': 'teste'
                }
            }
        );

        expect(
            rm.getHeaders()['X-Custom']
        ).toBe('teste');
    });
    test('deve executar post', async () => {
        const responseMock = {
            status: () => 201
        };

        const request = {
            post: async (url, options) => {
                expect(url)
                    .toBe('https://api.github.com/users');

                expect(options.data.nome)
                    .toBe('Victor');

                return responseMock;
            }
        };

        const rm = new RequestManager(
            request,
            'https://api.github.com'
        );

        const response = await rm.post(
            '/users',
            { nome: 'Victor' }
        );

        expect(response).toBe(responseMock);
    });

    test('deve executar put', async () => {
        const responseMock = {
            status: () => 200
        };

        const request = {
            put: async (url, options) => {
                expect(options.data.nome)
                    .toBe('Atualizado');

                return responseMock;
            }
        };

        const rm = new RequestManager(
            request,
            'https://api.github.com'
        );

        const response = await rm.put(
            '/users/1',
            { nome: 'Atualizado' }
        );

        expect(response).toBe(responseMock);
    });

    test('deve executar delete', async () => {
        const responseMock = {
            status: () => 204
        };

        const request = {
            delete: async () => responseMock
        };

        const rm = new RequestManager(
            request,
            'https://api.github.com'
        );

        const response = await rm.delete(
            '/users/1'
        );

        expect(response).toBe(responseMock);
    });
    
    test('getHeaders deve retornar cópia', () => {
        const rm = new RequestManager(
            mockRequest,
            'https://api.github.com'
        );

        const headers = rm.getHeaders();

        headers.teste = 'valor';

        expect(
            rm.getHeaders().teste
        ).toBeUndefined();
    });

    test('cleanup remove instância', () => {
        const rm = new RequestManager(
            mockRequest,
            'https://api.github.com'
        );

        expect(
            RequestManager.instances.size
        ).toBe(1);

        rm.cleanup();

        expect(
            RequestManager.instances.size
        ).toBe(0);
    });

    test('cleanupAll remove todas as instâncias', () => {
        const request2 = {};

        new RequestManager(
            mockRequest,
            'https://api.github.com'
        );

        new RequestManager(
            request2,
            'https://api.github.com'
        );

        expect(
            RequestManager.instances.size
        ).toBe(2);

        RequestManager.cleanupAll();

        expect(
            RequestManager.instances.size
        ).toBe(0);
    });
});