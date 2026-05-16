const { test, expect } = require('@playwright/test');
const config = require('../utils/config');

test('T001 - Pull Requests open', async ({ request }) => {

    const response = await request.get(
        `${config.BASE_URL}/repos/${config.OWNER}/${config.REPO}/pulls?state=open`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(Array.isArray(body)).toBeTruthy();

    body.forEach(pr => {
        expect(pr.state).toBe('open');
    });
});

test('T002 - Pull Requests closed', async ({ request }) => {

    const response = await request.get(
        `${config.BASE_URL}/repos/${config.OWNER}/${config.REPO}/pulls?state=closed`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    body.forEach(pr => {
        expect(pr.state).toBe('closed');
    });
});