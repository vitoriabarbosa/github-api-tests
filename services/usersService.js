const ApiClient=require('../core/apiClient')           
const SchemaValidator=require('../core/schemaValidator')
const userSchema=require('../schemas/users.schema')
const config=require('../utils/config')                                   
   
class UsersService{                                                          
    constructor(request, options = {}){                                
        this.client = new ApiClient(request, config.BASE_URL)                
        this.validator = new SchemaValidator()
    }                                                                         
                                                            
    async getUser(username){
        const response=await this.client.get(`/users/${username}`)
        if (response.status() === 200){                                      
            const body = await response.json()
            this.validator.validate(body, userSchema)                        
        }                                                                     
        return response
    }                                                                         
                                                            
    async getUserRepos(username){
        const response=await this.client.get(`/users/${username}/repos`)
        return response                                                    
    }
}

module.exports=UsersService