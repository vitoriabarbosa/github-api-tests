const { test, expect } = require('@playwright/test');
const config = require('../utils/config');

test('T007 - Validar busca de usuário válido', async ({ request }) => {

    const response = await request.get(
        `${config.BASE_URL}/users/${config.USERNAME}`
    );

    expect(response.status()).toBe(200);
    
    expect(response.headers()['content-type'])
        .toContain('application/json');

    const body = await response.json();

    expect(body).toHaveProperty('login');
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('avatar_url');

    expect(body.login.toLowerCase())
        .toBe(config.USERNAME.toLowerCase());

    expect(typeof body.id).toBe('number');
    expect(typeof body.login).toBe('string');
});

test('T008 - Validar comportamento para usuário inexistente', async ({ request }) => {

    const response = await request.get(
        `${config.BASE_URL}/users/${config.NOT_USER}`
    );

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.message).toBe('Not Found');

    expect(typeof body.message).toBe('string');
});

test('T009 - Validar estrutura da resposta do usuário', async ({ request }) => {

    const response = await request.get(
        `${config.BASE_URL}/users/${config.USERNAME}`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('login');
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('avatar_url');
    expect(body).toHaveProperty('type');
    expect(body).toHaveProperty('public_repos');

    expect(typeof body.id).toBe('number');
    expect(typeof body.followers).toBe('number');
});