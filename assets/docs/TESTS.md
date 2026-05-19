# Testes Automatizados do Portfólio

Este documento descreve a suite de testes automatizados implementada para o portfólio de Wallace Phellipe.

## Estrutura de Testes

```
__tests__/
├── api.test.js          # Testes para endpoints da API
├── utils.test.js        # Testes para funções utilitárias
└── utils.js             # Funções utilitárias para testes
```

## Tipos de Testes

### Testes Unitários
- Testam funções individuais
- Verificam lógica de negócios
- Focam em funções utilitárias como validação de e-mail
- Verificam funções de manipulação de dados

### Testes de API
- Testam endpoints do servidor
- Verificam respostas HTTP
- Validam requisições e respostas
- Testam códigos de status e payloads

### Testes de Integração
- Testam fluxos completos
- Verificam interações entre componentes
- Validam fluxos críticos de usuário

## Scripts de Teste

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

## Frameworks Utilizados

- **Jest**: Framework principal de testes
- **Supertest**: Para testar endpoints HTTP

## Cobertura de Testes

- Testes de API para endpoints de contato, estatísticas e usuário
- Testes de funções utilitárias como validação de e-mail
- Testes para verificação de intervalos numéricos
- Testes de formatação de data
- Testes de contagem de palavras
- Testes de busca de palavras-chave

## Melhorias Futuras

- Adicionar testes para funcionalidades do frontend
- Implementar testes de interface (UI)
- Adicionar testes de integração contínua
- Implementar testes de desempenho
- Adicionar testes de segurança

## Execução de Testes

Para executar os testes, certifique-se de ter as dependências instaladas:

```bash
npm install
npm test
```

Para ver o relatório de cobertura:

```bash
npm run test:coverage
```

Os testes são executados em ambiente isolado e não afetam o sistema em produção.