# GitHub API Tests

Projeto de automação de testes de API desenvolvido para a disciplina de Qualidade de Software 3.

## Objetivo

Automatizar testes da API do GitHub utilizando JavaScript e Playwright Test, realizando validações de:

- Status code
- Body da resposta
- Integridade dos dados
- Tipos de parâmetros
- Headers HTTP

## Tecnologias Utilizadas

- JavaScript
- Node.js
- Playwright Test
- Git/GitHub

## Estrutura do Projeto

```txt
github-api-tests/
│
├── tests/
│   ├── users.spec.js
│   ├── repos.spec.js
│   ├── commits.spec.js
│   ├── pulls.spec.js
│   ├── issues.spec.js
│   └── filters.spec.js
│
├── utils/
│   └── config.js
│
├── package.json
└── playwright.config.js
```

## Instalação

```bash
npm install -D @playwright/test
```

## Execução dos Testes

```bash
npx playwright test
```

## Relatório HTML

```bash
npx playwright show-report
```

### Design Patterns Implementados

#### 1. Singleton Pattern - RequestManager
O `RequestManager` garante uma única instância do gerenciador de requisições HTTP em toda a aplicação, centralizando:
- Configuração de headers padrão
- Gerenciamento de autenticação (tokens)
- Logging unificado
- Rate limiting

#### 2. Factory Pattern - ServiceFactory
O `ServiceFactory` centraliza a criação e gerenciamento de serviços, proporcionando:
- Lazy initialization dos serviços
- Instâncias compartilhadas
- Configuração única para todos os serviços

### Diagrama de Classes

```mermaid
classDiagram
    class RequestManager {
        -static Map instances
        -request
        -baseURL
        -defaultHeaders
        -authToken
        +getInstance(request, baseURL, options)$ RequestManager
        +setAuthToken(token)
        +getHeaders() Object
        +get(endpoint, params) Promise~Response~
        +post(endpoint, data, params) Promise~Response~
        +put(endpoint, data, params) Promise~Response~
        +delete(endpoint, params) Promise~Response~
        +cleanup()
        +cleanupAll()$
    }
    
    class ApiClient {
        -requestManager
        +constructor(request, baseURL, options)
        +get(endpoint, params) Promise~Response~
        +post(endpoint, data, params) Promise~Response~
        +put(endpoint, data, params) Promise~Response~
        +delete(endpoint, params) Promise~Response~
        +setAuthToken(token)
    }
    
    class ServiceFactory {
        -request
        -options
        -Map services
        -requestManager
        +constructor(request, options)
        +getUsersService() UsersService
        +getReposService() ReposService
        +getPullsService() PullsService
        +getIssuesService() IssuesService
        +getCommitsService() CommitsService
        +setAuthToken(token) ServiceFactory
        +cleanup()
    }
    
    class UsersService {
        -client
        -validator
        +constructor(request)
        +getUser(username)
        +getUserRepos(username)
    }
    
    class ReposService {
        -client
        -validator
        +constructor(request)
        +listRepos(username)
        +searchByLanguage(language)
        +getAuthenticatedRepos()
    }
    
    class PullsService {
        -client
        -validator
        +constructor(request)
        +listPulls(owner, repo, state)
    }
    
    class IssuesService {
        -client
        -validator
        +constructor(request)
        +listIssues(owner, repo, state, pagination)
    }
    
    class CommitsService {
        -client
        -validator
        +constructor(request)
        +listCommits(owner, repo)
    }
    
    RequestManager <|-- ApiClient : uses
    ApiClient <-- ServiceFactory : creates
    ServiceFactory --> UsersService : instantiates
    ServiceFactory --> ReposService : instantiates
    ServiceFactory --> PullsService : instantiates
    ServiceFactory --> IssuesService : instantiates
    ServiceFactory --> CommitsService : instantiates
    ``` 
    