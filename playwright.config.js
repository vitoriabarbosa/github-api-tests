require('dotenv').config()

module.exports = {
    timeout: parseInt(process.env.TIMEOUT) || 30000,
    fullyParallel: true,
    workers: process.env.PW_WORKERS ? parseInt(process.env.PW_WORKERS, 10) : undefined,

    reporter: [['html'], ['allure-playwright']],

    use: {
        baseURL: process.env.BASE_URL || 'https://api.github.com',
        extraHTTPHeaders: {
            Accept: 'application/vnd.github+json'
        }
    }
}
