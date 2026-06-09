const fs = require('fs')
const path = require('path')


class SchemaFetcher {
    constructor() {
        this.openApiUrl = 'https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json'
        this.schemasDir = path.join(__dirname, '../schemas')
    }

    async fetchOpenApiSpec() {
        console.log(' Baixando especificação OpenAPI do GitHub...')
        const response = await fetch(this.openApiUrl)
        const spec = await response.json()
        console.log(' Especificação baixada com sucesso!')
        return spec
    }

    extractSchemas(spec) {
        const schemas = {}
        
        if (spec.components && spec.components.schemas) {
            for (const [name, schema] of Object.entries(spec.components.schemas)) {
                schemas[name] = schema
            }
        }
        
        console.log(` Extraídos ${Object.keys(schemas).length} schemas da especificação`)
        return schemas
    }

    findSchemaByName(schemas, possibleNames) {
        for (const name of possibleNames) {
            if (schemas[name]) {
                return { schema: schemas[name], name }
            }
        }
        return null
    }

    mapToTestSchemas(schemas) {
        const mapping = {
            'users': this.findSchemaByName(schemas, ['user', 'private-user', 'full-user', 'public-user']),
            
            'repos': this.findSchemaByName(schemas, ['repository', 'full-repository', 'minimal-repository']),
            
            'issues': this.findSchemaByName(schemas, ['issue', 'issue-simple']),
            
            'pulls': this.findSchemaByName(schemas, ['pull-request', 'pull-request-minimal', 'pull-request-simple']),
            
            'commits': this.findSchemaByName(schemas, ['commit', 'commit-search-result-item', 'simple-commit'])
        }
        
        return mapping
    }

    saveSchema(name, schemaData, originalName) {
        const adaptedSchema = this.adaptToTestSchema(name, schemaData)
        
        const filePath = path.join(this.schemasDir, `${name}.schema.auto.json`)
        const content = JSON.stringify(adaptedSchema, null, 2)
        fs.writeFileSync(filePath, content)
        console.log(` Schema salvo: ${name}.schema.auto.json (origem: ${originalName})`)
    }

    adaptToTestSchema(type, githubSchema) {
        const adaptations = {
            'users': (schema) => {
                const required = ['id', 'login', 'avatar_url', 'type', 'public_repos', 'followers']
                const properties = {}
                
                if (schema.properties) {
                    const propMap = {
                        'login': 'login',
                        'id': 'id',
                        'avatar_url': 'avatar_url',
                        'type': 'type',
                        'public_repos': 'public_repos',
                        'followers': 'followers'
                    }
                    
                    for (const [ourProp, githubProp] of Object.entries(propMap)) {
                        if (schema.properties[githubProp]) {
                            properties[ourProp] = schema.properties[githubProp]
                        }
                    }
                }
                
                return {
                    type: 'object',
                    required: required.filter(req => properties[req]),
                    properties: properties
                }
            },
            
            'repos': (schema) => {
                const required = ['id', 'name', 'full_name', 'private', 'html_url', 'owner']
                const properties = {}
                
                if (schema.properties) {
                    const propMap = {
                        'id': 'id',
                        'name': 'name',
                        'full_name': 'full_name',
                        'private': 'private',
                        'html_url': 'html_url',
                        'owner': 'owner'
                    }
                    
                    for (const [ourProp, githubProp] of Object.entries(propMap)) {
                        if (schema.properties[githubProp]) {
                            properties[ourProp] = schema.properties[githubProp]
                        }
                    }
                }
                
                return {
                    type: 'object',
                    required: required.filter(req => properties[req]),
                    properties: properties
                }
            },
            
            'issues': (schema) => {
                const required = ['id', 'title', 'state']
                const properties = {}
                
                if (schema.properties) {
                    const propMap = {
                        'id': 'id',
                        'title': 'title',
                        'state': 'state'
                    }
                    
                    for (const [ourProp, githubProp] of Object.entries(propMap)) {
                        if (schema.properties[githubProp]) {
                            properties[ourProp] = schema.properties[githubProp]
                        }
                    }
                }
                
                return {
                    type: 'object',
                    required: required.filter(req => properties[req]),
                    properties: properties
                }
            },
            
            'pulls': (schema) => {
                const required = ['id', 'number', 'state', 'title']
                const properties = {}
                
                if (schema.properties) {
                    const propMap = {
                        'id': 'id',
                        'number': 'number',
                        'state': 'state',
                        'title': 'title'
                    }
                    
                    for (const [ourProp, githubProp] of Object.entries(propMap)) {
                        if (schema.properties[githubProp]) {
                            properties[ourProp] = schema.properties[githubProp]
                        }
                    }
                }
                
                return {
                    type: 'object',
                    required: required.filter(req => properties[req]),
                    properties: properties
                }
            },
            
            'commits': (schema) => {
                return {
                    type: 'object',
                    required: ['sha', 'commit'],
                    properties: {
                        sha: { type: 'string' },
                        commit: schema.properties?.commit || { type: 'object' }
                    }
                }
            }
        }
        
        const adapter = adaptations[type]
        if (adapter && githubSchema) {
            return adapter(githubSchema)
        }
        
        return githubSchema
    }

    async generateComparisonReport(currentSchemas, autoSchemas) {
        const report = {
            timestamp: new Date().toISOString(),
            comparisons: {}
        }
        
        const types = ['users', 'repos', 'issues', 'pulls', 'commits']
        
        for (const type of types) {
            const currentPath = path.join(this.schemasDir, `${type}.schema.js`)
            const autoPath = path.join(this.schemasDir, `${type}.schema.auto.json`)
            
            report.comparisons[type] = {
                hasCurrent: fs.existsSync(currentPath),
                hasAuto: !!autoSchemas[type],
                autoSchemaFile: autoSchemas[type] ? `${type}.schema.auto.json` : null
            }
            
            if (fs.existsSync(currentPath) && autoSchemas[type]) {
                const current = require(currentPath)
                const auto = autoSchemas[type]
                
                const currentRequired = current.required || []
                const autoRequired = auto.required || []
                
                report.comparisons[type].differences = {
                    required: {
                        onlyInCurrent: currentRequired.filter(r => !autoRequired.includes(r)),
                        onlyInAuto: autoRequired.filter(r => !currentRequired.includes(r))
                    }
                }
            }
        }
        
        const reportPath = path.join(this.schemasDir, 'schema-comparison-report.json')
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
        console.log(`\n Relatório de comparação salvo em: ${reportPath}`)
        
        return report
    }

    async run() {
        try {
            const spec = await this.fetchOpenApiSpec()
            
            const allSchemas = this.extractSchemas(spec)
            
            const testSchemas = this.mapToTestSchemas(allSchemas)
            
            const savedSchemas = {}
            for (const [type, result] of Object.entries(testSchemas)) {
                if (result && result.schema) {
                    this.saveSchema(type, result.schema, result.name)
                    savedSchemas[type] = result.schema
                } else {
                    console.log(` Schema não encontrado para: ${type}`)
                    console.log(`   Nomes tentados: ${type === 'users' ? 'user, private-user, full-user, public-user' : 
                                      type === 'repos' ? 'repository, full-repository, minimal-repository' :
                                      type === 'issues' ? 'issue, issue-simple' :
                                      type === 'pulls' ? 'pull-request, pull-request-minimal, pull-request-simple' :
                                      'commit, commit-search-result-item, simple-commit'}`)
                }
            }
            
            await this.generateComparisonReport({}, savedSchemas)
            
        
            
        } catch (error) {
            console.error(' Erro ao buscar esquemas:', error.message)
        }
    }
}

const fetcher = new SchemaFetcher()
fetcher.run()