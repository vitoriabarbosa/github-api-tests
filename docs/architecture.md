# Arquitetura do Framework

## Estrutura do Projeto

```txt
github-api-tests/
│
├── core/                        ← Core Layer: motor 
│   ├── apiClient.js
│   ├── assertions.js
│   └── schemaValidator.js
│
├── services/                    ← Service Layer: módulos por domínio
│   ├── commitsService.js
│   ├── issuesService.js
│   ├── pullsService.js
│   ├── reposService.js
│   └── usersService.js
│
├── schemas/                     ← Contratos JSON Schema por entidade
│   ├── commits.schema.js
│   ├── issues.schema.js
│   ├── pulls.schema.js
│   ├── repos.schema.js
│   └── users.schema.js
│
├── tests/                       ← Test Layer: specs Playwright
│   ├── commits.spec.js
│   ├── filters.spec.js
│   ├── issues.spec.js
│   ├── pulls.spec.js
│   ├── repos.spec.js
│   └── users.spec.js
│
├── fixtures/                    ← Support Layer: dados de teste
│   └── testData.js
│
├── utils/                       ← Support Layer: infraestrutura
│   ├── config.js
│   └── logger.js
│
├── docs/                        ← Documentação e diagramas
│   └── architecture.md
│
├── playwright.config.js
└── package.json
```

---

## 1. C1 - Contexto do Sistema

![alt text](image-1.png)

---

## 2. C2 - Containers (Camadas)

![alt text](image.png)

---

## 3. Fluxo de uma Requisição

```mermaid
sequenceDiagram
    participant T as Test Spec
    participant S as Service Module
    participant C as ApiClient
    participant V as SchemaValidator
    participant A as Assertions
    participant G as GitHub API

    T->>S: getUser(username)
    S->>C: get(/users/username)
    C->>G: HTTP GET
    G-->>C: response
    C-->>S: response
    S->>V: validate(response, schema)
    V-->>S: valid / invalid
    S-->>T: result
    T->>A: assertOwnership()
    T->>A: assertStatusAndBody()
```

---

## 4. Princípios da Arquitetura

```mermaid
mindmap
  root((Framework))
    Modularidade
      Cada domínio isolado
      Fácil adicionar endpoints
    Reusabilidade
      Core independente de domínio
      Assertions compartilhadas
    Manutenibilidade
      Schemas centralizados
      TestData centralizado
    Escalabilidade
      Novos módulos sem impacto
      Multi-ambiente via Config
```
