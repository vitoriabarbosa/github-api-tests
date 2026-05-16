module.exports = {
    timeout: 30000,

    reporter: [['html']],

    use: {
        baseURL: 'https://api.github.com',
        extraHTTPHeaders: {
            Accept: 'application/vnd.github+json'
        }
    }
};