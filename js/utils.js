// Utilitários gerais para o portfólio
class Utils {
    // Função para animar transição de página
    static animatePageTransition(callback) {
        const transition = this.createPageTransition();

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

    // Criar o elemento de transição de página
    static createPageTransition() {
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        document.body.appendChild(transition);
        return transition;
    }

    // Função para rolar suavemente para um elemento
    static scrollToElement(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 100; // Compensar o header fixo com mais margem
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // Função para obter parâmetros da URL
    static getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Função para detectar se é mobile
    static isMobile() {
        return window.innerWidth <= 768;
    }

    // Função para formatar números com separadores
    static formatNumber(num) {
        return num.toLocaleString();
    }

    // Função para validar email
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Função para debounce
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Exportar para uso em outros módulos se estiver usando ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}