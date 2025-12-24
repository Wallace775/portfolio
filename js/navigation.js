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

    // Smooth scrolling para links de âncora com transição
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                
                if (targetId === '#') return; // Não fazer nada se for link para o topo

                Utils.animatePageTransition(() => {
                    Utils.scrollToElement(targetId);
                });
            });
        });
    }

    // Adicionar efeito de scroll para adicionar classe ao header
    setupScrollHighlight() {
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

        window.addEventListener('scroll', Utils.debounce(requestTick, 100));

        // Inicializar estado de scroll
        document.addEventListener('DOMContentLoaded', () => {
            updateScrollState();
        });

        // Adicionar classe ao header quando rolar
        window.addEventListener('scroll', Utils.debounce(function() {
            const header = document.querySelector('header');
            if (header) {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        }, 100));
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