// Gerenciamento de animações e interações - Versão simplificada sem animações
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntroModal();
    }

    // Intro Modal functionality
    setupIntroModal() {
        const introModal = document.getElementById('intro-modal');
        const enterBtn = document.getElementById('enter-btn');
        const skipBtn = document.getElementById('skip-btn');

        if (!introModal) return;

        function scrollToSobre() {
            const sobreSection = document.getElementById('sobre');
            if (sobreSection) {
                const offsetTop = sobreSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'instant'
                });

                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#sobre') {
                        link.classList.add('active');
                    }
                });
            }
        }

        function hideIntroModal() {
            introModal.style.display = 'none';
            introModal.style.opacity = '0';
            introModal.style.visibility = 'hidden';
            scrollToSobre();
            localStorage.setItem('hasSeenIntro', 'true');
        }

        if (enterBtn) {
            enterBtn.addEventListener('click', hideIntroModal);
        }

        if (skipBtn) {
            skipBtn.addEventListener('click', hideIntroModal);
        }

        const hasSeenIntro = localStorage.getItem('hasSeenIntro');

        if (!hasSeenIntro) {
            setTimeout(() => {
                if (introModal.style.display !== 'none') {
                    hideIntroModal();
                }
            }, 500);
        } else {
            introModal.style.display = 'none';
            introModal.style.opacity = '0';
            introModal.style.visibility = 'hidden';
            scrollToSobre();
        }
        
        // Garantir que o modal não está bloqueando o conteúdo
        setTimeout(() => {
            introModal.style.display = 'none';
            introModal.style.opacity = '0';
            introModal.style.visibility = 'hidden';
        }, 100);
    }
}

// Inicializar o gerenciador de animações
document.addEventListener('DOMContentLoaded', () => {
    new AnimationManager();
    
    // Garantir que todo o conteúdo esteja visível
    document.querySelectorAll('.section').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.display = 'flex';
    });
    document.querySelectorAll('main, body').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.display = 'block';
    });
});

// Exportar para uso em outros módulos se estiver usando ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}