require('dotenv').config(); 
module.exports = {
    timeout: 30000,

    reporter: [
        ['html'],
        ['list'],
        ['junit', { outputFile: 'test-results/results.xml' }]
    ],

    use: {
        baseURL: 'https://api.github.com',
        extraHTTPHeaders: {
            Accept: 'application/vnd.github+json'
        },
        // Captura de evidências
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
    }
};