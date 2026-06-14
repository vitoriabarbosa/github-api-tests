const UsersService = require('../services/usersService')
const ReposService = require('../services/reposService')
const PullsService = require('../services/pullsService')
const IssuesService = require('../services/issuesService')
const CommitsService = require('../services/commitsService')
const RequestManager = require('./requestManager')

/**
 * Factory for application service classes.
 */
class ServiceFactory {
    /**
     * Create a ServiceFactory.
     * @param {object} request - Playwright request object.
     * @param {object} [options={}] - Factory options.
     */
    constructor(request, options = {}) {
        this.request = request
        this.options = options
        this.services = new Map()

        const baseURL = options.baseURL || 'https://api.github.com'
        this.requestManager = RequestManager.getInstance(request, baseURL, options)
    }

    /**
     * Get the UsersService instance.
     * @returns {UsersService}
     */
    getUsersService() {
        if (!this.services.has('users')) {
            this.services.set('users', new UsersService(this.request, this.options))
        }
        return this.services.get('users')
    }

    /**
     * Get the ReposService instance.
     * @returns {ReposService}
     */
    getReposService() {
        if (!this.services.has('repos')) {
            this.services.set('repos', new ReposService(this.request, this.options))
        }
        return this.services.get('repos')
    }

    /**
     * Get the PullsService instance.
     * @returns {PullsService}
     */
    getPullsService() {
        if (!this.services.has('pulls')) {
            this.services.set('pulls', new PullsService(this.request, this.options))
        }
        return this.services.get('pulls')
    }

    /**
     * Get the IssuesService instance.
     * @returns {IssuesService}
     */
    getIssuesService() {
        if (!this.services.has('issues')) {
            this.services.set('issues', new IssuesService(this.request, this.options))
        }
        return this.services.get('issues')
    }

    /**
     * Get the CommitsService instance.
     * @returns {CommitsService}
     */
    getCommitsService() {
        if (!this.services.has('commits')) {
            this.services.set('commits', new CommitsService(this.request, this.options))
        }
        return this.services.get('commits')
    }

    /**
     * Set the authorization token for all service requests.
     * @param {string} token - Bearer token for GitHub authentication.
     * @returns {ServiceFactory} Fluent factory instance.
     */
    setAuthToken(token) {
        this.requestManager.setAuthToken(token)
        return this
    }

    /**
     * Clear cached service instances.
     */
    cleanup() {
        this.services.clear()
    }
}

module.exports = ServiceFactory
