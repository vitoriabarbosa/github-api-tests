const { test, expect } = require('@playwright/test');
const config = require('../utils/config');

test('T005 - Validar listagem geral de issues', async ({ request }) => {

    const response = await request.get(
        `${config.BASE_URL}/repos/${config.OWNER}/${config.REPO}/issues`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(Array.isArray(body)).toBeTruthy();

    body.forEach(issue => {

        expect(issue).toHaveProperty('id');
        expect(issue).toHaveProperty('title');
        expect(issue).toHaveProperty('state');
    });
});

test('T006 - Validar filtro de status das issues', async ({ request }) => {

    const response = await request.get(
        `${config.BASE_URL}/repos/${config.OWNER}/${config.REPO}/issues?state=open`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    body.forEach(issue => {
        expect(issue.state).toBe('open');
    });
});