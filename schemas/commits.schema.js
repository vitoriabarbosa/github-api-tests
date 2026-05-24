module.exports = {
    type: 'object',
    required: ['sha', 'commit'],
    properties: {
        sha: { type: 'string' },
        commit: {
            type: 'object',
            required: ['message', 'author'],
            properties: {
                message: { type: 'string' },
                author: { type: 'object' }
            }
        }
    }
}
