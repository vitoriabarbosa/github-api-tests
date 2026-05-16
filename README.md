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
