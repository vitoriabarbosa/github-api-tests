const ApiClient = require('../core/apiClient')
const SchemaValidator = require('../core/schemaValidator')
const pullSchema = require('../schemas/pulls.schema')
const config = require('../utils/config')

class PullsService {
    constructor(request) {
        this.client = new ApiClient(request, config.BASE_URL)
        this.validator = new SchemaValidator()
    }

    async listPulls(owner, repo, state) {
        const response = await this.client.get(`/repos/${owner}/${repo}/pulls`, { state })
        return response
    }
}

module.exports = PullsService
