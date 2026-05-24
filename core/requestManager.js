const logger = require('../utils/logger')

class RequestManager {
    static instances = new Map()

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

    static getInstance(request, baseURL, options = {}) {
        const key = request

        if (!RequestManager.instances.has(key)) {
            RequestManager.instances.set(key, new RequestManager(request, baseURL, options))
        }
        return RequestManager.instances.get(key)
    }

    setAuthToken(token) {
        this.authToken = token
        if (token) {
            this.defaultHeaders['Authorization'] = `Bearer ${token}`
        } else {
            delete this.defaultHeaders['Authorization']
        }
    }

    getHeaders() {
        return { ...this.defaultHeaders }
    }

    async get(endpoint, params = {}) {
        const url = `${this.baseURL}${endpoint}`
        const start = Date.now()
        const headers = this.getHeaders()

        logger.logRequest('GET', url)

        const response = await this.request.get(url, {
            params,
            headers
        })

        logger.logResponse(response.status(), url, Date.now() - start)
        return response
    }

    async post(endpoint, data = {}, params = {}) {
        const url = `${this.baseURL}${endpoint}`
        const start = Date.now()
        const headers = this.getHeaders()

        logger.logRequest('POST', url)

        const response = await this.request.post(url, {
            params,
            headers,
            data
        })

        logger.logResponse(response.status(), url, Date.now() - start)
        return response
    }

    async put(endpoint, data = {}, params = {}) {
        const url = `${this.baseURL}${endpoint}`
        const start = Date.now()
        const headers = this.getHeaders()

        logger.logRequest('PUT', url)

        const response = await this.request.put(url, {
            params,
            headers,
            data
        })

        logger.logResponse(response.status(), url, Date.now() - start)
        return response
    }

    async delete(endpoint, params = {}) {
        const url = `${this.baseURL}${endpoint}`
        const start = Date.now()
        const headers = this.getHeaders()

        logger.logRequest('DELETE', url)

        const response = await this.request.delete(url, {
            params,
            headers
        })

        logger.logResponse(response.status(), url, Date.now() - start)
        return response
    }

    cleanup() {
        const key = this.request
        RequestManager.instances.delete(key)
    }

    static cleanupAll() {
        RequestManager.instances.clear()
    }
}

module.exports = RequestManager
