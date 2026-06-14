const RequestManager = require('./requestManager')

/**
 * API client wrapper that delegates HTTP requests to RequestManager.
 */
class ApiClient {
    /**
     * Create an ApiClient instance.
     * @param {object} request - Playwright request object.
     * @param {string} baseURL - Base URL for API requests.
     * @param {object} [options={}] - Additional request options.
     */
    constructor(request, baseURL, options = {}) {
        this.requestManager = RequestManager.getInstance(request, baseURL, options)
    }

    /**
     * Send a GET request.
     * @param {string} endpoint - API endpoint path.
     * @param {object} [params={}] - Query parameters.
     * @returns {Promise<object>} Response object.
     */
    async get(endpoint, params = {}) {
        return this.requestManager.get(endpoint, params)
    }

    /**
     * Send a POST request.
     * @param {string} endpoint - API endpoint path.
     * @param {object} [data={}] - Request body payload.
     * @param {object} [params={}] - Query parameters.
     * @returns {Promise<object>} Response object.
     */
    async post(endpoint, data = {}, params = {}) {
        return this.requestManager.post(endpoint, data, params)
    }

    /**
     * Send a PUT request.
     * @param {string} endpoint - API endpoint path.
     * @param {object} [data={}] - Request body payload.
     * @param {object} [params={}] - Query parameters.
     * @returns {Promise<object>} Response object.
     */
    async put(endpoint, data = {}, params = {}) {
        return this.requestManager.put(endpoint, data, params)
    }

    /**
     * Send a DELETE request.
     * @param {string} endpoint - API endpoint path.
     * @param {object} [params={}] - Query parameters.
     * @returns {Promise<object>} Response object.
     */
    async delete(endpoint, params = {}) {
        return this.requestManager.delete(endpoint, params)
    }

    /**
     * Set the authorization token for future requests.
     * @param {string} token - Bearer token for authentication.
     */
    setAuthToken(token) {
        this.requestManager.setAuthToken(token)
    }
}

module.exports = ApiClient
