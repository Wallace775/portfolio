// Sistema de projetos para o portfólio
class PortfolioManager {
    constructor() {
        this.projects = [
            {
                id: 1,
                title: "Projeto 1: Página Pessoal",
                description: "Este site que você está acessando agora, demonstrando conhecimentos em HTML, CSS e JavaScript. Design responsivo, navegação suave e elementos interativos.",
                technologies: ["HTML", "CSS", "JavaScript"],
                githubUrl: "https://github.com/Wallace775/portfolio",
                demoUrl: "https://wallace775.github.io/portfolio/",
                category: "web",
                icon: "globe-americas"
            },
            {
                id: 2,
                title: "Projeto 2: To-do List em JavaScript",
                description: "Uma aplicação de lista de tarefas feita com JavaScript puro, demonstrando manipulação do DOM, armazenamento local (localStorage) e arquitetura modular.",
                technologies: ["JavaScript", "HTML", "CSS"],
                githubUrl: "https://github.com/Wallace775/todo-list",
                demoUrl: "#",
                category: "web",
                icon: "tasks"
            },
            {
                id: 3,
                title: "Projeto 3: Calculadora Simples",
                description: "Calculadora funcional com operações básicas e design moderno, implementada com HTML, CSS e JavaScript sem bibliotecas externas.",
                technologies: ["JavaScript", "HTML", "CSS"],
                githubUrl: "https://github.com/Wallace775/calculator",
                demoUrl: "#",
                category: "web",
                icon: "calculator"
            },
            {
                id: 4,
                title: "Projeto 4: Relógio Digital Analógico",
                description: "Relógio com apresentação digital e analógica, demonstrando manipulação de tempo e gráficos canvas em JavaScript.",
                technologies: ["JavaScript", "Canvas", "HTML", "CSS"],
                githubUrl: "https://github.com/Wallace775/clock",
                demoUrl: "#",
                category: "web",
                icon: "clock"
            },
            {
                id: 5,
                title: "Projeto 5: Gerador de Paletas de Cores",
                description: "Ferramenta para geração de paletas de cores com base em diferentes teorias de harmonia cromática, útil para designers e desenvolvedores.",
                technologies: ["JavaScript", "HTML", "CSS"],
                githubUrl: "https://github.com/Wallace775/color-palette",
                demoUrl: "#",
                category: "web",
                icon: "paint-brush"
            },
            {
                id: 6,
                title: "Projeto 6: Buscador de Imagens",
                description: "Aplicação que consome uma API pública de imagens e permite busca por termos específicos, demonstrando consumo de APIs REST.",
                technologies: ["JavaScript", "APIs", "HTML", "CSS"],
                githubUrl: "https://github.com/Wallace775/image-search",
                demoUrl: "#",
                category: "web",
                icon: "search"
            }
        ];
        this.init();
    }

    init() {
        this.renderProjects();
        this.setupFilter();
        this.setupObserver();
    }

    renderProjects(projects = this.projects) {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (!portfolioGrid) return;

        portfolioGrid.innerHTML = projects.map(project => `
            <div class="portfolio-card" data-category="${project.category}" role="article" aria-labelledby="project${project.id}-title">
                <div class="portfolio-icon" role="img" aria-label="Ícone de projeto">
                    <i class="fas fa-${project.icon}" aria-hidden="true"></i>
                </div>
                <h3 id="project${project.id}-title">${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="portfolio-links">
                    <a href="${project.githubUrl}" target="_blank" class="btn-github" aria-label="Repositório no GitHub para ${project.title}">
                        <i class="fab fa-github" aria-hidden="true"></i> GitHub
                    </a>
                    ${project.demoUrl !== "#" ? 
                        `<a href="${project.demoUrl}" target="_blank" class="btn-demo" aria-label="Demo para ${project.title}">
                            <i class="fas fa-external-link-alt" aria-hidden="true"></i> Demo
                        </a>` : ''}
                </div>
            </div>
        `).join('');
    }

    setupFilter() {
        // Adicionar controles de filtro se não existirem
        const portfolioSection = document.getElementById('portifolio');
        if (portfolioSection && !document.querySelector('.portfolio-filters')) {
            const container = portfolioSection.querySelector('.container');
            if (container) {
                const filtersHtml = `
                    <div class="portfolio-filters">
                        <button class="filter-btn active" data-filter="all">Todos</button>
                        <button class="filter-btn" data-filter="web">Web</button>
                    </div>
                `;
                container.insertAdjacentHTML('afterbegin', filtersHtml);
                
                // Adicionar eventos aos filtros
                document.querySelectorAll('.filter-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const filter = e.target.getAttribute('data-filter');
                        this.filterProjects(filter);
                        
                        // Atualizar classes ativas
                        document.querySelectorAll('.filter-btn').forEach(btn => {
                            btn.classList.remove('active');
                        });
                        e.target.classList.add('active');
                    });
                });
            }
        }
    }

    filterProjects(filter) {
        if (filter === 'all') {
            this.renderProjects(this.projects);
        } else {
            const filteredProjects = this.projects.filter(project => project.category === filter);
            this.renderProjects(filteredProjects);
        }
    }

    setupObserver() {
        // Observar a seção de portfólio para carregar quando visível
        const portfolioSection = document.getElementById('portifolio');
        if (portfolioSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.renderProjects();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(portfolioSection);
        }
    }
}

// Inicializar o gerenciador de portfólio
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioManager();
});

// Exportar para uso em outros módulos se estiver usando ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioManager;
}