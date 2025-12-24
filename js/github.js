// Gerenciamento da integração com GitHub
class GitHubManager {
    constructor() {
        this.username = 'Wallace775';
        this.init();
    }

    init() {
        this.setupObserver();
    }

    setupObserver() {
        const githubSection = document.getElementById('github');
        if (githubSection) {
            const githubObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.fetchGitHubData();
                        githubObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            githubObserver.observe(githubSection);
        }
    }

    // Função para buscar dados do GitHub
    async fetchGitHubData() {
        try {
            // Buscar informações do usuário
            const userResponse = await fetch(`https://api.github.com/users/${this.username}`);
            const userData = await userResponse.json();

            if (userData && userData.public_repos !== undefined) {
                const reposElement = document.getElementById('github-repos');
                const followersElement = document.getElementById('github-followers');
                
                if (reposElement) reposElement.textContent = userData.public_repos;
                if (followersElement) followersElement.textContent = userData.followers;
            }

            // Buscar repositórios
            const reposResponse = await fetch(`https://api.github.com/users/${this.username}/repos?sort=updated&per_page=6`);
            const repos = await reposResponse.json();

            const reposContainer = document.getElementById('github-repos-list');
            if (reposContainer) {
                reposContainer.innerHTML = '';

                if (repos.length > 0) {
                    repos.forEach(repo => {
                        const repoCard = document.createElement('div');
                        repoCard.className = 'repo-card';
                        repoCard.innerHTML = `
                            <h4>${this.escapeHtml(repo.name)}</h4>
                            <p>${this.escapeHtml(repo.description || 'Sem descrição')}</p>
                            <div class="repo-meta">
                                <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                                <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                                <span class="repo-language">${this.escapeHtml(repo.language || 'N/A')}</span>
                            </div>
                            <a href="${this.escapeHtml(repo.html_url)}" target="_blank" class="btn-github" style="display: inline-block; margin-top: 1rem;">
                                <i class="fab fa-github"></i> Ver Repositório
                            </a>
                        `;
                        reposContainer.appendChild(repoCard);
                    });
                } else {
                    reposContainer.innerHTML = '<p class="no-data">Nenhum repositório público encontrado.</p>';
                }
            }

            // Buscar atividades recentes
            const eventsResponse = await fetch(`https://api.github.com/users/${this.username}/events?per_page=5`);
            const events = await eventsResponse.json();

            const activityContainer = document.getElementById('github-activity-list');
            if (activityContainer) {
                activityContainer.innerHTML = '';

                if (events.length > 0) {
                    events.forEach(event => {
                        let activityText = '';
                        let activityType = '';

                        switch(event.type) {
                            case 'PushEvent':
                                activityText = `Fez push para ${this.escapeHtml(event.repo.name)}: ${event.payload.size} commits`;
                                activityType = 'Push';
                                break;
                            case 'CreateEvent':
                                activityText = `Criou ${event.payload.ref_type} ${this.escapeHtml(event.payload.ref || 'um novo item')} em ${this.escapeHtml(event.repo.name)}`;
                                activityType = 'Criação';
                                break;
                            case 'ForkEvent':
                                activityText = `Forkou ${this.escapeHtml(event.repo.name)}`;
                                activityType = 'Fork';
                                break;
                            case 'WatchEvent':
                                activityText = `Começou a seguir ${this.escapeHtml(event.repo.name)}`;
                                activityType = 'Star';
                                break;
                            default:
                                activityText = `Atividade no repositório ${this.escapeHtml(event.repo.name)}`;
                                activityType = event.type.replace('Event', '');
                        }

                        const activityCard = document.createElement('div');
                        activityCard.className = 'activity-card';
                        activityCard.innerHTML = `
                            <div class="activity-type">${this.escapeHtml(activityType)}</div>
                            <h4>${this.escapeHtml(event.repo.name)}</h4>
                            <p>${this.escapeHtml(activityText)}</p>
                            <small>${new Date(event.created_at).toLocaleDateString('pt-BR')}</small>
                        `;
                        activityContainer.appendChild(activityCard);
                    });
                } else {
                    activityContainer.innerHTML = '<p class="no-data">Nenhuma atividade recente encontrada.</p>';
                }
            }
        } catch (error) {
            console.error('Erro ao buscar dados do GitHub:', error);
            
            // Atualizar elementos com mensagem de erro
            const reposElement = document.getElementById('github-repos');
            const followersElement = document.getElementById('github-followers');
            const reposContainer = document.getElementById('github-repos-list');
            const activityContainer = document.getElementById('github-activity-list');
            
            if (reposElement) reposElement.textContent = 'Erro';
            if (followersElement) followersElement.textContent = 'Erro';
            if (reposContainer) reposContainer.innerHTML = '<p class="error">Erro ao carregar repositórios.</p>';
            if (activityContainer) activityContainer.innerHTML = '<p class="error">Erro ao carregar atividades.</p>';
        }
    }

    // Função para escapar HTML e prevenir XSS
    escapeHtml(text) {
        if (typeof text !== 'string') return text;
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Inicializar o gerenciador do GitHub
document.addEventListener('DOMContentLoaded', () => {
    new GitHubManager();
});

// Exportar para uso em outros módulos se estiver usando ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitHubManager;
}