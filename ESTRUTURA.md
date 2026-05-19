# 📋 Estrutura do Projeto - Guia de Referência

## 🗂️ Estrutura de Pastas e Arquivos

### Raiz do Projeto (`/`)

| Arquivo/Diretório | Descrição |
|-------------------|-----------|
| `index.html` | Página principal do portfólio |
| `package.json` | Dependências e scripts do projeto |
| `server.js` | Servidor Node.js com Express |
| `manifest.json` | Manifesto para PWA |
| `sw.js` | Service Worker para funcionalidade offline |
| `.env.example` | Modelo de variáveis de ambiente |
| `.env` | Variáveis de ambiente (não versionado) |
| `.gitignore` | Arquivos ignorados pelo Git |
| `.eslintrc.json` | Configuração do ESLint |
| `.prettierrc` | Configuração do Prettier |
| `jest.config.js` | Configuração do Jest (testes) |
| `README.md` | Este arquivo - visão geral do projeto |

---

### `/assets/` - Recursos Estáticos

#### `/assets/img/` - Imagens

| Arquivo | Descrição |
|---------|-----------|
| `Captura de tela 2025-09-22 105501.png` | Foto de perfil do Wallace |

**Como usar:**
```html
<img src="assets/img/Captura de tela 2025-09-22 105501.png" alt="Foto de perfil">
```

#### `/assets/docs/` - Documentação

| Arquivo | Descrição |
|---------|-----------|
| `API_SETUP.md` | Guia técnico de configuração de APIs |
| `CONFIGURACAO_RAPIDA.md` | Guia rápido de configuração (COMECE AQUI) |
| `CORRECOES_BUGS.md` | Bugs corrigidos e soluções aplicadas |
| `IMPLEMENTACAO.md` | Detalhes da implementação técnica |
| `MODIFICACOES.md` | Resumo de todas as modificações |

---

### `/css/` - Folhas de Estilo

| Arquivo | Descrição |
|---------|-----------|
| `style.css` | CSS principal do projeto (~3300 linhas) |

**Conteúdo:**
- Reset e configurações básicas
- Variáveis CSS para temas (claro/escuro)
- Estilos para todas as seções
- Responsividade (mobile-first)
- Animações e efeitos
- Estilos para widgets e projetos

**Como usar:**
```html
<link rel="stylesheet" href="css/style.css">
```

---

### `/js/` - Módulos JavaScript

#### Módulos de API (Novos)

| Arquivo | Descrição | Linhas |
|---------|-----------|--------|
| `api-config.js` | Configurações de todas as APIs | ~90 |
| `api-integration.js` | Gerenciador principal de integrações | ~250 |
| `github-api.js` | Integração com GitHub API | ~300 |
| `dynamic-data.js` | Dados dinâmicos (clima, moedas, frases) | ~640 |
| `contact-api.js` | Envio de emails (EmailJS) | ~300 |

#### Módulos Principais

| Arquivo | Descrição |
|---------|-----------|
| `utils.js` | Funções utilitárias gerais |
| `theme.js` | Gerenciamento de tema claro/escuro |
| `navigation.js` | Menu mobile e navegação suave |
| `form-validator.js` | Validação de formulários |
| `contact-form.js` | Gerenciamento do formulário de contato |
| `search.js` | Sistema de busca |
| `animations.js` | Animações e efeitos visuais |
| `i18n.js` | Internacionalização (português/inglês) |

#### Módulos Secundários

| Arquivo | Descrição |
|---------|-----------|
| `portfolio.js` | Lógica específica do portfólio |
| `blog.js` | Funcionalidades do blog |
| `testimonials.js` | Depoimentos |
| `github.js` | Integrações adicionais com GitHub |
| `game.js` | Jogos/easter eggs |
| `notifications.js` | Sistema de notificações |

**Como usar:**
```html
<!-- Ordem importa! api-config deve vir primeiro -->
<script src="js/api-config.js"></script>
<script src="js/github-api.js"></script>
<script src="js/dynamic-data.js"></script>
<!-- ... outros scripts ... -->
```

---

### `/__tests__/` - Testes Automatizados

| Arquivo | Descrição |
|---------|-----------|
| `api.test.js` | Testes das integrações com APIs |
| `utils.test.js` | Testes das funções utilitárias |

**Como rodar:**
```bash
npm test
npm run test:coverage  # Com relatório de cobertura
```

---

### `/.github/` - Configurações do GitHub

#### `/.github/workflows/`

| Arquivo | Descrição |
|---------|-----------|
| `nextjs.yml` | Workflow de CI/CD (se aplicável) |

---

## 🔗 Caminhos e Referências

### Caminhos Relativos Comuns

```javascript
// HTML → CSS
<link rel="stylesheet" href="css/style.css">

// HTML → JavaScript
<script src="js/api-config.js"></script>

// HTML → Imagens
<img src="assets/img/Captura de tela 2025-09-22 105501.png">

// HTML → Manifesto
<link rel="manifest" href="manifest.json">

// JavaScript → Importação de módulos
// (se usando ES6 modules)
import { API_CONFIG } from './api-config.js';
```

### Caminhos no Servidor (server.js)

```javascript
// Servir arquivos estáticos
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
```

### Caminhos no Service Worker (sw.js)

```javascript
const urlsToCache = [
    'index.html',
    'css/style.css',
    'js/api-config.js',
    'assets/img/Captura de tela 2025-09-22 105501.png',
    'manifest.json'
];
```

---

## 📊 Organização por Camadas

```
┌─────────────────────────────────────────┐
│          Apresentação (HTML/CSS)        │
│  index.html, css/style.css              │
├─────────────────────────────────────────┤
│          Lógica (JavaScript)            │
│  js/*.js (todos os módulos)             │
├─────────────────────────────────────────┤
│          Dados (APIs/Backend)           │
│  APIs externas, server.js               │
├─────────────────────────────────────────┤
│          Recursos (Assets)              │
│  assets/img/, assets/docs/              │
└─────────────────────────────────────────┘
```

---

## 🎯 Arquivos Principais por Funcionalidade

### Projetos GitHub
- `js/github-api.js`
- `js/api-config.js`
- `index.html` (seção #projetos)

### Widgets Dinâmicos
- `js/dynamic-data.js`
- `index.html` (seção #widgets)

### Formulário de Contato
- `js/contact-api.js`
- `js/contact-form.js`
- `js/form-validator.js`
- `index.html` (seção #contato)
- `server.js` (backend de email)

### Tema Claro/Escuro
- `js/theme.js`
- `css/style.css` (variáveis CSS)

### Navegação
- `js/navigation.js`
- `index.html` (header/nav)

### Busca
- `js/search.js`
- `index.html` (search-box)

### Internacionalização
- `js/i18n.js`
- `index.html` (atributos data-i18n)

---

## 🔍 Checklist de Verificação

Antes de fazer deploy, verifique:

- [ ] Todos os caminhos de CSS estão como `css/style.css`
- [ ] Todos os caminhos de JS estão como `js/nome-arquivo.js`
- [ ] Imagens estão em `assets/img/`
- [ ] Links no HTML usam caminhos relativos corretos
- [ ] `manifest.json` tem caminhos corretos para ícones
- [ ] `sw.js` tem caminhos corretos para cache
- [ ] `server.js` serve todas as pastas estáticas

---

## 🚨 Problemas Comuns e Soluções

### Imagem não carrega
**Problema:** Caminho incorreto
**Solução:** Verifique se está usando `assets/img/nome-arquivo.png`

### CSS não aplica
**Problema:** Link quebrado no HTML
**Solução:** Use `<link rel="stylesheet" href="css/style.css">`

### JavaScript não executa
**Problema:** Scripts carregados na ordem errada
**Solução:** `api-config.js` deve vir antes dos outros módulos de API

### Service Worker não funciona
**Problema:** Caminhos no sw.js incorretos
**Solução:** Atualize `urlsToCache` com caminhos corretos

---

## 📝 Notas de Manutenção

### Ao Adicionar Novo Arquivo

1. **CSS:** Coloque em `/css/` e atualize o HTML
2. **JS:** Coloque em `/js/` e adicione ao HTML
3. **Imagens:** Coloque em `/assets/img/`
4. **Docs:** Coloque em `/assets/docs/`

### Ao Remover Arquivos

1. Atualize todas as referências no código
2. Atualize o Service Worker
3. Atualize a documentação

### Ao Modificar Caminhos

1. Atualize HTML
2. Atualize CSS/JS
3. Atualize manifest.json
4. Atualize sw.js
5. Atualize server.js
6. Teste localmente antes de fazer deploy

---

**Última atualização:** 28 de março de 2026
**Versão da estrutura:** 2.0.0
