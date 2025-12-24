// Gerenciamento de animações e interações
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntroModal(); // Setup intro modal first to ensure it works properly
        this.setupIntersectionObserver();
        this.setupSkillAnimations();
        this.setupVisitorCounter();
        this.setupGame();
        this.setupTestimonialCarousel();
        this.setupTooltips();
        this.setupMicroInteractions();
    }

    // Efeito para elementos ao aparecerem no viewport
    setupIntersectionObserver() {
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
    }

    // Função para animar barras de habilidades quando visíveis
    setupSkillAnimations() {
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
    }

    // Intro Modal functionality
    setupIntroModal() {
        const introModal = document.getElementById('intro-modal');
        const enterBtn = document.getElementById('enter-btn');
        const skipBtn = document.getElementById('skip-btn');

        if (!introModal) return; // Sair se o modal não existir

        // Function to scroll to 'sobre' section
        function scrollToSobre() {
            const sobreSection = document.getElementById('sobre');
            if (sobreSection) {
                // Rolar diretamente para a seção 'sobre' com compensação do header
                const offsetTop = sobreSection.offsetTop - 100; // Compensar o header fixo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
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
        if (enterBtn) {
            enterBtn.addEventListener('click', hideIntroModal);
        }

        // Event listener for the Skip button
        if (skipBtn) {
            skipBtn.addEventListener('click', hideIntroModal);
        }

        // Also allow clicking anywhere on the modal to enter (except the button area to avoid double action)
        introModal.addEventListener('click', function(e) {
            if (e.target === introModal) {
                hideIntroModal();
            }
        });

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
    }

    // Visitor counter functionality using CountAPI
    setupVisitorCounter() {
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
                            visitorCountElement.textContent = Utils.formatNumber(data.value);
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
                        visitorCountElement.textContent = Utils.formatNumber(count);
                    });
            }
        });
    }

    // Jogo Interativo - Adivinhe o Número
    setupGame() {
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

            if (!guessInputEl) return; // Se o jogo não estiver presente na página, sair

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
                if (attemptsEl) attemptsEl.textContent = attempts;

                // Atualizar barra de progresso (quanto mais tentativas, menor a precisão)
                const precision = Math.max(0, 100 - (attempts * 10));
                if (progressFillEl) progressFillEl.style.width = `${precision}%`;
                if (progressTextEl) progressTextEl.textContent = `${precision}% de precisão`;
            }

            // Função para verificar o palpite
            function checkGuess() {
                if (!gameActive) return;

                const userGuess = parseInt(guessInputEl.value);

                // Validação de entrada
                if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
                    if (feedbackEl) {
                        feedbackEl.textContent = 'Por favor, digite um número entre 1 e 100';
                        feedbackEl.className = 'feedback error';
                    }
                    return;
                }

                attempts++;
                updateDisplay();

                if (userGuess === targetNumber) {
                    // Jogador venceu!
                    if (feedbackEl) {
                        feedbackEl.textContent = `Parabéns! O número era ${targetNumber}`;
                        feedbackEl.className = 'feedback success';
                    }
                    if (cluesEl) {
                        cluesEl.textContent = `Você acertou em ${attempts} tentativa${attempts > 1 ? 's' : ''}!`;
                    }

                    gameActive = false;

                    // Celebrar com uma pequena animação
                    if (feedbackEl) {
                        feedbackEl.style.transform = 'scale(1.1)';
                        setTimeout(() => {
                            feedbackEl.style.transform = 'scale(1)';
                        }, 500);
                    }

                } else if (attempts >= maxAttempts) {
                    // Jogador perdeu por exceder tentativas
                    if (feedbackEl) {
                        feedbackEl.textContent = `Fim de jogo! O número era ${targetNumber}`;
                        feedbackEl.className = 'feedback error';
                    }
                    if (cluesEl) {
                        cluesEl.textContent = `Você usou todas as ${maxAttempts} tentativas`;
                    }
                    gameActive = false;

                } else {
                    // Jogador ainda está tentando
                    if (userGuess < targetNumber) {
                        if (feedbackEl) {
                            feedbackEl.textContent = 'Muito baixo! Tente um número maior';
                            feedbackEl.className = 'feedback';
                        }
                        if (cluesEl) {
                            cluesEl.textContent = `O número é maior que ${userGuess}`;
                        }
                    } else {
                        if (feedbackEl) {
                            feedbackEl.textContent = 'Muito alto! Tente um número menor';
                            feedbackEl.className = 'feedback';
                        }
                        if (cluesEl) {
                            cluesEl.textContent = `O número é menor que ${userGuess}`;
                        }
                    }

                    // Atualizar a barra de progresso com base em quão perto está
                    const difference = Math.abs(userGuess - targetNumber);
                    const proximityPercent = Math.max(0, 100 - (difference * 2));
                    if (progressFillEl) progressFillEl.style.width = `${proximityPercent}%`;
                    if (progressTextEl) progressTextEl.textContent = `Aproximação: ${Math.max(0, 100 - difference * 2).toFixed(0)}%`;
                }

                // Limpar campo de entrada
                guessInputEl.value = '';
                guessInputEl.focus();
            }

            // Eventos
            if (submitBtn) {
                submitBtn.addEventListener('click', checkGuess);
            }

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
    }

    // Função para inicializar o carrossel de depoimentos
    setupTestimonialCarousel() {
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

    // Adicionar tooltips personalizados
    setupTooltips() {
        // Adiciona tooltips a links de navegação
        document.querySelectorAll('nav a').forEach(link => {
            const title = link.textContent.trim();
            link.setAttribute('title', `Ir para ${title}`);
        });
    }

    // Adicionar micro-interações e animações mais sofisticadas
    setupMicroInteractions() {
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
    }
}

// Inicializar o gerenciador de animações
document.addEventListener('DOMContentLoaded', () => {
    new AnimationManager();
});

// Exportar para uso em outros módulos se estiver usando ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}