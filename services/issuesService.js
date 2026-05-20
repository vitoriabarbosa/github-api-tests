const ApiClient=require('../core/apiClient')
const SchemaValidator=require('../core/schemaValidator')                 
const issueSchema=require('../schemas/issues.schema')
const config=require('../utils/config')                                   
                                                            
class IssuesService{
    constructor(request){
        this.client = new ApiClient(request, config.BASE_URL)                
        this.validator = new SchemaValidator()
    }                                                                         
                                                            
    async listIssues(owner, repo, state, pagination={}) {
        const params={}
        if (state) params.state=state
        if (pagination.perPage) params.per_page=pagination.perPage
        if (pagination.page) params.page=pagination.page

        const response=await this.client.get(`/repos/${owner}/${repo}/issues`, params)
        return response
    }                                                                         
}                                                         
module.exports=IssuesService