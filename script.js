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

// Adicionar efeito de scroll para adicionar classe ao header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

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
            const targetElement = document.querySelector(url);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'instant' });

                if (id) {
                    const targetItem = document.querySelector(`#${id}`) ||
                                      document.querySelector(`[data-id="${id}"]`);
                    if (targetItem) {
                        targetItem.scrollIntoView({ behavior: 'instant', block: 'center' });
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
        // Função mantida para compatibilidade futura
        console.log('Métrica:', metric);
    }

    updateDynamicStats() {
        // Atualizar estatísticas dinamicamente se for necessário
        // Função placeholder para futuras implementações
    }
}

// Inicializar o sistema de estatísticas
const statsSystem = new StatsSystem();
window.statsSystem = statsSystem;

// Implementar transições de página mais suaves ao rolar
function updateScrollState() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateScrollState);

// Inicializar estado de scroll
document.addEventListener('DOMContentLoaded', () => {
    updateScrollState();
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
    const interactiveElements = document.querySelectorAll('a, button, .skill-card, .stat, .education-item');

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



