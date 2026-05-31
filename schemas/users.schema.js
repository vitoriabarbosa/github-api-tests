module.exports = {
    type: 'object',
    required: ['id', 'login', 'avatar_url', 'type', 'public_repos', 'followers'],
    properties: {
        id: { type: 'number' },
        login: { type: 'string' },
        avatar_url: { type: 'string' },
        type: { type: 'string' },
        public_repos: { type: 'number' },
        followers: { type: 'number' }
    }
}
