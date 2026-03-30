// Gerenciamento de navegação
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollHighlight();
    }

    // Mobile menu toggle functionality
    setupMobileMenu() {
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
    }

    // Scroll instantâneo para links de âncora
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');

                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    // Usa scrollIntoView com block: 'start' para respeitar o scroll-margin-top do CSS
                    target.scrollIntoView({
                        behavior: 'instant',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Adicionar efeito de scroll para adicionar classe ao header
    setupScrollHighlight() {
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

        window.addEventListener('scroll', function() {
            updateScrollState();
        });

        document.addEventListener('DOMContentLoaded', () => {
            updateScrollState();
        });

        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            if (header) {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });
    }
}

// Inicializar o gerenciador de navegação
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
});

// Exportar para uso em outros módulos se estiver usando ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationManager;
}