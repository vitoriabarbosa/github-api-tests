const ApiClient = require('./apiClient')
const SchemaValidator = require('./schemaValidator')
const config = require('../utils/config')

/**
 * Base service class that provides a shared API client and schema validator.
 */
class BaseService {
    /**
     * Create a base service.
     * @param {object} playwrightRequest - Playwright request object.
     * @param {object} [options={}] - Service options.
     */
    constructor(playwrightRequest, options = {}) {
        this.apiClient = new ApiClient(playwrightRequest, options.baseURL || config.BASE_URL, options)
        this.validator = new SchemaValidator()
    }
}

module.exports = BaseService
