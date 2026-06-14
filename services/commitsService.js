const BaseService = require('../core/baseService')
const commitSchema = require('../schemas/commits.schema')

/**
 * Service for GitHub commit-related API actions.
 */
class CommitsService extends BaseService {
    /**
     * Create a CommitsService instance.
     * @param {object} request - Playwright request object.
     * @param {object} [options={}] - Additional options.
     */
    constructor(request, options = {}) {
        super(request, options)
    }

    /**
     * List commits for a repository.
     * @param {string} owner - Repository owner.
     * @param {string} repo - Repository name.
     * @returns {Promise<object>} Response object.
     */
    async listCommits(owner, repo) {
        const response = await this.apiClient.get(`/repos/${owner}/${repo}/commits`)
        return response
    }
}

module.exports = CommitsService
