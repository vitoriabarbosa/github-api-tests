module.exports = {
    type: 'object',
    required: ['id', 'title', 'state'],
    properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        state: { type: 'string', enum: ['open', 'closed'] }
    }
}
