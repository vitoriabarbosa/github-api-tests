const ApiClient=require('../core/apiClient')
const SchemaValidator=require('../core/schemaValidator')                  
const repoSchema=require('../schemas/repos.schema')
const config=require('../utils/config')                                    
                                                            
class ReposService{
    constructor(request){
        this.client = new ApiClient(request, config.BASE_URL)               
        this.validator = new SchemaValidator()
    }                                                                         
                                                            
    async listRepos(username){
        const response=await this.client.get(`/users/${username}/repos`);
        return response;                                                      
    }
                                                                                
    async searchByLanguage(language){                    
        const response = await this.client.get(`/search/repositories`, {q:`language:${language}`});                                                    
        return response;
    }                                                                         
}                                                                             
   
module.exports=ReposService