const UsersService = require('../services/usersService');
const ReposService = require('../services/reposService');
const PullsService = require('../services/pullsService');
const IssuesService = require('../services/issuesService');
const CommitsService = require('../services/commitsService');
const RequestManager = require('./requestManager');

class ServiceFactory {
    constructor(request, options = {}) {
        this.request = request;
        this.options = options;
        this.services = new Map();
        
        const baseURL = options.baseURL || 'https://api.github.com';
        this.requestManager = RequestManager.getInstance(request, baseURL, options);
    }
    
    getUsersService() {
        if (!this.services.has('users')) {
            this.services.set('users', new UsersService(this.request, this.options));
        }
        return this.services.get('users');
    }
    
    getReposService() {
        if (!this.services.has('repos')) {
            this.services.set('repos', new ReposService(this.request, this.options));
        }
        return this.services.get('repos');
    }
    
    getPullsService() {
        if (!this.services.has('pulls')) {
            this.services.set('pulls', new PullsService(this.request, this.options));
        }
        return this.services.get('pulls');
    }
    
    getIssuesService() {
        if (!this.services.has('issues')) {
            this.services.set('issues', new IssuesService(this.request, this.options));
        }
        return this.services.get('issues');
    }
    
    getCommitsService() {
        if (!this.services.has('commits')) {
            this.services.set('commits', new CommitsService(this.request, this.options));
        }
        return this.services.get('commits');
    }
    
    setAuthToken(token) {
        this.requestManager.setAuthToken(token);
        return this;
    }
    
    cleanup() {
        this.services.clear();
    }
}

module.exports = ServiceFactory;