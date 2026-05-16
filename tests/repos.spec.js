const { test, expect } = require('@playwright/test');
const config = require('../utils/config');

test('T010 - Listar repositórios com sucesso', async ({ request }) => {

    const response = await request.get(
        `${config.BASE_URL}/users/${config.USERNAME}/repos`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(Array.isArray(body)).toBeTruthy();

    body.forEach(repo => {

        expect(repo).toHaveProperty('id');
        expect(repo).toHaveProperty('name');
        expect(repo).toHaveProperty('full_name');

        expect(repo.owner.login.toLowerCase())
            .toBe(config.USERNAME.toLowerCase());
    });
});

test('T011 - Validar estrutura da resposta', async ({ request }) => {

    const response = await request.get(
        `${config.BASE_URL}/users/${config.USERNAME}/repos`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    body.forEach(repo => {

        expect(repo).toHaveProperty('private');
        expect(repo).toHaveProperty('html_url');
        expect(repo).toHaveProperty('description');

        expect(repo.owner).toHaveProperty('login');

        expect(typeof repo.private).toBe('boolean');
    });
});

test('T012 - Usuário inexistente', async ({ request }) => {

    const response = await request.get(
        `${config.BASE_URL}/users/${config.NOT_USER}/repos`
    );

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.message).toBe('Not Found');
});