require('dotenv').config()

module.exports = {
    BASE_URL: process.env.BASE_URL || 'https://api.github.com',
    OWNER: process.env.OWNER || 'octocat',
    REPO: process.env.REPO || 'Hello-World',
    ISSUE_NUMBER: 1,
    USERNAME: 'octocat',
    NOT_USER: 'invalid_user_12345',
    NOT_OWNER: 'invalid_owner_12345'
}
