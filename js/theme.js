// Gerenciamento de tema claro/escuro
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        this.checkSavedTheme();
        this.addEventListeners();
    }

    // Alternância de tema claro/escuro
    toggleTheme() {
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
    checkSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        const themeIcon = document.querySelector('#theme-toggle i');

        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        }
    }

    addEventListeners() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Inicializar o gerenciador de tema
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});

// Exportar para uso em outros módulos se estiver usando ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}