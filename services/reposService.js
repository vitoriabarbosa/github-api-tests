const BaseService = require('../core/baseService')

/**
 * Service for GitHub repository-related API actions.
 */
class ReposService extends BaseService {
    /**
     * Create a ReposService instance.
     * @param {object} request - Playwright request object.
     * @param {object} [options={}] - Additional options.
     */
    constructor(request, options = {}) {
        super(request, options)
    }

    /**
     * List repositories for a user.
     * @param {string} username - GitHub username.
     * @returns {Promise<object>} Response object.
     */
    async listRepos(username) {
        const response = await this.apiClient.get(`/users/${username}/repos`)
        return response
    }

    /**
     * Search repositories by programming language.
     * @param {string} language - Language query string.
     * @returns {Promise<object>} Response object.
     */
    async searchByLanguage(language) {
        const response = await this.apiClient.get(`/search/repositories`, {
            q: `language:${language}`
        })
        return response
    }

    /**
     * Get repositories accessible by the authenticated user.
     * @returns {Promise<object>} Response object.
     */
    async getAuthenticatedRepos() {
        const response = await this.apiClient.get('/user/repos')
        return response
    }

    /**
     * Get a specific repository.
     * @param {string} owner - Repository owner.
     * @param {string} repo - Repository name.
     * @returns {Promise<object>} Response object.
     */
    async getRepo(owner, repo) {
        const response = await this.apiClient.get(`/repos/${owner}/${repo}`)
        return response
    }
}

module.exports = ReposService
