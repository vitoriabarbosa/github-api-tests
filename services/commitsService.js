const ApiClient=require('../core/apiClient')
const SchemaValidator=require('../core/schemaValidator')
const commitSchema=require('../schemas/commits.schema')
const config=require('../utils/config')                                    
   
class CommitsService{                                                        
    constructor(request){                                
        this.client = new ApiClient(request, config.BASE_URL)
        this.validator = new SchemaValidator()
    }

    async listCommits(owner, repo){                                          
        const response=await this.client.get(`/repos/${owner}/${repo}/commits`);                           
        return response;                                  
    }
}

module.exports=CommitsService