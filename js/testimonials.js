// Sistema de depoimentos para o portfólio
class TestimonialManager {
    constructor() {
        this.testimonials = [
            {
                id: 1,
                name: "Ana Silva",
                role: "Instrutora na Mate Academy",
                content: "Wallace é um profissional extremamente dedicado e focado em aprendizado contínuo. Durante nosso trabalho em equipe, demonstrou grande habilidade para resolver problemas complexos e colaborar efetivamente.",
                avatar: ""
            },
            {
                id: 2,
                name: "Carlos Oliveira",
                role: "Colega de Turma",
                content: "Trabalhar com Wallace no projeto de automação foi uma experiência excelente. Ele demonstra grande capacidade analítica e comprometimento com a qualidade do código.",
                avatar: ""
            },
            {
                id: 3,
                name: "Fernanda Costa",
                role: "Líder Técnica na Tahto",
                content: "Wallace trouxe soluções inovadoras para desafios técnicos em nossa equipe. Sua transição de carreira do suporte técnico para desenvolvimento é inspiradora e demonstra sua determinação.",
                avatar: ""
            },
            {
                id: 4,
                name: "Ricardo Santos",
                role: "Colega de Estudos",
                content: "Durante meus estudos com Wallace, pude observar sua metodologia de aprendizado e como ele compartilha conhecimento com colegas. É alguém que realmente se importa com o crescimento conjunto.",
                avatar: ""
            },
            {
                id: 5,
                name: "José Almeida",
                role: "Gerente de Projetos",
                content: "Wallace tem um perfil muito voltado para resolução de problemas e é uma pessoa com quem posso contar para entregar projetos com qualidade e dentro do prazo.",
                avatar: ""
            },
            {
                id: 6,
                name: "Maria Fernanda",
                role: "Colega de Turma",
                content: "Como colega de turma, pude observar o empenho de Wallace em aprender e aplicar novos conceitos de programação. É um profissional que está sempre disposto a ajudar e compartilhar conhecimento.",
                avatar: ""
            }
        ];
        this.currentTestimonialIndex = 0;
        this.init();
    }

    init() {
        this.renderTestimonials();
        this.setupCarousel();
        this.setupObserver();
    }

    renderTestimonials() {
        const testimonialsContainer = document.querySelector('.testimonials-container');
        if (!testimonialsContainer) return;

        // Renderizar todos os depoimentos
        testimonialsContainer.innerHTML = `
            <div class="testimonials-grid">
                ${this.testimonials.map((testimonial, index) => `
                    <div class="testimonial" role="article" aria-labelledby="testimonial${testimonial.id}">
                        <div class="testimonial-content" id="testimonial${testimonial.id}">
                            <p>${testimonial.content}</p>
                        </div>
                        <div class="testimonial-author" role="complementary" aria-label="Autor do depoimento">
                            <div class="author-info">
                                <h4>${testimonial.name}</h4>
                                <p>${testimonial.role}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    setupCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');

        if (slides.length === 0) return;

        // Atualizar os slides do carrossel com depoimentos reais
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.innerHTML = this.testimonials.slice(0, 3).map((testimonial, index) => `
                <div class="carousel-slide ${index === 0 ? 'active' : ''}">
                    <div class="testimonial-content">
                        <p>${testimonial.content}</p>
                    </div>
                    <div class="testimonial-author">
                        <div class="author-info">
                            <h4>${testimonial.name}</h4>
                            <p>${testimonial.role}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Atualizar os dots do carrossel
        const dotsContainer = document.querySelector('.carousel-dots');
        if (dotsContainer) {
            dotsContainer.innerHTML = this.testimonials.slice(0, 3).map((_, index) => `
                <button class="dot ${index === 0 ? 'active' : ''}" aria-label="Ir para depoimento ${index + 1}" data-slide="${index}"></button>
            `).join('');
        }

        // Atualizar referências após recriar elementos
        const newSlides = document.querySelectorAll('.carousel-slide');
        const newDots = document.querySelectorAll('.dot');
        const newPrevBtn = document.querySelector('.carousel-btn.prev');
        const newNextBtn = document.querySelector('.carousel-btn.next');

        let currentIndex = 0;
        const totalSlides = newSlides.length;

        // Função para mostrar slide específico
        const showSlide = (index) => {
            // Remover classe ativa de todos os slides
            newSlides.forEach(slide => slide.classList.remove('active'));
            // Remover classe ativa de todos os dots
            newDots.forEach(dot => dot.classList.remove('active'));

            // Atualizar slide
            newSlides[index].classList.add('active');
            // Atualizar dot
            newDots[index].classList.add('active');

            currentIndex = index;
        };

        // Event listeners para os botões
        if (newPrevBtn) {
            newPrevBtn.addEventListener('click', () => {
                const newIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
                showSlide(newIndex);
            });
        }

        if (newNextBtn) {
            newNextBtn.addEventListener('click', () => {
                const newIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
                showSlide(newIndex);
            });
        }

        // Event listeners para os dots
        newDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });

        // Auto-avancar o carrossel a cada 7 segundos
        setInterval(() => {
            const newIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
            showSlide(newIndex);
        }, 7000);
    }

    setupObserver() {
        // Observar a seção de depoimentos para carregar quando visível
        const testimonialSection = document.getElementById('depoimentos');
        if (testimonialSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.renderTestimonials();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(testimonialSection);
        }
    }
}

// Inicializar o gerenciador de depoimentos
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialManager();
});

// Exportar para uso em outros módulos se estiver usando ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestimonialManager;
}