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
        searchInput.addEventListener('input', Utils.debounce((e) => {
            const query = e.target.value.trim();
            this.performSearch(query);
        }, 300)); // 300ms delay após digitação

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
            searchResults.innerHTML = `<div class="search-no-results">Nenhum resultado encontrado para "${this.escapeHtml(query)}"</div>`;
            searchResults.classList.add('show');
            return;
        }

        // Criar HTML para os resultados
        const resultsHTML = results.slice(0, 10).map(item => {
            // Destacar a consulta nos resultados
            const highlightedTitle = this.highlightText(item.title, query);
            const highlightedContent = this.highlightText(item.content, query);

            return `
                <div class="search-result-item" onclick="searchSystem.goToResult('${this.escapeHtml(item.url)}', '${this.escapeHtml(item.id)}')">
                    <h4>${highlightedTitle}</h4>
                    <p>${highlightedContent}</p>
                    <small>Categoria: ${this.escapeHtml(item.category)}</small>
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
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.classList.remove('show');
        }

        // Limpar campo de busca
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
        }

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

// Inicializar o sistema de busca
document.addEventListener('DOMContentLoaded', () => {
    window.searchSystem = new SearchSystem();
});

// Exportar para uso em outros módulos se estiver usando ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchSystem;
}