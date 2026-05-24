require('dotenv').config()
module.exports = {
    timeout: parseInt(process.env.TIMEOUT) || 30000,

    reporter: [['html']],

    use: {
        baseURL: process.env.BASE_URL || 'https://api.github.com',
        extraHTTPHeaders: {
            Accept: 'application/vnd.github+json'
        }
    }
}
