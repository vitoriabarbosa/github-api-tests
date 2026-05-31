require('dotenv').config(); 
module.exports = {
    timeout: parseInt(process.env.TIMEOUT) || 30000,

    reporter: [
        ['html'],
        ['list'],
        ['junit', { outputFile: 'test-results/results.xml' }]
    ],

    use: {
        baseURL: process.env.BASE_URL || 'https://api.github.com',
        extraHTTPHeaders: {
            Accept: 'application/vnd.github+json'
        },
        // Captura de evidências em falhas
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
    }
};
