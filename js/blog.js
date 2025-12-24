// Sistema de blog para o portfólio
class BlogManager {
    constructor() {
        this.posts = [
            {
                id: 1,
                title: "Meus Primeiros Passos com JavaScript",
                date: "15 de Dezembro de 2024",
                excerpt: "Hoje completei meu primeiro projeto com JavaScript puro, e estou empolgado com o progresso que estou fazendo na transição de carreira. O processo de aprendizado tem sido desafiador, mas extremamente gratificante...",
                content: "Hoje completei meu primeiro projeto com JavaScript puro, e estou empolgado com o progresso que estou fazendo na transição de carreira. O processo de aprendizado tem sido desafiador, mas extremamente gratificante. Comecei a entender conceitos fundamentais como manipulação do DOM, eventos e funções assíncronas. Cada pequeno projeto me aproxima mais do meu objetivo de me tornar um desenvolvedor front-end completo."
            },
            {
                id: 2,
                title: "Entendendo o Modelo de Caixa (Box Model) no CSS",
                date: "30 de Novembro de 2024",
                excerpt: "Após semanas estudando CSS, finalmente compreendi o conceito do Box Model. Este conceito fundamental foi um obstáculo para mim no início, mas agora faz total sentido e está me ajudando a criar layouts mais precisos...",
                content: "Após semanas estudando CSS, finalmente compreendi o conceito do Box Model. Este conceito fundamental foi um obstáculo para mim no início, mas agora faz total sentido e está me ajudando a criar layouts mais precisos. O Box Model é composto por: conteúdo (content), padding, border e margin. Entender como essas propriedades interagem foi essencial para resolver problemas de layout que eu vinha enfrentando."
            },
            {
                id: 3,
                title: "Minha Jornada para Ser Desenvolvedor Front-end",
                date: "10 de Novembro de 2024",
                excerpt: "Decidi escrever sobre minha jornada de transição de carreira da área de TI para desenvolvimento. Este texto serve como reflexão sobre os desafios, conquistas e lições aprendidas até agora...",
                content: "Decidi escrever sobre minha jornada de transição de carreira da área de TI para desenvolvimento. Este texto serve como reflexão sobre os desafios, conquistas e lições aprendidas até agora. Comecei na área de suporte técnico, onde desenvolvi habilidades de resolução de problemas e atendimento ao cliente. Agora, estou aplicando essas habilidades no desenvolvimento de soluções web."
            }
        ];
        this.init();
    }

    init() {
        this.renderBlogPosts();
        this.setupEventListeners();
    }

    renderBlogPosts() {
        const blogContainer = document.querySelector('.blog-posts');
        if (!blogContainer) return;

        blogContainer.innerHTML = this.posts.map(post => `
            <article class="blog-post" role="article" aria-labelledby="post${post.id}-title">
                <div class="blog-date">${post.date}</div>
                <h3 id="post${post.id}-title">${post.title}</h3>
                <p>${post.excerpt}</p>
                <button class="read-more" data-post-id="${post.id}">Ler mais</button>
            </article>
        `).join('');

        // Adicionar evento para os botões "Ler mais"
        document.querySelectorAll('.read-more').forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(e.target.getAttribute('data-post-id'));
                this.showPostModal(postId);
            });
        });
    }

    showPostModal(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        // Criar modal para exibir o post completo
        const modal = document.createElement('div');
        modal.className = 'blog-modal';
        modal.innerHTML = `
            <div class="blog-modal-content">
                <span class="blog-modal-close">&times;</span>
                <h2>${post.title}</h2>
                <div class="blog-date">${post.date}</div>
                <div class="blog-modal-body">
                    <p>${post.content}</p>
                </div>
            </div>
        `;

        // Estilizar o modal
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        modal.querySelector('.blog-modal-content').style.cssText = `
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 10px;
            max-width: 800px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;

        modal.querySelector('.blog-modal-close').style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 1.8rem;
            cursor: pointer;
            color: #333;
        `;

        modal.querySelector('h2').style.cssText = `
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        `;

        modal.querySelector('.blog-date').style.cssText = `
            color: #00509e;
            font-weight: bold;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        `;

        modal.querySelector('.blog-modal-body').style.cssText = `
            line-height: 1.7;
            color: var(--text-color);
        `;

        // Adicionar ao body
        document.body.appendChild(modal);

        // Eventos para fechar o modal
        modal.querySelector('.blog-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
            }
        });
    }

    setupEventListeners() {
        // Atualizar a renderização quando a seção de blog for visível
        const blogSection = document.getElementById('blog');
        if (blogSection) {
            const blogObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.renderBlogPosts();
                        blogObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            blogObserver.observe(blogSection);
        }
    }
}

// Inicializar o gerenciador de blog
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();
});

// Exportar para uso em outros módulos se estiver usando ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogManager;
}