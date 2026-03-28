// Utilitários gerais para o portfólio - Versão simplificada sem animações
class Utils {
    // Função para rolar instantaneamente para um elemento
    static scrollToElement(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'instant'
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