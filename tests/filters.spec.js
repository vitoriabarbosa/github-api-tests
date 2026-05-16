const { test, expect } = require('@playwright/test');
const config = require('../utils/config');

test('T003 - Teste de Validação de Parametrização de Linguagem', async ({ request }) => {

    const response = await request.get(
        `${config.BASE_URL}/search/repositories?q=language:java`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('items');

    body.items.forEach(repo => {

        if (repo.language) {
            expect(repo.language.toLowerCase())
                .toBe('java');
        }
    });
});

test('T004 - Teste de Limitação de Resultados por Página', async ({ request }) => {

    const response = await request.get(
        `${config.BASE_URL}/repos/${config.OWNER}/${config.REPO}/issues?per_page=5&page=1`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(Array.isArray(body)).toBeTruthy();

    expect(body.length).toBeLessThanOrEqual(5);
});