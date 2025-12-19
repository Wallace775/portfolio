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

// Validação e envio do formulário de contato
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Pegar os valores dos campos
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Validação simples
    if (!name || !email || !subject || !message) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um email válido.');
        return;
    }
    
    // Simular envio (em um projeto real, você conectaria a um serviço de backend)
    alert('Obrigado pela sua mensagem! Em um ambiente real, ela seria enviada para um servidor.');
    
    // Resetar o formulário após envio
    this.reset();
});

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
    const progressFill = document.getElementById('progress-fill');

    // Function to scroll to 'sobre' section
    function scrollToSobre() {
        // Use a abordagem mais robusta para garantir o scroll
        setTimeout(() => {
            const sobreSection = document.getElementById('sobre');
            if (sobreSection) {
                // Para garantir no mobile, tentar diferentes métodos
                sobreSection.scrollIntoView({
                    behavior: 'instant',  // instant em vez de 'auto' para garantir
                    block: 'start'
                });

                // Como fallback, também definir scrollTop
                window.scrollTo({
                    top: sobreSection.offsetTop,
                    behavior: 'instant'
                });
            }

            // Highlight 'Sobre' link as active
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#sobre') {
                    link.classList.add('active');
                }
            });
        }, 100);
    }

    // Check if modal has been shown in this session
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');

    if (!hasSeenIntro) {
        // Start the progress animation
        setTimeout(() => {
            progressFill.style.transition = 'width 3s linear';
            progressFill.style.width = '100%';
        }, 500);

        // Auto-hide after 3.5 seconds if not already clicked
        setTimeout(() => {
            if (introModal.style.display !== 'none') {
                hideIntroModal();
            }
        }, 3500);
    } else {
        // If user has seen intro, hide it immediately and scroll to 'sobre'
        introModal.style.display = 'none';
        scrollToSobre();
    }

    // Function to hide the intro modal
    function hideIntroModal() {
        introModal.style.opacity = '0';
        setTimeout(() => {
            introModal.style.display = 'none';
            scrollToSobre();
        }, 500);
        localStorage.setItem('hasSeenIntro', 'true');
    }

    // Event listener for the Enter button
    enterBtn.addEventListener('click', hideIntroModal);

    // Also allow clicking anywhere on the modal to enter
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

// Função para forçar scroll para seção "Sobre" após intro
function forceScrollToSobre() {
    setTimeout(() => {
        const sobreSection = document.getElementById('sobre');
        if (sobreSection) {
            // Método mais robusto para forçar o scroll
            window.scrollTo({
                top: sobreSection.offsetTop - 70, // compensar o header fixo
                behavior: 'instant'
            });

            // Destacar o link "Sobre" como ativo
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#sobre') {
                    link.classList.add('active');
                }
            });
        }
    }, 100);
}

// Forçar scroll para "Sobre" em dispositivos móveis após intro
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se é um dispositivo móvel
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Em dispositivos móveis, adicionar um timer para certificar que o scroll ocorre
        setTimeout(() => {
            const introModal = document.querySelector('#intro-modal');
            if (!introModal || introModal.style.display === 'none') {
                forceScrollToSobre();
            }
        }, 1500); // Atraso maior para garantir que a intro foi completamente removida
    }
});


