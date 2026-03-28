/**
 * API Integration Manager
 * 
 * Módulo principal que gerencia todas as integrações com APIs
 * e inicializa os componentes dinâmicos do portfólio.
 */

class APIIntegrationManager {
    constructor() {
        this.initialized = false;
        this.loadingElements = {};
    }

    /**
     * Inicializar todas as integrações
     */
    init() {
        if (this.initialized) {
            console.log('[APIManager] Já inicializado');
            return;
        }

        console.log('[APIManager] Inicializando integrações...');

        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadAll());
        } else {
            this.loadAll();
        }

        this.initialized = true;
    }

    /**
     * Carregar todos os componentes
     */
    async loadAll() {
        console.log('[APIManager] Carregando todos os componentes...');

        // Mostrar estados de loading
        this.showLoadingStates();

        // Carregar em paralelo para melhor performance
        try {
            await Promise.allSettled([
                this.loadProjects(),
                this.loadWidgets(),
                this.updateNavigation()
            ]);
        } catch (error) {
            console.error('[APIManager] Erro ao carregar componentes:', error);
        }

        // Configurar evento de retry
        this.setupRetryButton();
    }

    /**
     * Mostrar estados de loading
     */
    showLoadingStates() {
        // Projetos
        const projectsLoading = document.getElementById('projects-loading');
        const projectsContainer = document.getElementById('projects-container');
        const projectsError = document.getElementById('projects-error');

        if (projectsLoading) projectsLoading.style.display = 'block';
        if (projectsContainer) projectsContainer.innerHTML = '';
        if (projectsError) projectsError.style.display = 'none';

        // Widgets - mostrar loading skeleton
        this.showWidgetsLoading();
    }

    /**
     * Mostrar loading skeleton para widgets
     */
    showWidgetsLoading() {
        const widgetIds = ['github-stats-widget', 'weather-widget', 'currency-widget', 'quote-widget'];
        
        widgetIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = `
                    <div class="widget-loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Carregando...</p>
                    </div>
                `;
            }
        });
    }

    /**
     * Carregar projetos do GitHub
     */
    async loadProjects() {
        console.log('[APIManager] Carregando projetos...');

        try {
            if (!window.githubAPI) {
                throw new Error('GitHub API não disponível');
            }

            const repos = await window.githubAPI.getRepositories();
            
            // Esconder loading
            const loadingElement = document.getElementById('projects-loading');
            if (loadingElement) loadingElement.style.display = 'none';

            // Renderizar projetos
            window.githubAPI.renderProjects('projects-container', repos);

            console.log('[APIManager] Projetos carregados com sucesso:', repos.length);
        } catch (error) {
            console.error('[APIManager] Erro ao carregar projetos:', error);
            this.showProjectsError();
        }
    }

    /**
     * Mostrar erro no carregamento de projetos
     */
    showProjectsError() {
        const loadingElement = document.getElementById('projects-loading');
        const errorElement = document.getElementById('projects-error');
        const container = document.getElementById('projects-container');

        if (loadingElement) loadingElement.style.display = 'none';
        if (errorElement) errorElement.style.display = 'block';
        if (container) container.innerHTML = '';
    }

    /**
     * Carregar widgets dinâmicos
     */
    async loadWidgets() {
        console.log('[APIManager] Carregando widgets...');

        try {
            if (!window.dynamicDataAPI) {
                throw new Error('Dynamic Data API não disponível');
            }

            await window.dynamicDataAPI.loadAllWidgets();
            console.log('[APIManager] Widgets carregados com sucesso');
        } catch (error) {
            console.error('[APIManager] Erro ao carregar widgets:', error);
        }
    }

    /**
     * Atualizar navegação para incluir link de projetos
     */
    updateNavigation() {
        console.log('[APIManager] Atualizando navegação...');
        
        // A navegação já foi atualizada no HTML
        // Este método é mantido para futuras atualizações
    }

    /**
     * Configurar botão de retry
     */
    setupRetryButton() {
        const retryButton = document.getElementById('retry-projects');
        
        if (retryButton) {
            retryButton.addEventListener('click', () => {
                console.log('[APIManager] Tentando recarregar projetos...');
                this.loadProjects();
            });
        }
    }

    /**
     * Refresh manual de todos os dados
     */
    async refresh() {
        console.log('[APIManager] Atualizando dados...');
        
        // Limpar caches
        if (window.githubAPI) {
            window.githubAPI.clearCache();
        }
        
        if (window.dynamicDataAPI) {
            window.dynamicDataAPI.refreshAll();
        }

        // Recarregar
        await this.loadAll();
    }

    /**
     * Verificar saúde das APIs
     */
    async checkHealth() {
        console.log('[APIManager] Verificando saúde das APIs...');

        const health = {
            github: false,
            weather: false,
            currency: false,
            quotes: false
        };

        // Verificar GitHub
        try {
            const response = await fetch(`${API_CONFIG.github.baseUrl}/users/${API_CONFIG.github.username}`);
            health.github = response.ok;
        } catch (error) {
            health.github = false;
        }

        // Verificar Weather (se configurado)
        if (API_CONFIG.dynamicData.weather.apiKey !== 'SUA_API_KEY_AQUI') {
            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(API_CONFIG.dynamicData.weather.city)}&appid=${API_CONFIG.dynamicData.weather.apiKey}`;
                const response = await fetch(url);
                health.weather = response.ok;
            } catch (error) {
                health.weather = false;
            }
        } else {
            health.weather = 'not_configured';
        }

        // Verificar Currency
        try {
            const response = await fetch('https://brasilapi.com.br/api/cotacoes/moedas/v1/USD');
            health.currency = response.ok;
        } catch (error) {
            health.currency = false;
        }

        // Verificar Quotes
        try {
            const response = await fetch(API_CONFIG.dynamicData.quotes.baseUrl);
            health.quotes = response.ok;
        } catch (error) {
            health.quotes = false;
        }

        console.log('[APIManager] Saúde das APIs:', health);
        return health;
    }
}

// Instanciar e exportar
const apiIntegrationManager = new APIIntegrationManager();
window.apiIntegrationManager = apiIntegrationManager;

// Inicializar automaticamente
apiIntegrationManager.init();

// Expor função de refresh globalmente
window.refreshPortfolioData = () => apiIntegrationManager.refresh();
window.checkAPIHealth = () => apiIntegrationManager.checkHealth();
