const Ajv = require('ajv')
const ajv = new Ajv()

class SchemaValidator {
    validate(data, schema) {
        const valid = ajv.validate(schema, data)
        if (!valid) {
            throw new Error(`Invalid schema:${ajv.errorsText()}`)
        }
        return true
    }
}
module.exports = SchemaValidator
