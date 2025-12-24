# Sistema de Busca do Portfólio

Este documento descreve o sistema de busca implementado no portfólio de Wallace Phellipe.

## Funcionalidades

- Busca em tempo real por projetos, posts de blog, habilidades e experiências
- Destaque de termos pesquisados nos resultados
- Interface intuitiva com sugestões de busca
- Navegação direta para itens encontrados
- Filtro por categorias de conteúdo
- Implementação otimizada com debounce para melhor performance

## Estrutura de Arquivos

```
index.html    # Adição do HTML para a interface de busca
style.css     # Estilos para o sistema de busca
script.js     # Implementação da lógica de busca
```

## Funcionalidades Principais

### 1. Busca em Tempo Real

O sistema busca automaticamente enquanto o usuário digita, com um delay de 300ms para evitar chamadas excessivas.

### 2. Destaque de Termos

Termos pesquisados são destacados nos resultados com uma marcação visual para facilitar a identificação.

### 3. Resultados Categorizados

Os resultados são categorizados por tipo de conteúdo:
- Projetos do portfólio
- Posts do blog
- Habilidades
- Experiências profissionais
- Formação acadêmica
- Cursos

### 4. Navegação Direta

Clicar em um resultado leva diretamente para a seção correspondente da página.

## Implementação Técnica

### Classes e Funções

A busca é implementada através da classe `SearchSystem` que contém:

- `initializeSearchData()` - Coleta dados de todas as seções para busca
- `extract[Segção]Data()` - Métodos para extrair dados específicos de cada seção
- `performSearch(query)` - Realiza a busca com base na consulta
- `displayResults(results, query)` - Exibe os resultados de busca
- `setupSearchEvents()` - Configura eventos de busca
- `highlightText(text, query)` - Destaca termos encontrados

### Estratégia de Indexação

O sistema coleta dados de:

- Títulos e descrições dos projetos do portfólio
- Títulos e conteúdos dos posts do blog
- Nomes e descrições das habilidades
- Títulos e detalhes das experiências profissionais
- Títulos e descrições da formação acadêmica
- Títulos e informações dos cursos

### Otimizações

- Uso de debounce para controlar a frequência das buscas
- Limitação do número de resultados exibidos (10 por padrão)
- Filtragem eficiente com métodos de array JavaScript
- Destaque de termos com expressões regulares

## Personalização

O sistema pode ser extendido para:

- Adicionar novas categorias de busca
- Incluir dados de APIs externas
- Implementar busca avançada com filtros
- Adicionar suporte para busca textual completo
- Implementar armazenamento de histórico de busca

## Melhorias Futuras

- Integração com mecanismo de busca externo
- Busca textual completo nos conteúdos
- Histórico de buscas recentes
- Sugestões de busca baseadas em termos populares
- Busca avançada com múltiplos critérios