const logger=require('../utils/logger')

class ApiClient{
    constructor(request, baseURL){
        this.request=request
        this.baseURL=baseURL
    }

    async get(endpoint, params={}){
        const url=`${this.baseURL}${endpoint}`
        const start=Date.now()
        logger.logRequest('GET', url)
        const response = await this.request.get(url, {params})
        logger.logResponse(response.status(), url, Date.now()-start)
        return response
    }
}

module.exports=ApiClient