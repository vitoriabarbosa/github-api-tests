module.exports = {
    type: 'object',
    required: ['id', 'name', 'full_name', 'private', 'html_url', 'owner'],
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        full_name: { type: 'string' },
        private: { type: 'boolean' },
        html_url: { type: 'string' },
        owner: {
            type: 'object',
            required: ['login'],
            properties: {
                login: { type: 'string' }
            }
        }
    }
}
