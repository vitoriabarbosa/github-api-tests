const logger = require('../utils/logger')

/**
 * Singleton request manager for sending HTTP requests to GitHub.
 */
class RequestManager {
    static instances = new Map()

    /**
     * Initialize a RequestManager or return an existing instance for the same request object.
     * @param {object} request - Playwright request object.
     * @param {string} baseURL - Base URL for API calls.
     * @param {object} [options={}] - Additional request options.
     */
    constructor(request, baseURL, options = {}) {
        const key = request

        if (RequestManager.instances.has(key)) {
            return RequestManager.instances.get(key)
        }

        this.request = request
        this.baseURL = baseURL
        this.defaultHeaders = {
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Playwright-GitHub-API-Test'
        }

        if (options.headers) {
            this.defaultHeaders = { ...this.defaultHeaders, ...options.headers }
        }

        this.authToken = process.env.GITHUB_TOKEN || options.authToken || null

        if (this.authToken) {
            this.defaultHeaders['Authorization'] = `Bearer ${this.authToken}`
        }

        RequestManager.instances.set(key, this)
    }

    /**
     * Get or create a RequestManager instance.
     * @param {object} request - Playwright request object.
     * @param {string} baseURL - Base URL for API calls.
     * @param {object} [options={}] - Additional options.
     * @returns {RequestManager}
     */
    static getInstance(request, baseURL, options = {}) {
        const key = request

        if (!RequestManager.instances.has(key)) {
            RequestManager.instances.set(key, new RequestManager(request, baseURL, options))
        }
        return RequestManager.instances.get(key)
    }

    /**
     * Update or remove the Authorization header.
     * @param {string|null} token - Bearer token for authentication.
     */
    setAuthToken(token) {
        this.authToken = token
        if (token) {
            this.defaultHeaders['Authorization'] = `Bearer ${token}`
        } else {
            delete this.defaultHeaders['Authorization']
        }
    }

    /**
     * Get the default headers for requests.
     * @returns {object} Headers object.
     */
    getHeaders() {
        return { ...this.defaultHeaders }
    }

    /**
     * Send an HTTP request using the underlying request object.
     * @param {string} method - HTTP method.
     * @param {string} endpoint - API endpoint path.
     * @param {object} [params={}] - Query parameters.
     * @param {object} [data] - Request body payload.
     * @returns {Promise<object>} Response object.
     */
    async sendRequest(method, endpoint, params = {}, data) {
        const url = `${this.baseURL}${endpoint}`
        const start = Date.now()
        const headers = this.getHeaders()

        logger.logRequest(method, url)

        const options = { params, headers }
        if (data !== undefined) {
            options.data = data
        }

        const response = await this.request[method.toLowerCase()](url, options)

        logger.logResponse(response.status(), url, Date.now() - start)
        return response
    }

    /**
     * Send a GET request.
     * @param {string} endpoint - API endpoint path.
     * @param {object} [params={}] - Query parameters.
     * @returns {Promise<object>} Response object.
     */
    async get(endpoint, params = {}) {
        return this.sendRequest('GET', endpoint, params)
    }

    /**
     * Send a POST request.
     * @param {string} endpoint - API endpoint path.
     * @param {object} [data={}] - Request body payload.
     * @param {object} [params={}] - Query parameters.
     * @returns {Promise<object>} Response object.
     */
    async post(endpoint, data = {}, params = {}) {
        return this.sendRequest('POST', endpoint, params, data)
    }

    /**
     * Send a PUT request.
     * @param {string} endpoint - API endpoint path.
     * @param {object} [data={}] - Request body payload.
     * @param {object} [params={}] - Query parameters.
     * @returns {Promise<object>} Response object.
     */
    async put(endpoint, data = {}, params = {}) {
        return this.sendRequest('PUT', endpoint, params, data)
    }

    /**
     * Send a DELETE request.
     * @param {string} endpoint - API endpoint path.
     * @param {object} [params={}] - Query parameters.
     * @returns {Promise<object>} Response object.
     */
    async delete(endpoint, params = {}) {
        return this.sendRequest('DELETE', endpoint, params)
    }

    /**
     * Remove this manager instance from the singleton cache.
     */
    cleanup() {
        const key = this.request
        RequestManager.instances.delete(key)
    }

    /**
     * Clear all cached RequestManager instances.
     */
    static cleanupAll() {
        RequestManager.instances.clear()
    }
}

module.exports = RequestManager
