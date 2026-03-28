# Guia de Configuração das APIs

Este documento explica como configurar todas as APIs utilizadas no portfólio para deixá-lo totalmente funcional e dinâmico.

## 📋 Índice

1. [Configuração da API do GitHub](#github-api)
2. [Configuração do EmailJS (Formulário de Contato)](#emailjs)
3. [Configuração da API de Clima (OpenWeatherMap)](#openweathermap)
4. [Testando as Configurações](#testando)
5. [Solução de Problemas](#problemas)

---

## 🔧 Configuração

Todas as configurações de API são feitas em um único arquivo: `js/api-config.js`

### Passo 1: Abra o arquivo de configuração

Edite o arquivo `js/api-config.js` e substitua os valores placeholder pelas suas credenciais reais.

---

## <a name="github-api"></a>1. API do GitHub

A API do GitHub é usada para buscar seus repositórios e exibi-los automaticamente no portfólio.

### Configuração

```javascript
github: {
    username: 'SEU_USUARIO_GITHUB', // Ex: 'Wallace775'
    baseUrl: 'https://api.github.com',
    // ...
}
```

### Limites da API

- **Sem autenticação**: 60 requisições/hora
- **Com token**: 5000 requisições/hora

### Como obter um token (opcional, para maior limite)

1. Acesse https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Dê um nome descritivo (ex: "Portfolio API")
4. Marque a permissão `public_repo`
5. Gere o token e copie
6. No código, adicione no header:
   ```javascript
   headers: {
       'Authorization': 'token SEU_TOKEN_AQUI'
   }
   ```

### Repositórios em Destaque

Para destacar repositórios específicos:

```javascript
featuredRepos: [
    'portfolio',
    'nome-do-projeto'
]
```

Deixe vazio `[]` para mostrar todos os repositórios.

---

## <a name="emailjs"></a>2. EmailJS - Formulário de Contato

O EmailJS permite enviar emails diretamente do front-end sem backend.

### Passo a Passo

#### 1. Crie uma conta

Acesse https://www.emailjs.com/ e crie uma conta gratuita.

#### 2. Crie um Email Service

1. No dashboard, vá em "Email Services"
2. Clique em "Add New Service"
3. Escolha seu provedor de email (Gmail, Outlook, etc.)
4. Conecte sua conta
5. Copie o **Service ID**

#### 3. Crie um Email Template

1. Vá em "Email Templates"
2. Clique em "Create New Template"
3. Use este modelo:

```
Subject: {{subject}}
From: {{from_name}} <{{from_email}}>

Message:
{{message}}

---
Este email foi enviado através do portfólio.
```

4. Salve e copie o **Template ID**

#### 4. Obtenha a Public Key

1. Vá em "Account" (clique no seu nome)
2. Em "API Keys", copie a **Public Key**

#### 5. Configure no projeto

No arquivo `js/api-config.js`:

```javascript
emailjs: {
    publicKey: 'user_XXXXXXXXXXXXXXXXXXXXX',
    serviceId: 'service_XXXXXXXX',
    templateId: 'template_XXXXXXXX'
}
```

### Plano Gratuito

- 200 emails/mês
- Suficiente para portfólio pessoal

---

## <a name="openweathermap"></a>3. OpenWeatherMap - API de Clima

Exibe o clima atual da sua cidade.

### Passo a Passo

#### 1. Crie uma conta

Acesse https://openweathermap.org/ e crie uma conta gratuita.

#### 2. Gere uma API Key

1. Vá em "API keys" no menu
2. Clique em "Create key"
3. Dê um nome (ex: "Portfolio")
4. Copie a chave gerada

#### 3. Configure no projeto

No arquivo `js/api-config.js`:

```javascript
weather: {
    apiKey: 'SUA_API_KEY_AQUI',
    city: 'São Paulo', // Sua cidade
    units: 'metric' // 'metric' para Celsius
}
```

### Plano Gratuito

- 60 chamadas/minuto
- 1,000,000 chamadas/mês
- Mais que suficiente para portfólio

### Dica

A API pode levar até 10 minutos para ativar após criar a chave.

---

## <a name="testando"></a>4. Testando as Configurações

### Teste no Console do Navegador

Abra o console (F12) e execute:

```javascript
// Verificar saúde das APIs
checkAPIHealth().then(console.log);

// Testar GitHub API
githubAPI.getRepositories().then(repos => console.log('Repos:', repos));

// Testar dados dinâmicos
dynamicDataAPI.getWeather().then(weather => console.log('Clima:', weather));
```

### Teste Visual

1. Abra o site no navegador
2. Verifique se:
   - [ ] Os projetos aparecem na seção "Projetos no GitHub"
   - [ ] O widget do GitHub Stats mostra seus dados
   - [ ] O widget do Clima mostra a temperatura
   - [ ] O widget de Cotações mostra USD, EUR, BTC
   - [ ] O widget de Frase mostra uma citação
   - [ ] O formulário de contato envia emails

---

## <a name="problemas"></a>5. Solução de Problemas

### Projetos não carregam

**Problema**: Erro 403 ou 404

**Solução**:
- Verifique se o username está correto
- Aguarde alguns minutos (rate limit)
- Adicione um token de autenticação

### Email não envia

**Problema**: Erro ao enviar formulário

**Solução**:
- Verifique se as 3 chaves do EmailJS estão corretas
- Confirme que o template tem as variáveis corretas
- Verifique o console do navegador para erros

### Clima não aparece

**Problema**: Widget mostra dados mock

**Solução**:
- Verifique se a API key foi copiada corretamente
- Aguarde 10 minutos após criar a chave
- Verifique o nome da cidade (use nomes em inglês se necessário)

### Widgets não carregam

**Problema**: Todos os widgets mostram "Carregando..."

**Solução**:
- Verifique o console para erros
- Confirme que os scripts estão carregados na ordem correta
- Limpe o cache do navegador

---

## 🚀 Dicas de Otimização

### 1. Cache

Os dados são cacheados por 30 minutos por padrão. Para alterar:

```javascript
general: {
    cacheDuration: 60 // minutos
}
```

### 2. Limite de Projetos

Para mostrar mais ou menos projetos:

```javascript
general: {
    projectsLimit: 12 // número de projetos
}
```

### 3. Dados Mock

Se uma API falhar, o sistema usa dados mock automaticamente. Para desativar:

Edite o arquivo da API específica e remova os métodos `getMock*`.

---

## 📞 Suporte

Se tiver problemas:

1. Verifique o console do navegador (F12)
2. Confira se todas as chaves estão corretas
3. Teste as APIs individualmente no console
4. Consulte a documentação oficial de cada API

---

## 🔗 Links Úteis

- [GitHub API Docs](https://docs.github.com/en/rest)
- [EmailJS Docs](https://www.emailjs.com/docs/)
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [Brasil API](https://brasilapi.com.br/)

---

**Importante**: Nunca compartilhe suas chaves de API publicamente. O arquivo `.env` ou variáveis de ambiente são recomendados para produção.
