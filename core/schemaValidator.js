const Ajv = require('ajv')
const addFormats = require('ajv-formats')

class SchemaValidator {
    constructor(options = {}) {
        this.ajv = new Ajv({ 
            allErrors: true,      
            verbose: true,
            strict: false,        
            coerceTypes: false,    
            useDefaults: false,    
            removeAdditional: false 
        })
        addFormats(this.ajv)
        this.compiledSchemas = new Map()
        
        this.throwOnError = options.throwOnError !== false
    }

    validate(data, schema, schemaName = 'unnamed') {
        try {
            let validateFn = this.compiledSchemas.get(schemaName)
            if (!validateFn) {
                validateFn = this.ajv.compile(schema)
                this.compiledSchemas.set(schemaName, validateFn)
            }

            const valid = validateFn(data)
            
            if (!valid) {
                const errors = this.formatErrors(validateFn.errors)
                const error = new Error(`Schema validation failed for ${schemaName}:\n${errors}`)
                
                if (this.throwOnError) {
                    throw error
                }
                return { valid: false, errors: validateFn.errors, error }
            }
            
            return { valid: true, errors: null }
        } catch (error) {
            if (error.message.includes('Schema validation failed')) throw error
            throw new Error(`Unexpected error validating schema ${schemaName}: ${error.message}`)
        }
    }

    validateSilent(data, schema, schemaName = 'unnamed') {
        const originalThrow = this.throwOnError
        this.throwOnError = false
        const result = this.validate(data, schema, schemaName)
        this.throwOnError = originalThrow
        return result
    }

    async validateAsync(data, schema, schemaName = 'unnamed') {
        return this.validate(data, schema, schemaName)
    }

    formatErrors(errors) {
        if (!errors) return 'Unknown validation error'
        
        return errors.map(err => {
            const path = err.instancePath || '/'
            const message = err.message || 'Validation error'
            return `  - ${path}: ${message}`
        }).join('\n')
    }

    validateArrayItem(array, schema, itemSchemaName) {
        if (!Array.isArray(array)) {
            throw new Error(`Expected array for partial validation, got ${typeof array}`)
        }
        
        const results = {
            total: array.length,
            valid: 0,
            invalid: 0,
            errors: []
        }

        for (let i = 0; i < array.length; i++) {
            try {
                this.validate(array[i], schema, `${itemSchemaName}[${i}]`)
                results.valid++
            } catch (error) {
                results.invalid++
                results.errors.push({ index: i, error: error.message })
            }
        }

        if (results.invalid > 0 && this.throwOnError) {
            throw new Error(`Array validation: ${results.valid}/${results.total} valid items. ${results.invalid} failed.\n${results.errors.map(e => `  Item ${e.index}: ${e.error}`).join('\n')}`)
        }

        return results
    }

    validateEssential(data, requiredFields) {
        const missingFields = requiredFields.filter(field => {
            if (field.includes('.')) {
                const parts = field.split('.')
                let value = data
                for (const part of parts) {
                    if (value === undefined || value === null) return true
                    value = value[part]
                }
                return value === undefined || value === null
            }
            return data[field] === undefined || data[field] === null
        })

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
        }
        return true
    }
}

module.exports = SchemaValidator