const RequestManager = require('./requestManager');

class ApiClient{
    constructor(request, baseURL, options = {}) {
        this.requestManager = RequestManager.getInstance(request, baseURL, options);
    }

    async get(endpoint, params = {}) {
        return this.requestManager.get(endpoint, params);
    }
    
    async post(endpoint, data = {}, params = {}) {
        return this.requestManager.post(endpoint, data, params);
    }
    
    async put(endpoint, data = {}, params = {}) {
        return this.requestManager.put(endpoint, data, params);
    }
    
    async delete(endpoint, params = {}) {
        return this.requestManager.delete(endpoint, params);
    }
    
    setAuthToken(token) {
        this.requestManager.setAuthToken(token);
    }
}

module.exports = ApiClient;