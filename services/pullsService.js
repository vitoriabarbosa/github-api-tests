const BaseService = require('../core/baseService')
const pullSchema = require('../schemas/pulls.schema')

/**
 * Service for GitHub pull request API actions.
 */
class PullsService extends BaseService {
    /**
     * Create a PullsService instance.
     * @param {object} request - Playwright request object.
     * @param {object} [options={}] - Additional options.
     */
    constructor(request, options = {}) {
        super(request, options)
    }

    /**
     * List pull requests for a repository.
     * @param {string} owner - Repository owner.
     * @param {string} repo - Repository name.
     * @param {string} [state] - Pull request state (open, closed, all).
     * @returns {Promise<object>} Response object.
     */
    async listPulls(owner, repo, state) {
        const response = await this.apiClient.get(`/repos/${owner}/${repo}/pulls`, { state })
        return response
    }
}

module.exports = PullsService
