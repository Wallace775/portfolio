// Mobile menu toggle functionality
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', function() {
        navMenu.classList.toggle('active');

        // Animate hamburger bars
        this.classList.toggle('active');
    });

    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || mobileMenu.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
}

// Criar o elemento de transição de página
function createPageTransition() {
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);
    return transition;
}

// Função para animar transição de página
function animatePageTransition(callback) {
    const transition = createPageTransition();
    
    // Animação de saída
    transition.classList.add('slide-out');
    
    setTimeout(() => {
        // Executar a callback (navegação)
        if (callback) callback();
        
        // Animação de entrada
        transition.classList.remove('slide-out');
        transition.classList.add('slide-in');
        
        // Remover o elemento após a animação
        setTimeout(() => {
            document.body.removeChild(transition);
        }, 800);
    }, 800); // Duração da animação de saída
}

// Smooth scrolling para links de âncora com transição
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            animatePageTransition(() => {
                window.scrollTo({
                    top: target.offsetTop - 70, // Compensar o header fixo
                    behavior: 'smooth'
                });
            });
        }
    });
});

// Adicionar efeito de scroll para adicionar classe ao header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Efeito para elementos ao aparecerem no viewport
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observar seções para animação
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Observar cards do portfólio para animação
document.querySelectorAll('.portfolio-card').forEach(card => {
    observer.observe(card);
});

// Observar posts do blog para animação
document.querySelectorAll('.blog-post').forEach(post => {
    observer.observe(post);
});

// Observar cards de GitHub para animação
document.querySelectorAll('.repo-card, .activity-card').forEach(card => {
    observer.observe(card);
});

// Observar depoimentos para animação
document.querySelectorAll('.testimonial').forEach(testimonial => {
    observer.observe(testimonial);
});

// Função para buscar dados do GitHub
function fetchGitHubData() {
    const username = 'Wallace775'; // Substitua pelo seu nome de usuário do GitHub

    // Buscar informações do usuário
    fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('github-repos').textContent = data.public_repos;
            document.getElementById('github-followers').textContent = data.followers;
        })
        .catch(error => {
            console.error('Erro ao buscar dados do usuário GitHub:', error);
            document.getElementById('github-repos').textContent = 'Erro';
            document.getElementById('github-followers').textContent = 'Erro';
        });

    // Buscar repositórios
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
        .then(response => response.json())
        .then(repos => {
            const reposContainer = document.getElementById('github-repos-list');
            reposContainer.innerHTML = '';

            if (repos.length > 0) {
                repos.forEach(repo => {
                    const repoCard = document.createElement('div');
                    repoCard.className = 'repo-card';
                    repoCard.innerHTML = `
                        <h4>${repo.name}</h4>
                        <p>${repo.description || 'Sem descrição'}</p>
                        <div class="repo-meta">
                            <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                            <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                            <span class="repo-language">${repo.language || 'N/A'}</span>
                        </div>
                        <a href="${repo.html_url}" target="_blank" class="btn-github" style="display: inline-block; margin-top: 1rem;">
                            <i class="fab fa-github"></i> Ver Repositório
                        </a>
                    `;
                    reposContainer.appendChild(repoCard);
                });
            } else {
                reposContainer.innerHTML = '<p class="no-data">Nenhum repositório público encontrado.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar repositórios GitHub:', error);
            document.getElementById('github-repos-list').innerHTML = '<p class="error">Erro ao carregar repositórios.</p>';
        });

    // Buscar atividades recentes
    fetch(`https://api.github.com/users/${username}/events?per_page=5`)
        .then(response => response.json())
        .then(events => {
            const activityContainer = document.getElementById('github-activity-list');
            activityContainer.innerHTML = '';

            if (events.length > 0) {
                events.forEach(event => {
                    let activityText = '';
                    let activityType = '';

                    switch(event.type) {
                        case 'PushEvent':
                            activityText = `Fez push para ${event.repo.name}: ${event.payload.size} commits`;
                            activityType = 'Push';
                            break;
                        case 'CreateEvent':
                            activityText = `Criou ${event.payload.ref_type} ${event.payload.ref || 'um novo item'} em ${event.repo.name}`;
                            activityType = 'Criação';
                            break;
                        case 'ForkEvent':
                            activityText = `Forkou ${event.repo.name}`;
                            activityType = 'Fork';
                            break;
                        case 'WatchEvent':
                            activityText = `Começou a seguir ${event.repo.name}`;
                            activityType = 'Star';
                            break;
                        default:
                            activityText = `Atividade no repositório ${event.repo.name}`;
                            activityType = event.type.replace('Event', '');
                    }

                    const activityCard = document.createElement('div');
                    activityCard.className = 'activity-card';
                    activityCard.innerHTML = `
                        <div class="activity-type">${activityType}</div>
                        <h4>${event.repo.name}</h4>
                        <p>${activityText}</p>
                        <small>${new Date(event.created_at).toLocaleDateString('pt-BR')}</small>
                    `;
                    activityContainer.appendChild(activityCard);
                });
            } else {
                activityContainer.innerHTML = '<p class="no-data">Nenhuma atividade recente encontrada.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar atividades GitHub:', error);
            document.getElementById('github-activity-list').innerHTML = '<p class="error">Erro ao carregar atividades.</p>';
        });
}

// Carregar dados do GitHub quando a seção estiver visível
const githubSection = document.getElementById('github');
if (githubSection) {
    const githubObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fetchGitHubData();
                githubObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    githubObserver.observe(githubSection);
}

// Validação e envio do formulário de contato
document.getElementById('contactForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Mostrar mensagem de carregamento
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;

    // Pegar os valores dos campos
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Validação simples
    if (!name || !email || !subject || !message) {
        // Exibir mensagem de erro mais acessível
        const errorMessage = document.createElement('div');
        errorMessage.setAttribute('role', 'alert');
        errorMessage.setAttribute('aria-live', 'assertive');
        errorMessage.textContent = 'Por favor, preencha todos os campos obrigatórios.';
        errorMessage.style.color = 'red';
        errorMessage.style.marginTop = '10px';
        errorMessage.style.fontWeight = 'bold';
        errorMessage.style.padding = '10px';
        errorMessage.style.border = '1px solid red';
        errorMessage.style.borderRadius = '5px';
        errorMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';

        // Adicionar mensagem de erro ao topo do formulário
        this.insertBefore(errorMessage, this.firstChild);

        // Focar no primeiro campo inválido
        const firstInvalidField = this.querySelector('input:invalid, textarea:invalid');
        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        // Resetar botão
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um email válido.');
        document.getElementById('email').focus();

        // Resetar botão
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        return;
    }

    try {
        // Enviar dados para a API
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, subject, message })
        });

        const result = await response.json();

        if (result.success) {
            // Exibir mensagem de sucesso
            const successMessage = document.createElement('div');
            successMessage.setAttribute('role', 'alert');
            successMessage.setAttribute('aria-live', 'assertive');
            successMessage.textContent = result.message;
            successMessage.style.color = 'green';
            successMessage.style.marginTop = '10px';
            successMessage.style.fontWeight = 'bold';
            successMessage.style.padding = '10px';
            successMessage.style.border = '1px solid green';
            successMessage.style.borderRadius = '5px';
            successMessage.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';

            // Adicionar mensagem de sucesso ao topo do formulário
            this.insertBefore(successMessage, this.firstChild);

            // Resetar o formulário após envio
            this.reset();

            // Focar no início do formulário após envio para melhor experiência de usuário
            document.getElementById('name').focus();
        } else {
            // Exibir mensagem de erro da API
            const errorMessage = document.createElement('div');
            errorMessage.setAttribute('role', 'alert');
            errorMessage.setAttribute('aria-live', 'assertive');
            errorMessage.textContent = result.message;
            errorMessage.style.color = 'red';
            errorMessage.style.marginTop = '10px';
            errorMessage.style.fontWeight = 'bold';
            errorMessage.style.padding = '10px';
            errorMessage.style.border = '1px solid red';
            errorMessage.style.borderRadius = '5px';
            errorMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';

            // Adicionar mensagem de erro ao topo do formulário
            this.insertBefore(errorMessage, this.firstChild);
        }
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        // Exibir mensagem de erro de rede
        const errorMessage = document.createElement('div');
        errorMessage.setAttribute('role', 'alert');
        errorMessage.setAttribute('aria-live', 'assertive');
        errorMessage.textContent = 'Erro de rede. Por favor, verifique sua conexão e tente novamente.';
        errorMessage.style.color = 'red';
        errorMessage.style.marginTop = '10px';
        errorMessage.style.fontWeight = 'bold';
        errorMessage.style.padding = '10px';
        errorMessage.style.border = '1px solid red';
        errorMessage.style.borderRadius = '5px';
        errorMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';

        // Adicionar mensagem de erro ao topo do formulário
        this.insertBefore(errorMessage, this.firstChild);
    } finally {
        // Resetar botão
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Função para obter e exibir estatísticas do portfólio
async function fetchPortfolioStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();

        // Atualizar elementos do DOM com as estatísticas
        const totalViewsElement = document.getElementById('github-repos'); // Reutilizando o elemento
        if (totalViewsElement) {
            totalViewsElement.textContent = stats.totalViews;
        }

        // Se precisar de mais elementos específicos para estatísticas, podemos adicionar
        // Exemplo de como adicionar mais estatísticas específicas:
        /*
        const totalContactsElement = document.getElementById('total-contacts');
        if (totalContactsElement) {
            totalContactsElement.textContent = stats.totalContacts;
        }
        */
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
    }
}

// Carregar estatísticas quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    fetchPortfolioStats();
});

// Função para buscar e exibir atividades das redes sociais
async function fetchSocialActivities() {
    try {
        // Simulação de dados de redes sociais
        // Em um ambiente real, isso seria substituído por chamadas reais às APIs
        const socialData = [
            {
                id: 1,
                platform: 'linkedin',
                icon: 'fab fa-linkedin',
                title: 'Novo post no LinkedIn',
                content: 'Compartilhei uma nova atualização sobre meus estudos em desenvolvimento front-end...',
                date: '2 dias atrás',
                url: 'https://linkedin.com/posts/exemplo'
            },
            {
                id: 2,
                platform: 'github',
                icon: 'fab fa-github',
                title: 'Novo commit',
                content: 'Atualizei o portfólio com novas funcionalidades e melhorias de performance',
                date: '3 dias atrás',
                url: 'https://github.com/Wallace775/portfolio/commits/main'
            },
            {
                id: 3,
                platform: 'twitter',
                icon: 'fab fa-twitter',
                title: 'Novo tweet',
                content: 'Acabei de completar mais um módulo do meu curso de React! Cada dia me sinto mais preparado para o mercado #DesenvolvimentoWeb #React',
                date: '1 semana atrás',
                url: 'https://twitter.com/exemplo'
            }
        ];

        const container = document.getElementById('social-posts-container');
        if (!container) return;

        // Limpar container
        container.innerHTML = '';

        // Adicionar posts ao container
        socialData.forEach(post => {
            const postElement = document.createElement('a');
            postElement.href = post.url;
            postElement.target = "_blank";
            postElement.rel = "noopener noreferrer";
            postElement.className = 'social-post';
            postElement.innerHTML = `
                <div>
                    <i class="${post.icon} platform-icon"></i>
                    <strong>${post.title}</strong>
                    <p>${post.content}</p>
                    <span class="post-date">${post.date}</span>
                </div>
            `;
            container.appendChild(postElement);
        });

    } catch (error) {
        console.error('Erro ao buscar atividades das redes sociais:', error);
        const container = document.getElementById('social-posts-container');
        if (container) {
            container.innerHTML = '<p class="error">Erro ao carregar últimas atividades</p>';
        }
    }
}

// Função para integrar com APIs reais de redes sociais (exemplo conceitual)
async function integrateSocialAPIs() {
    try {
        // Exemplo de chamada para uma API de redes sociais (simulada)
        // const linkedinResponse = await fetch('/api/social/linkedin');
        // const twitterResponse = await fetch('/api/social/twitter');

        // Em uma implementação real, você chamaria as APIs reais:
        // - LinkedIn API: https://docs.microsoft.com/en-us/linkedin/
        // - Twitter API: https://developer.twitter.com/en/docs/twitter-api
        // - Instagram Basic Display API: https://developers.facebook.com/docs/instagram-basic-display-api/

        // Por segurança, a integração real normalmente seria feita no backend
        // para proteger as credenciais das APIs

        fetchSocialActivities(); // Chamando a simulação por enquanto
    } catch (error) {
        console.error('Erro na integração com redes sociais:', error);
        fetchSocialActivities(); // Fallback para dados simulados
    }
}

// Carregar atividades das redes sociais quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    integrateSocialAPIs();
});

// Sistema de busca
class SearchSystem {
    constructor() {
        this.searchData = [];
        this.searchTimeout = null;
        this.currentResults = [];

        // Dados de busca - estes viriam de uma API ou banco de dados em produção
        this.initializeSearchData();

        // Configurar eventos de busca
        this.setupSearchEvents();
    }

    initializeSearchData() {
        // Coletando dados de todas as seções para busca
        this.searchData = [
            // Projetos do portfólio
            ...this.extractPortfolioData(),
            // Posts do blog
            ...this.extractBlogData(),
            // Habilidades
            ...this.extractSkillsData(),
            // Experiências
            ...this.extractExperienceData(),
            // Educação
            ...this.extractEducationData(),
            // Cursos
            ...this.extractCoursesData()
        ];
    }

    extractPortfolioData() {
        const projects = [];
        const projectElements = document.querySelectorAll('.portfolio-card');

        projectElements.forEach((card, index) => {
            const title = card.querySelector('h3')?.textContent || '';
            const description = card.querySelector('p')?.textContent || '';
            const link = card.querySelector('.btn-github')?.href || '';

            projects.push({
                id: `project-${index}`,
                title: title,
                content: description,
                url: `#portifolio`,
                type: 'project',
                category: 'portfólio'
            });
        });

        return projects;
    }

    extractBlogData() {
        const posts = [];
        const postElements = document.querySelectorAll('.blog-post');

        postElements.forEach((post, index) => {
            const title = post.querySelector('h3')?.textContent || '';
            const content = post.querySelector('p')?.textContent || '';
            const date = post.querySelector('.blog-date')?.textContent || '';

            posts.push({
                id: `blog-${index}`,
                title: title,
                content: `${date} - ${content}`,
                url: `#blog`,
                type: 'blog',
                category: 'blog'
            });
        });

        return posts;
    }

    extractSkillsData() {
        const skills = [];
        const skillElements = document.querySelectorAll('.skill-item');

        skillElements.forEach((skill, index) => {
            const title = skill.querySelector('span')?.textContent || '';
            const category = skill.closest('.skills-category')?.querySelector('h3')?.textContent || '';

            skills.push({
                id: `skill-${index}`,
                title: title,
                content: category,
                url: `#habilidades`,
                type: 'skill',
                category: 'habilidades'
            });
        });

        return skills;
    }

    extractExperienceData() {
        const experiences = [];
        const expElements = document.querySelectorAll('.timeline-content');

        expElements.forEach((exp, index) => {
            const title = exp.querySelector('h3')?.textContent || '';
            const description = Array.from(exp.querySelectorAll('p, li'))
                .map(el => el.textContent.trim())
                .join(' ')
                .substring(0, 150) + '...';

            experiences.push({
                id: `exp-${index}`,
                title: title,
                content: description,
                url: `#experiencia`,
                type: 'experience',
                category: 'experiência'
            });
        });

        return experiences;
    }

    extractEducationData() {
        const education = [];
        const eduElements = document.querySelectorAll('.education-item');

        eduElements.forEach((edu, index) => {
            const title = edu.querySelector('h3')?.textContent || '';
            const degree = edu.querySelector('.education-degree')?.textContent || '';
            const year = edu.querySelector('.education-year')?.textContent || '';

            education.push({
                id: `edu-${index}`,
                title: title,
                content: `${degree} - ${year}`,
                url: `#formacao`,
                type: 'education',
                category: 'formação'
            });
        });

        return education;
    }

    extractCoursesData() {
        const courses = [];
        const courseElements = document.querySelectorAll('.course-item');

        courseElements.forEach((course, index) => {
            const title = course.querySelector('h4')?.textContent || '';
            const description = course.querySelector('p')?.textContent || '';

            courses.push({
                id: `course-${index}`,
                title: title,
                content: description,
                url: `#cursos`,
                type: 'course',
                category: 'cursos'
            });
        });

        return courses;
    }

    setupSearchEvents() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const searchResults = document.getElementById('search-results');

        if (!searchInput || !searchButton) return;

        // Evento de digitação com debounce
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();

            // Limpar timeout anterior
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            // Definir novo timeout para buscar após digitação parar
            this.searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300); // 300ms delay após digitação
        });

        // Evento de clique no botão de busca
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            this.performSearch(query);
        });

        // Evento de tecla Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                this.performSearch(query);
            }
        });

        // Fechar resultados quando clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.classList.remove('show');
            }
        });
    }

    performSearch(query) {
        if (!query) {
            this.hideResults();
            return;
        }

        // Filtrar dados baseado na consulta
        this.currentResults = this.searchData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );

        // Exibir resultados
        this.displayResults(this.currentResults, query);
    }

    displayResults(results, query) {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = `<div class="search-no-results">Nenhum resultado encontrado para "${query}"</div>`;
            searchResults.classList.add('show');
            return;
        }

        // Criar HTML para os resultados
        const resultsHTML = results.slice(0, 10).map(item => {
            // Destacar a consulta nos resultados
            const highlightedTitle = this.highlightText(item.title, query);
            const highlightedContent = this.highlightText(item.content, query);

            return `
                <div class="search-result-item" onclick="searchSystem.goToResult('${item.url}', '${item.id}')">
                    <h4>${highlightedTitle}</h4>
                    <p>${highlightedContent}</p>
                    <small>Categoria: ${item.category}</small>
                </div>
            `;
        }).join('');

        searchResults.innerHTML = resultsHTML;
        searchResults.classList.add('show');
    }

    highlightText(text, query) {
        if (!query) return text;

        // Escapar caracteres especiais para regex
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');

        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    goToResult(url, id) {
        // Fechar resultados
        document.getElementById('search-results').classList.remove('show');

        // Limpar campo de busca
        document.getElementById('search-input').value = '';

        // Navegar para a seção
        if (url.startsWith('#')) {
            // Fazer scroll suave para a seção
            const targetElement = document.querySelector(url);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });

                // Destacar o item específico se possível
                if (id) {
                    const targetItem = document.querySelector(`#${id}`) ||
                                      document.querySelector(`[data-id="${id}"]`);
                    if (targetItem) {
                        targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
        }
    }

    hideResults() {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.classList.remove('show');
        }
    }
}

// Inicializar o sistema de busca
const searchSystem = new SearchSystem();
window.searchSystem = searchSystem;

// Sistema de Estatísticas e Métricas
class StatsSystem {
    constructor() {
        // Inicializar quando a página carregar
        this.init();
    }

    init() {
        // Desenhar gráficos quando o DOM estiver pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.drawCharts();
            });
        } else {
            this.drawCharts();
        }

        // Adicionar interatividade aos cards de estatísticas
        this.addStatsInteractivity();

        // Atualizar estatísticas dinamicamente
        this.updateDynamicStats();
    }

    drawCharts() {
        // Gráfico de progresso nas tecnologias
        const techCtx = document.getElementById('tech-progress-chart');
        if (techCtx) {
            // Simular gráfico com dados estáticos
            this.drawTechProgressChart(techCtx);
        }

        // Gráfico de atividade de desenvolvimento
        const activityCtx = document.getElementById('dev-activity-chart');
        if (activityCtx) {
            // Simular gráfico com dados estáticos
            this.drawDevActivityChart(activityCtx);
        }
    }

    drawTechProgressChart(ctx) {
        // Dados simulados para o gráfico de tecnologias
        const techLabels = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python'];
        const techValues = [95, 85, 70, 40, 25, 20];
        const backgroundColors = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ];
        const borderColors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ];

        // Criar um gráfico de barras simulado (sem usar Chart.js por simplicidade)
        this.simulateChart(ctx, techLabels, techValues, backgroundColors, borderColors);
    }

    drawDevActivityChart(ctx) {
        // Dados simulados para o gráfico de atividade
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const activityData = [12, 19, 15, 25, 32, 28, 35, 30, 42, 38, 45, 48];

        // Criar um gráfico de linhas simulado (sem usar Chart.js por simplicidade)
        this.simulateLineChart(ctx, months, activityData);
    }

    simulateChart(ctx, labels, values, bgColors, borderColors) {
        // Como não estamos usando uma biblioteca de gráficos, vamos simular visualmente
        const canvas = ctx;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Limpar o canvas
        context.clearRect(0, 0, width, height);

        // Adicionar texto indicando que é um gráfico simulado
        context.font = '14px Arial';
        context.fillStyle = 'var(--text-color)' || '#333';
        context.textAlign = 'center';
        context.fillText('Gráfico de competências', width / 2, height / 2 - 10);
        context.fillText('(Simulado para demonstração)', width / 2, height / 2 + 10);
    }

    simulateLineChart(ctx, labels, values) {
        // Simular gráfico de linhas
        const canvas = ctx;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Limpar o canvas
        context.clearRect(0, 0, width, height);

        // Adicionar texto indicando que é um gráfico simulado
        context.font = '14px Arial';
        context.fillStyle = 'var(--text-color)' || '#333';
        context.textAlign = 'center';
        context.fillText('Atividade de Desenvolvimento', width / 2, height / 2 - 10);
        context.fillText('(Simulado para demonstração)', width / 2, height / 2 + 10);
    }

    addStatsInteractivity() {
        // Adicionar eventos de clique aos cards de estatísticas
        const statCards = document.querySelectorAll('.stat-card.interactive');

        statCards.forEach(card => {
            card.addEventListener('click', () => {
                const metric = card.getAttribute('data-metric');

                // Animação de clique
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 200);

                // Você pode adicionar lógica específica para cada métrica aqui
                console.log('Métrica clicada:', metric);

                // Mostrar detalhes ou expandir card
                this.showMetricDetails(metric);
            });
        });
    }

    showMetricDetails(metric) {
        // Esta função pode mostrar mais detalhes sobre uma métrica específica
        let detail = '';

        switch (metric) {
            case 'projects-completed':
                detail = '8 projetos completados incluindo sites responsivos, aplicações web e integrações API.';
                break;
            case 'lines-of-code':
                detail = 'Mais de 15,000 linhas de código escritas em projetos pessoais e colaborativos.';
                break;
            case 'github-commits':
                detail = '127 commits no GitHub demonstrando consistência e dedicação à prática.';
                break;
            case 'courses-completed':
                detail = '12 cursos completos em desenvolvimento web, focando em tecnologias modernas.';
                break;
            case 'hours-coded':
                detail = 'Mais de 320 horas dedicadas à prática de programação e desenvolvimento de projetos.';
                break;
            case 'problems-solved':
                detail = '45 problemas e desafios resolvidos em algoritmos e programação.';
                break;
            default:
                detail = 'Detalhes da métrica selecionada.';
        }

        // Em um ambiente real, você pode mostrar um modal ou expandir o card
        alert(detail);
    }

    updateDynamicStats() {
        // Atualizar estatísticas dinamicamente se for necessário
        // Por exemplo, atualizar o contador de commits do GitHub via API
        this.fetchGitHubStats();
    }

    fetchGitHubStats() {
        // Simular busca de estatísticas reais do GitHub
        // Em implementação real, isso faria uma chamada real à API do GitHub
        setTimeout(() => {
            // Exemplo de como atualizar estatísticas com dados reais
            const commitsElement = document.querySelector('[data-metric="github-commits"] .stat-value');
            if (commitsElement) {
                // Aqui atualizaríamos o valor com dados reais do GitHub
                // Por enquanto, apenas mostramos que isso é possível
            }
        }, 1000);
    }
}

// Inicializar o sistema de estatísticas
const statsSystem = new StatsSystem();
window.statsSystem = statsSystem;

// Função para animar barras de habilidades quando visíveis
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Adicionar classe para ativar a animação
            const skillLevels = entry.target.querySelectorAll('.skill-level, .progress');
            skillLevels.forEach((level, index) => {
                setTimeout(() => {
                    level.style.width = level.style.width;
                }, index * 200);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observar seções de habilidades
document.querySelectorAll('.skills-category, .course-item').forEach(section => {
    skillObserver.observe(section);
});

// Efeito de digitação no subtítulo (opcional)
const subtitle = document.querySelector('.subtitle');
if (subtitle) {
    const originalText = subtitle.textContent;
    const texts = [
        'Desenvolvedor Front-end Júnior | Em transição para desenvolvimento',
        'Desenvolvedor Web | Aprendiz contínuo',
        'Desenvolvedor Front-end Júnior | Apaixonado por tecnologia'
    ];
    
    let index = 0;
    setInterval(() => {
        subtitle.textContent = texts[index];
        index = (index + 1) % texts.length;
    }, 4000);
}

// Implementar transições de página mais suaves ao rolar
let ticking = false;
let isTransitioning = false; // Flag para evitar múltiplas transições

function updateScrollState() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            // Destacar o link de navegação correspondente
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateScrollState();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Inicializar estado de scroll
document.addEventListener('DOMContentLoaded', () => {
    updateScrollState();
});

// Intro Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const introModal = document.getElementById('intro-modal');
    const enterBtn = document.getElementById('enter-btn');
    const skipBtn = document.getElementById('skip-btn');

    // Function to scroll to 'sobre' section
    function scrollToSobre() {
        const sobreSection = document.getElementById('sobre');
        if (sobreSection) {
            // Rolar diretamente para a seção 'sobre'
            sobreSection.scrollIntoView({
                behavior: 'smooth',  // smooth em vez de instant para melhor experiência
                block: 'start'
            });

            // Destacar o link 'Sobre' como ativo
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#sobre') {
                    link.classList.add('active');
                }
            });
        }
    }

    // Check if modal has been shown in this session
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');

    if (!hasSeenIntro) {
        // Mostrar a intro para novos visitantes
        // Reduzir o tempo para apenas 2.5 segundos
        setTimeout(() => {
            if (introModal.style.display !== 'none') {
                hideIntroModal();
            }
        }, 2500); // Reduzido de 3.5s para 2.5s
    } else {
        // Se o usuário já viu a intro, esconder imediatamente
        introModal.style.display = 'none';
        // E ir direto para a seção 'sobre'
        scrollToSobre();
    }

    // Function to hide the intro modal and scroll to 'sobre'
    function hideIntroModal() {
        introModal.style.opacity = '0';
        setTimeout(() => {
            introModal.style.display = 'none';
            scrollToSobre();
        }, 300); // Reduzido o tempo de fade out
        localStorage.setItem('hasSeenIntro', 'true');
    }

    // Event listener for the Enter button
    enterBtn.addEventListener('click', hideIntroModal);

    // Event listener for the Skip button
    skipBtn.addEventListener('click', hideIntroModal);

    // Also allow clicking anywhere on the modal to enter (except the button area to avoid double action)
    introModal.addEventListener('click', function(e) {
        if (e.target === introModal) {
            hideIntroModal();
        }
    });
});

// Visitor counter functionality using CountAPI
document.addEventListener('DOMContentLoaded', function() {
    // Using CountAPI (free service) to track visitors
    const visitorCountElement = document.getElementById('visitor-count');

    if (visitorCountElement) {
        // Using a unique ID for this portfolio site - you can change this to your own if desired
        const endpoint = 'https://api.countapi.xyz/hit/wallacephellipe.portfolio/visitors';

        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                if (data && data.value) {
                    // Update the visitor count with proper number formatting
                    visitorCountElement.textContent = data.value.toLocaleString();
                }
            })
            .catch(error => {
                console.error('Error fetching visitor count:', error);
                // Fallback to a local counter if the API fails
                const localCount = localStorage.getItem('localVisitorCount');
                let count = 1;
                if (localCount) {
                    count = parseInt(localCount) + 1;
                }
                localStorage.setItem('localVisitorCount', count);
                visitorCountElement.textContent = count.toLocaleString();
            });
    }
});

// Jogo Interativo - Adivinhe o Número
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do jogo
    const guessInputEl = document.getElementById('guess-input');
    const submitBtn = document.getElementById('submit-guess');
    const attemptsEl = document.getElementById('attempts');
    const difficultyEl = document.getElementById('difficulty');
    const feedbackEl = document.getElementById('feedback');
    const cluesEl = document.getElementById('clues');
    const progressFillEl = document.getElementById('progress-fill');
    const progressTextEl = document.getElementById('progress-text');

    // Variáveis do jogo
    let targetNumber = 0;
    let attempts = 0;
    let maxAttempts = 10; // Dificuldade padrão
    let gameActive = true;

    // Função para iniciar o jogo
    function startGame() {
        targetNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        gameActive = true;

        // Determinar dificuldade baseada no número de tentativas
        if (maxAttempts <= 5) {
            difficultyEl.textContent = 'Difícil';
        } else if (maxAttempts <= 7) {
            difficultyEl.textContent = 'Médio';
        } else {
            difficultyEl.textContent = 'Fácil';
        }

        updateDisplay();

        feedbackEl.textContent = 'Faça sua primeira tentativa!';
        feedbackEl.className = 'feedback';
        cluesEl.textContent = 'O número está entre 1 e 100';

        guessInputEl.focus();
    }

    // Função para atualizar a interface
    function updateDisplay() {
        attemptsEl.textContent = attempts;

        // Atualizar barra de progresso (quanto mais tentativas, menor a precisão)
        const precision = Math.max(0, 100 - (attempts * 10));
        progressFillEl.style.width = `${precision}%`;
        progressTextEl.textContent = `${precision}% de precisão`;
    }

    // Função para verificar o palpite
    function checkGuess() {
        if (!gameActive) return;

        const userGuess = parseInt(guessInputEl.value);

        // Validação de entrada
        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            feedbackEl.textContent = 'Por favor, digite um número entre 1 e 100';
            feedbackEl.className = 'feedback error';
            return;
        }

        attempts++;
        updateDisplay();

        if (userGuess === targetNumber) {
            // Jogador venceu!
            feedbackEl.textContent = `Parabéns! O número era ${targetNumber}`;
            feedbackEl.className = 'feedback success';
            cluesEl.textContent = `Você acertou em ${attempts} tentativa${attempts > 1 ? 's' : ''}!`;

            gameActive = false;

            // Celebrar com uma pequena animação
            feedbackEl.style.transform = 'scale(1.1)';
            setTimeout(() => {
                feedbackEl.style.transform = 'scale(1)';
            }, 500);

        } else if (attempts >= maxAttempts) {
            // Jogador perdeu por exceder tentativas
            feedbackEl.textContent = `Fim de jogo! O número era ${targetNumber}`;
            feedbackEl.className = 'feedback error';
            cluesEl.textContent = `Você usou todas as ${maxAttempts} tentativas`;
            gameActive = false;

        } else {
            // Jogador ainda está tentando
            if (userGuess < targetNumber) {
                feedbackEl.textContent = 'Muito baixo! Tente um número maior';
                feedbackEl.className = 'feedback';
                cluesEl.textContent = `O número é maior que ${userGuess}`;
            } else {
                feedbackEl.textContent = 'Muito alto! Tente um número menor';
                feedbackEl.className = 'feedback';
                cluesEl.textContent = `O número é menor que ${userGuess}`;
            }

            // Atualizar a barra de progresso com base em quão perto está
            const difference = Math.abs(userGuess - targetNumber);
            const proximityPercent = Math.max(0, 100 - (difference * 2));
            progressFillEl.style.width = `${proximityPercent}%`;
            progressTextEl.textContent = `Aproximação: ${(100 - difference * 2).toFixed(0)}%`;
        }

        // Limpar campo de entrada
        guessInputEl.value = '';
        guessInputEl.focus();
    }

    // Eventos
    submitBtn.addEventListener('click', checkGuess);

    guessInputEl.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkGuess();
        }
    });

    // Permitir reiniciar o jogo ao pressionar "R" ou "N" após terminar
    document.addEventListener('keydown', function(e) {
        if (!gameActive && (e.key === 'r' || e.key === 'R' || e.key === 'n' || e.key === 'N')) {
            startGame();
        }
    });

    // Iniciar o jogo automaticamente
    startGame();
});

// Adicionar funcionalidade de transição suave ao rolar para seções
let lastScrollTop = 0;
let scrollTimeout;

function handleSectionChange() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            // Atualizar link ativo
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Detectar quando o usuário para de rolar
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
        handleSectionChange();
    }, 150);
});

// Alternância de tema claro/escuro
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('#theme-toggle i');
    const isDarkTheme = body.classList.contains('dark-theme');

    if (isDarkTheme) {
        body.classList.remove('dark-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
}

// Verificar o tema salvo no localStorage
function checkSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('#theme-toggle i');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

// Adicionar evento ao botão de alternância de tema
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Verificar tema salvo
    checkSavedTheme();
});

// Adicionar micro-interações e animações mais sofisticadas
document.addEventListener('DOMContentLoaded', function() {
    // Efeito de mouse follower em links importantes
    const interactiveElements = document.querySelectorAll('a, button, .skill-card, .stat, .testimonial, .education-item, .portfolio-card');

    // Efeito de eletrocardiograma nos cards quando hover
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            // Adiciona classe temporária para efeito de "batida cardíaca"
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 300);
        });
    });

    // Adicionar efeito de confetti ao clicar no botão de contato
    const contactButton = document.querySelector('.cta-btn');
    if (contactButton) {
        contactButton.addEventListener('click', function(e) {
            createConfettiEffect(e.clientX, e.clientY);
        });
    }

    // Adicionar tooltips personalizados
    setupTooltips();

    // Adicionar efeito de digitação para o subtítulo com variações
    typeEffect('.subtitle', [
        'Desenvolvedor Front-end Júnior | Em transição para desenvolvimento',
        'Desenvolvedor Web | Aprendiz contínuo',
        'Desenvolvedor Front-end Júnior | Apaixonado por tecnologia',
        'Front-end Developer | Transformando código em experiências'
    ]);
});

// Função para criar efeito de confetti (simplificado)
function createConfettiEffect(x, y) {
    // Criação de pequenos elementos coloridos que se movem
    for (let i = 0; i < 15; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';

        document.body.appendChild(confetti);

        // Animação
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let posX = x;
        let posY = y;
        let opacity = 1;

        const animation = setInterval(() => {
            posX += vx;
            posY += vy;
            vy += 0.1; // Gravidade
            opacity -= 0.01;

            confetti.style.left = posX + 'px';
            confetti.style.top = posY + 'px';
            confetti.style.opacity = opacity;

            if (opacity <= 0) {
                clearInterval(animation);
                document.body.removeChild(confetti);
            }
        }, 30);
    }
}

function getRandomColor() {
    const colors = ['#00509e', '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Função para setup de tooltips
function setupTooltips() {
    // Adiciona tooltips a links de navegação
    document.querySelectorAll('nav a').forEach(link => {
        const title = link.textContent.trim();
        link.setAttribute('title', `Ir para ${title}`);
    });
}

// Efeito de digitação com variações
function typeEffect(selector, texts) {
    const element = document.querySelector(selector);
    if (!element) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let pauseTime = 0;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 100;

        if (isDeleting) {
            typeSpeed /= 2;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pausa no final da digitação
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }

        setTimeout(type, typeSpeed);
    }

    // Iniciar o efeito após um pequeno delay
    setTimeout(type, 1000);
}

// Função para inicializar o carrossel de depoimentos
function initTestimonialCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Função para mostrar slide específico
    function showSlide(index) {
        // Remover classe ativa de todos os slides
        slides.forEach(slide => {
            slide.classList.remove('active');
            // Adicionar classe para animação
            if (parseInt(slide.dataset.index) < index) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        });

        // Remover classe ativa de todos os dots
        dots.forEach(dot => dot.classList.remove('active'));

        // Atualizar slide
        const newSlide = slides[index];
        newSlide.classList.remove('prev', 'next');
        newSlide.classList.add('active');

        // Atualizar dot
        dots[index].classList.add('active');

        currentIndex = index;
    }

    // Event listeners para os botões
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const newIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
            showSlide(newIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const newIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
            showSlide(newIndex);
        });
    }

    // Event listeners para os dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Iniciar o carrossel
    showSlide(currentIndex);

    // Auto-avancar o carrossel a cada 5 segundos
    setInterval(() => {
        const newIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
        showSlide(newIndex);
    }, 5000);
}

// Inicializar o carrossel quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initTestimonialCarousel();
});

// Registro do Service Worker para funcionalidade PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrado com sucesso:', registration.scope);
            })
            .catch(function(error) {
                console.log('Falha no registro do ServiceWorker:', error);
            });
    });
}



