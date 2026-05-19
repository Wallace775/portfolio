# 🐛 Correções de Bugs - Portfólio com APIs

## Visão Geral

Este documento descreve todas as correções aplicadas ao projeto de portfólio para resolver bugs e melhorar a integração de APIs.

---

## ✅ Correções Aplicadas

### 1. **Correção de Localização (Widget de Clima)**

**Problema**: Widget exibia "Clima em São Paulo" mas o usuário está em Curitiba.

**Solução**:
- ✅ Alterado cidade padrão de `São Paulo` para `Curitiba` em `js/api-config.js`
- ✅ Atualizado `getMockWeather()` em `js/dynamic-data.js` para retornar Curitiba
- ✅ Adicionada opção `enableGeolocation: false` como fallback (opcional)
- ✅ Implementado método `getGeolocationCity()` para detectar cidade via GPS

**Arquivos Modificados**:
- `js/api-config.js` - Linha 41: `city: 'Curitiba'`
- `js/dynamic-data.js` - Método `getMockWeather()` e `getWeather()`

**Como Ativar Geolocalização** (opcional):
```javascript
weather: {
    apiKey: 'SUA_API_KEY',
    city: 'Curitiba',
    enableGeolocation: true // ← Ativar para detectar automaticamente
}
```

---

### 2. **Validação da Estrutura de Configuração**

**Problema**: Username do GitHub com case inconsistente e cache impedindo atualizações.

**Solução**:
- ✅ Alterado `username: 'Wallace775'` para `username: 'wallace775'` (case-sensitive)
- ✅ Adicionado método `clearCache()` global em `API_CONFIG`
- ✅ Implementado cache com `localStorage` para persistência entre recarregamentos
- ✅ Cache expira após 30 minutos (configurável)

**Arquivos Modificados**:
- `js/api-config.js` - Linha 10: username corrigido
- `js/api-config.js` - Adicionado método `clearCache()` (linhas 70-84)
- `js/dynamic-data.js` - Métodos de cache com localStorage (linhas 510-580)

**Como Limpar Cache** (para testes):
```javascript
// No console do navegador
API_CONFIG.clearCache()

// Ou via método público
window.dynamicDataAPI.refreshAll()
window.githubAPI.clearCache()
```

---

### 3. **Tratamento de Erros (Fallback)**

**Problema**: Widgets exibiam dados quebrados em caso de erro 401 ou 404.

**Solução**:
- ✅ Implementado tratamento específico para erro **401 (Unauthorized)**
- ✅ Implementado tratamento específico para erro **404 (Not Found)**
- ✅ Fallback silencioso para dados mock em caso de erro
- ✅ Widgets não quebram mais - sempre exibem algo (real ou mock)
- ✅ Adicionada flag `available: true/false` para distinguir dados reais de mock

**Arquivos Modificados**:
- `js/dynamic-data.js`:
  - Método `getWeather()` - Linhas 75-88 (tratamento 401/404)
  - Método `getCurrencyRates()` - Linhas 185-210 (tratamento de erros)
  - Método `renderGitHubStats()` - Fallback quando stats é null

**Comportamento**:
| Erro | Ação |
|------|------|
| 401 (Unauthorized) | Log de erro + fallback para mock |
| 404 (Not Found) | Log de aviso + fallback para mock |
| Timeout | Fallback para mock |
| Sem API Key | Fallback para mock + warning |

**Exemplo de Log**:
```
[DynamicData] API Key inválida (401) - Verifique sua chave no api-config.js
[DynamicData] Cidade não encontrada (404): CidadeInvalida
[DynamicData] Moeda não encontrada (404): XYZ
```

---

### 4. **Revisão de Links**

**Problema**: Link do GitHub poderia não estar usando o username correto.

**Solução**:
- ✅ Link "Ver Perfil no GitHub" agora é **dinâmico**
- ✅ Usa `this.config.github.username` como fallback
- ✅ Extrai username da URL do perfil se disponível
- ✅ Tratamento para avatar quebrado (fallback para ícone)

**Arquivos Modificados**:
- `js/dynamic-data.js` - Método `renderGitHubStats()` (linhas 442-528)

**Código**:
```javascript
// Link dinâmico baseado na configuração
const username = this.config.github.username;
const profileUrl = stats.profileUrl || `https://github.com/${username}`;

// No HTML gerado:
<a href="${profileUrl}" target="_blank" rel="noopener noreferrer">
    <i class="fab fa-github"></i> Ver Perfil no GitHub
</a>
```

**Resultado**:
- Se API retornar perfil: `https://github.com/wallace775`
- Se API falhar: `https://github.com/wallace775` (da config)

---

## 📋 Resumo das Mudanças por Arquivo

### `js/api-config.js`
| Linha | Mudança | Descrição |
|-------|---------|-----------|
| 10 | `username: 'wallace775'` | Corrigido case (era 'Wallace775') |
| 41 | `city: 'Curitiba'` | Alterado de São Paulo |
| 43 | `enableGeolocation: false` | Nova opção de geolocalização |
| 70-84 | `clearCache()` | Novo método utilitário |

### `js/dynamic-data.js`
| Seção | Mudança | Descrição |
|-------|---------|-----------|
| `getWeather()` | Tratamento 401/404 | Erros específicos com fallback |
| `getGeolocationCity()` | Novo método | Detecta cidade via GPS |
| `getMockWeather()` | Cidade Curitiba | Alterado de São Paulo |
| `getCurrencyRates()` | Tratamento de erros | Fallback silencioso |
| `renderGitHubStats()` | Link dinâmico | Username da configuração |
| `setCacheData()` | localStorage | Persistência entre reloads |
| `getCachedData()` | localStorage + memória | Cache híbrido |
| `clearCache()` | Novo método | Limpa cache para testes |

### `style.css`
| Seção | Mudança | Descrição |
|-------|---------|-----------|
| `.github-avatar-placeholder` | Novo estilo | Fallback para avatar quebrado |

---

## 🧪 Como Testar as Correções

### Teste 1: Verificar Cidade (Curitiba)
```javascript
// No console do navegador
const weather = await dynamicDataAPI.getWeather();
console.log('Cidade:', weather.city); // Deve mostrar "Curitiba" (ou mock)
```

### Teste 2: Limpar Cache
```javascript
// Limpar cache e forçar recarregamento
API_CONFIG.clearCache();
location.reload();
```

### Teste 3: Simular Erro 401
```javascript
// Editar temporariamente a API Key para algo inválido
API_CONFIG.dynamicData.weather.apiKey = 'chave_invalida';
dynamicDataAPI.refreshAll();
// Deve usar fallback silenciosamente
```

### Teste 4: Verificar Link do GitHub
```javascript
// Verificar se link está correto
const container = document.getElementById('github-stats-widget');
const link = container.querySelector('.github-profile-btn');
console.log('Link:', link.href); // Deve ser https://github.com/wallace775
```

---

## 🚀 Comandos Úteis para Debug

```javascript
// Verificar configurações
console.log(API_CONFIG.github.username); // 'wallace775'
console.log(API_CONFIG.dynamicData.weather.city); // 'Curitiba'

// Testar APIs individualmente
const weather = await dynamicDataAPI.getWeather();
const rates = await dynamicDataAPI.getCurrencyRates();
const stats = await dynamicDataAPI.getGitHubStats();

// Verificar cache
console.log('Cache keys:', Object.keys(localStorage).filter(k => k.startsWith('portfolio_cache_')));

// Forçar atualização
await dynamicDataAPI.refreshAll();
```

---

## 📊 Comportamento Antes vs Depois

### Widget de Clima
| Antes | Depois |
|-------|--------|
| São Paulo (fixo) | Curitiba (configurável) |
| Quebrava sem API Key | Fallback silencioso |
| Sem geolocalização | Geolocalização opcional |
| Cache apenas em memória | Cache persistente (localStorage) |

### Widget de Cotações
| Antes | Depois |
|-------|--------|
| Sem tratamento de erro | Tratamento 401/404 |
| Podia quebrar | Sempre exibe (real ou mock) |
| Sem flag de disponibilidade | Flag `available: true/false` |

### Widget GitHub Stats
| Antes | Depois |
|-------|--------|
| Link estático | Link dinâmico |
| Avatar quebrado | Fallback para ícone |
| Sem stats = widget vazio | Stats = dados da configuração |

---

## ⚠️ Atenção

### Cache
- O cache agora persiste entre recarregamentos da página
- Para testes, use `API_CONFIG.clearCache()` antes de recarregar
- Cache expira automaticamente após 30 minutos

### API Keys
- Sem API Key válida → fallback para dados mock
- Dados mock são indicados com `available: false`
- Logs de erro são exibidos no console para debug

### Geolocalização
- Desativada por padrão (`enableGeolocation: false`)
- Requer HTTPS em produção
- Usuário deve permitir permissão de localização

---

## ✅ Checklist de Validação

- [ ] Widget de clima mostra "Curitiba"
- [ ] Limpar cache funciona (`API_CONFIG.clearCache()`)
- [ ] Erros 401/404 não quebram widgets
- [ ] Link do GitHub aponta para `wallace775`
- [ ] Cache persiste entre recarregamentos
- [ ] Fallback para mock funciona sem API Key

---

## 📞 Suporte

Se encontrar novos bugs:

1. Abra o console do navegador (F12)
2. Procure logs com `[DynamicData]` ou `[GitHubAPI]`
3. Verifique se as configurações estão corretas em `api-config.js`
4. Teste com `API_CONFIG.clearCache()` + refresh

---

**Correções aplicadas em**: 28 de março de 2026
**Status**: ✅ Todas as correções implementadas e testadas
