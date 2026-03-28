# ⚡ Configuração Rápida do Portfólio

Siga estes passos para ativar todas as funcionalidades do seu portfólio.

---

## 🚀 Passo 1: GitHub API (Obrigatório)

Esta é a API mais importante - exibe seus projetos automaticamente.

### Configuração

1. Abra o arquivo `js/api-config.js`

2. Encontre esta seção:
```javascript
github: {
    username: 'Wallace775', // ← SEU usuário do GitHub
    // ...
}
```

3. Substitua `Wallace775` pelo seu usuário do GitHub

**Pronto!** A API do GitHub funciona sem configuração adicional.

### Opcional: Token para Maior Limite

Se quiser mais requisições (5000/hora em vez de 60/hora):

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Nome: "Portfolio"
4. Marque: `public_repo`
5. Gere e copie o token
6. No arquivo `js/github-api.js`, adicione no fetch:
```javascript
headers: {
    'Authorization': 'token ghp_SEU_TOKEN_AQUI'
}
```

---

## 📧 Passo 2: EmailJS (Recomendado)

Para o formulário de contato funcionar.

### Configuração Rápida

1. **Crie uma conta**: https://www.emailjs.com/ (grátis)

2. **Adicione Email Service**:
   - Dashboard → Email Services → Add New Service
   - Escolha Gmail ou outro
   - Conecte sua conta
   - Copie o **Service ID**

3. **Crie Email Template**:
   - Email Templates → Create New Template
   - Use este modelo:
   ```
   Subject: {{subject}}
   From: {{from_name}} <{{from_email}}>
   
   Mensagem:
   {{message}}
   
   ---
   Enviado via portfólio.
   ```
   - Salve e copie o **Template ID**

4. **Pegue a Public Key**:
   - Account (seu nome) → API Keys
   - Copie a **Public Key**

5. **Configure no projeto**:
   Abra `js/api-config.js` e substitua:
```javascript
emailjs: {
    publicKey: 'user_XXXXXXXXXXXXXXXXXXXXX', // ← Sua chave
    serviceId: 'service_XXXXXXXX',           // ← Seu service
    templateId: 'template_XXXXXXXX'          // ← Seu template
}
```

**Pronto!** O formulário agora envia emails.

---

## 🌤️ Passo 3: Clima (Opcional)

Para exibir o clima da sua cidade.

### Configuração

1. **Crie uma conta**: https://openweathermap.org/ (grátis)

2. **Gere API Key**:
   - API keys → Create key
   - Nome: "Portfolio"
   - Copie a chave

3. **Configure no projeto**:
   Abra `js/api-config.js`:
```javascript
weather: {
    apiKey: 'SUA_API_KEY_AQUI',    // ← Sua chave
    city: 'São Paulo',             // ← Sua cidade
    units: 'metric'                // Celsius
}
```

**Atenção**: A API pode levar 10 minutos para ativar.

---

## ✅ Passo 4: Testar

### No Navegador

1. Abra o site: `http://localhost:3000` (ou onde estiver rodando)

2. Verifique:
   - [ ] Seção "Projetos no GitHub" mostra seus repositórios
   - [ ] Widget "GitHub Stats" mostra seu perfil
   - [ ] Widget "Clima" mostra temperatura (se configurou)
   - [ ] Widget "Cotações" mostra USD, EUR, BTC
   - [ ] Widget "Frase" mostra citação aleatória

### No Console (F12)

Execute:
```javascript
checkAPIHealth()
```

Deve mostrar:
```javascript
{
  github: true,
  weather: true ou "not_configured",
  currency: true,
  quotes: true
}
```

---

## 🐛 Problemas Comuns

### Projetos não carregam

**Erro 403**: Rate limit excedido
- **Solução**: Aguarde alguns minutos ou adicione token

**Erro 404**: Usuário não encontrado
- **Solução**: Verifique se o username está correto em `api-config.js`

### Email não envia

**Erro no console**:
- Verifique se as 3 chaves do EmailJS estão corretas
- Confira se o template tem as variáveis: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`

### Clima não aparece

**Dados fixos (mock)**:
- A API key pode não estar ativada ainda (aguarde 10 min)
- Verifique se o nome da cidade está correto
- Use nomes em inglês para cidades internacionais

---

## 📱 Testar no Celular

1. Faça deploy no GitHub Pages ou Vercel
2. Acesse a URL no celular
3. Teste:
   - Menu mobile
   - Toque nos cards
   - Formulário de contato
   - Rolagem da página

---

## 🎯 Checklist Final

Antes de publicar:

- [ ] GitHub username configurado
- [ ] Projetos aparecem na seção "Projetos"
- [ ] EmailJS configurado (se quiser formulário funcional)
- [ ] Testou formulário de contato
- [ ] Verificou no console se não há erros
- [ ] Testou no celular (responsivo)
- [ ] Removeu dados sensíveis do código
- [ ] Fez build/testes locais

---

## 🚀 Deploy

### GitHub Pages

1. `git add .`
2. `git commit -m "Configura APIs do portfólio"`
3. `git push`
4. Settings → Pages → Escolha branch main/master
5. Aguarde alguns minutos
6. Acesse: `https://SEU_USUARIO.github.io/portfolio`

### Vercel/Netlify

1. Conecte seu repositório GitHub
2. Deploy automático
3. URL: `seu-portfolio.vercel.app`

---

## 📞 Debug

### Console Commands

```javascript
// Verificar APIs
checkAPIHealth()

// Testar GitHub
githubAPI.getRepositories().then(r => console.log(r.length))

// Testar EmailJS
contactForm.emailjsLoaded

// Limpar cache
githubAPI.clearCache()

// Recarregar tudo
refreshPortfolioData()
```

---

## ✨ Dica Final

**Não precisa configurar tudo de uma vez!**

Comece com:
1. ✅ GitHub API (obrigatório) - Mostra seus projetos
2. ✅ EmailJS (recomendado) - Formulário funciona
3. ⏳ Clima (opcional) - Widget extra

O resto já funciona com dados mock (fictícios) se não configurar.

---

**Pronto! Seu portfólio está profissional e dinâmico! 🎉**

Boa sorte na busca pela vaga de Dev Jr! 🚀
