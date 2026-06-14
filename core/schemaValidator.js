const Ajv = require('ajv')
const addFormats = require('ajv-formats')

/**
 * Utility for validating data against JSON schemas.
 */
class SchemaValidator {
    /**
     * Create a SchemaValidator instance.
     * @param {object} [options={}] - Validator options.
     * @param {boolean} [options.throwOnError=true] - Throw an error when validation fails.
     */
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

    /**
     * Validate data against a JSON schema.
     * @param {*} data - Data to validate.
     * @param {object} schema - JSON schema definition.
     * @param {string} [schemaName='unnamed'] - Identifier for schema caching and error messages.
     * @returns {{valid:boolean,errors:object[]|null,error:Error|null}}
     * @throws {Error} When the data is invalid and throwOnError is enabled.
     */
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

    /**
     * Validate data without throwing on failure.
     * @param {*} data - Data to validate.
     * @param {object} schema - JSON schema definition.
     * @param {string} [schemaName='unnamed'] - Identifier for schema caching and error messages.
     * @returns {{valid:boolean,errors:object[]|null,error:Error|null}}
     */
    validateSilent(data, schema, schemaName = 'unnamed') {
        const originalThrow = this.throwOnError
        this.throwOnError = false
        const result = this.validate(data, schema, schemaName)
        this.throwOnError = originalThrow
        return result
    }

    /**
     * Async wrapper for validate.
     * @param {*} data - Data to validate.
     * @param {object} schema - JSON schema definition.
     * @param {string} [schemaName='unnamed'] - Identifier for schema caching and error messages.
     * @returns {Promise<*>} Validation result.
     */
    async validateAsync(data, schema, schemaName = 'unnamed') {
        return this.validate(data, schema, schemaName)
    }

    /**
     * Format AJV validation errors into a single readable string.
     * @param {object[]|null} errors - AJV validation errors.
     * @returns {string} Formatted error text.
     */
    formatErrors(errors) {
        if (!errors) return 'Unknown validation error'
        
        return errors.map(err => {
            const path = err.instancePath || '/'
            const message = err.message || 'Validation error'
            return `  - ${path}: ${message}`
        }).join('\n')
    }

    /**
     * Validate each item in an array against a schema.
     * @param {Array} array - Array of items to validate.
     * @param {object} schema - JSON schema definition.
     * @param {string} itemSchemaName - Schema name used for item-level errors.
     * @returns {{total:number,valid:number,invalid:number,errors:Array}} Validation summary.
     * @throws {Error} When the value is not an array or when validation fails and throwOnError is enabled.
     */
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

    /**
     * Check that required fields exist in the given object.
     * @param {object} data - Object to validate.
     * @param {string[]} requiredFields - List of required field names or nested paths.
     * @returns {boolean} True when all required fields are present.
     * @throws {Error} When required fields are missing.
     */
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