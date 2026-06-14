const BaseService = require('../core/baseService')
const userSchema = require('../schemas/users.schema')

/**
 * Service for GitHub user-related API actions.
 */
class UsersService extends BaseService {
    /**
     * Create a UsersService instance.
     * @param {object} request - Playwright request object.
     * @param {object} [options={}] - Additional options.
     */
    constructor(request, options = {}) {
        super(request, options)
    }

    /**
     * Get a GitHub user by username.
     * @param {string} username - GitHub username.
     * @returns {Promise<object>} Response object.
     */
    async getUser(username) {
        const response = await this.apiClient.get(`/users/${username}`)
        if (response.status() === 200) {
            const body = await response.json()
            this.validator.validate(body, userSchema)
        }
        return response
    }

    /**
     * Get repositories for a specific user.
     * @param {string} username - GitHub username.
     * @returns {Promise<object>} Response object.
     */
    async getUserRepos(username) {
        const response = await this.apiClient.get(`/users/${username}/repos`)
        return response
    }
}

module.exports = UsersService
