/**
 * GitHub API Module
 * 
 * Responsável por buscar dados do GitHub (repositórios, perfil, atividades)
 * e exibir na seção de projetos do portfólio.
 */

class GitHubAPI {
    constructor(config) {
        this.config = config;
        this.username = config.github.username;
        this.baseUrl = config.github.baseUrl;
        this.cache = new Map();
        this.cacheExpiry = config.general.cacheDuration * 60 * 1000; // Converter para ms
    }

    /**
     * Método auxiliar para fazer requisições à API
     */
    async fetch(endpoint, params = {}) {
        const url = new URL(this.baseUrl + endpoint);
        
        // Adicionar parâmetros à URL
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        const cacheKey = url.toString();

        // Verificar cache
        const cachedData = this.getCachedData(cacheKey);
        if (cachedData) {
            console.log('[GitHubAPI] Dados retornados do cache:', cacheKey);
            return cachedData;
        }

        try {
            console.log('[GitHubAPI] Buscando dados:', url.toString());
            
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    // 'Authorization': 'token SEU_TOKEN_AQUI' // Opcional: aumenta rate limit
                }
            });

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('Rate limit excedido. Tente novamente em alguns minutos.');
                }
                throw new Error(`Erro na API: ${response.status}`);
            }

            const data = await response.json();
            
            // Salvar no cache
            this.setCacheData(cacheKey, data);
            
            return data;
        } catch (error) {
            console.error('[GitHubAPI] Erro:', error.message);
            throw error;
        }
    }

    /**
     * Buscar perfil do usuário
     */
    async getUserProfile() {
        const endpoint = this.config.github.endpoints.user.replace('{username}', this.username);
        return await this.fetch(endpoint);
    }

    /**
     * Buscar repositórios do usuário
     */
    async getRepositories(sort = 'updated', limit = null) {
        const endpoint = this.config.github.endpoints.repos.replace('{username}', this.username);
        const repos = await this.fetch(endpoint, {
            sort: sort,
            direction: 'desc',
            per_page: limit || this.config.general.projectsLimit
        });

        // Filtrar repositórios que são forks (opcional)
        return repos.filter(repo => !repo.fork);
    }

    /**
     * Buscar repositórios em destaque
     */
    async getFeaturedRepositories() {
        const featured = this.config.github.featuredRepos;
        
        if (!featured || featured.length === 0) {
            // Se não houver repositórios destacados, retorna os mais recentes
            return await this.getRepositories();
        }

        const allRepos = await this.getRepositories(null, 100);
        
        // Filtrar apenas os repositórios destacados
        return allRepos.filter(repo => 
            featured.includes(repo.name) || featured.includes(repo.id.toString())
        );
    }

    /**
     * Buscar atividades recentes
     */
    async getRecentActivities(limit = 10) {
        const endpoint = this.config.github.endpoints.events.replace('{username}', this.username);
        return await this.fetch(endpoint, { per_page: limit });
    }

    /**
     * Formatando dados do repositório para exibição
     */
    formatRepositoryData(repo) {
        return {
            id: repo.id,
            name: repo.name,
            description: repo.description || 'Sem descrição disponível',
            language: repo.language || 'Não especificado',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updatedAt: new Date(repo.updated_at).toLocaleDateString('pt-BR'),
            htmlUrl: repo.html_url,
            homepage: repo.homepage,
            topics: repo.topics || [],
            hasIssues: repo.open_issues_count > 0,
            issuesCount: repo.open_issues_count
        };
    }

    /**
     * Formatando atividades para exibição
     */
    formatActivityData(event) {
        const typeMap = {
            'PushEvent': 'Push',
            'CreateEvent': 'Criou',
            'WatchEvent': 'Deu star em',
            'ForkEvent': 'Forkou',
            'IssueCommentEvent': 'Comentou em issue',
            'IssuesEvent': 'Issue'
        };

        return {
            type: typeMap[event.type] || event.type,
            repo: event.repo.name,
            createdAt: new Date(event.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    }

    /**
     * Renderizar cards de projetos no HTML
     */
    renderProjects(containerId, projects) {
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`[GitHubAPI] Container #${containerId} não encontrado`);
            return;
        }

        if (!projects || projects.length === 0) {
            container.innerHTML = `
                <div class="projects-empty">
                    <i class="fas fa-folder-open"></i>
                    <p>Nenhum projeto encontrado</p>
                </div>
            `;
            return;
        }

        const html = projects.map((project, index) => {
            const formatted = this.formatRepositoryData(project);
            
            return `
                <article class="project-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="project-header">
                        <i class="fab fa-github project-icon"></i>
                        <h3 class="project-title">${formatted.name}</h3>
                    </div>
                    
                    <p class="project-description">${formatted.description}</p>
                    
                    <div class="project-meta">
                        ${formatted.language ? `
                            <span class="project-language">
                                <i class="fas fa-code"></i> ${formatted.language}
                            </span>
                        ` : ''}
                        
                        ${formatted.stars > 0 ? `
                            <span class="project-stars" title="${formatted.stars} estrelas">
                                <i class="fas fa-star"></i> ${formatted.stars}
                            </span>
                        ` : ''}
                        
                        ${formatted.forks > 0 ? `
                            <span class="project-forks" title="${formatted.forks} forks">
                                <i class="fas fa-code-branch"></i> ${formatted.forks}
                            </span>
                        ` : ''}
                    </div>
                    
                    ${formatted.topics.length > 0 ? `
                        <div class="project-topics">
                            ${formatted.topics.slice(0, 5).map(topic => 
                                `<span class="topic-tag">${topic}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="project-links">
                        <a href="${formatted.htmlUrl}" target="_blank" rel="noopener noreferrer" class="btn-project" aria-label="Ver código no GitHub">
                            <i class="fab fa-github"></i> Código
                        </a>
                        ${formatted.homepage ? `
                            <a href="${formatted.homepage}" target="_blank" rel="noopener noreferrer" class="btn-project btn-secondary" aria-label="Ver demonstração">
                                <i class="fas fa-external-link-alt"></i> Demo
                            </a>
                        ` : ''}
                    </div>
                    
                    <div class="project-footer">
                        <small class="project-updated">
                            <i class="fas fa-clock"></i> Atualizado em ${formatted.updatedAt}
                        </small>
                    </div>
                </article>
            `;
        }).join('');

        container.innerHTML = html;
        
        // Disparar evento de que os projetos foram renderizados
        window.dispatchEvent(new CustomEvent('projectsLoaded', { 
            detail: { count: projects.length } 
        }));
    }

    /**
     * Renderizar atividades recentes
     */
    renderActivities(containerId, activities) {
        const container = document.getElementById(containerId);
        
        if (!container) return;

        if (!activities || activities.length === 0) {
            container.innerHTML = '<p>Nenhuma atividade recente</p>';
            return;
        }

        const html = activities.map(activity => {
            const formatted = this.formatActivityData(activity);
            
            return `
                <li class="activity-item">
                    <i class="fas fa-circle activity-icon"></i>
                    <div class="activity-content">
                        <span class="activity-type">${formatted.type}</span>
                        <span class="activity-repo">${formatted.repo}</span>
                        <small class="activity-time">${formatted.createdAt}</small>
                    </div>
                </li>
            `;
        }).join('');

        container.innerHTML = `<ul class="activity-list">${html}</ul>`;
    }

    /**
     * Métodos de Cache
     */
    setCacheData(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    getCachedData(key) {
        const cached = this.cache.get(key);
        
        if (!cached) return null;
        
        // Verificar se o cache expirou
        if (Date.now() - cached.timestamp > this.cacheExpiry) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    clearCache() {
        this.cache.clear();
    }
}

// Instanciar e exportar
const githubAPI = new GitHubAPI(API_CONFIG);
window.githubAPI = githubAPI;
