const BaseService = require('../core/baseService')
const issueSchema = require('../schemas/issues.schema')

/**
 * Service for GitHub issue-related API actions.
 */
class IssuesService extends BaseService {
    /**
     * Create an IssuesService instance.
     * @param {object} request - Playwright request object.
     * @param {object} [options={}] - Additional options.
     */
    constructor(request, options = {}) {
        super(request, options)
    }

    /**
     * List issues for a repository.
     * @param {string} owner - Repository owner.
     * @param {string} repo - Repository name.
     * @param {string} [state] - Issue state filter.
     * @param {object} [pagination={}] - Pagination options.
     * @param {number} [pagination.perPage] - Results per page.
     * @param {number} [pagination.page] - Page number.
     * @returns {Promise<object>} Response object.
     */
    async listIssues(owner, repo, state, pagination = {}) {
        const params = {}
        if (state) params.state = state
        if (pagination.perPage) params.per_page = pagination.perPage
        if (pagination.page) params.page = pagination.page

        const response = await this.apiClient.get(`/repos/${owner}/${repo}/issues`, params)
        return response
    }
}
module.exports = IssuesService
