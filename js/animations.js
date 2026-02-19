// Gerenciamento de animações e interações
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntroModal();
        this.setupIntersectionObserver();
        this.setupSkillAnimations();
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