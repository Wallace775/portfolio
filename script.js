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