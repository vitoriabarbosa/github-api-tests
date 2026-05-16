const { test, expect } = require('@playwright/test');
const config = require('../utils/config');

test('T013 - Listar commits de um repositório', async ({ request }) => {

    const response = await request.get(
        `${config.BASE_URL}/repos/${config.OWNER}/${config.REPO}/commits`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(Array.isArray(body)).toBeTruthy();

    body.forEach(commit => {

        expect(commit).toHaveProperty('sha');
        expect(commit).toHaveProperty('commit');

        expect(commit.commit).toHaveProperty('message');
        expect(commit.commit).toHaveProperty('author');

        expect(typeof commit.sha).toBe('string');
    });
});

test('T014 - Validar tratamento de erros para repositório inexistente', async ({ request }) => {

    const response = await request.get(
        `${config.BASE_URL}/repos/${config.NOT_OWNER}/${config.REPO}/commits`
    );

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.message).toBe('Not Found');
});