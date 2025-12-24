// Arquivo de internacionalização (i18n)
class I18n {
    constructor() {
        this.currentLanguage = 'pt';
        this.supportedLanguages = ['pt', 'en'];
        this.translations = {
            pt: {
                // Traduções em português
                'contact-form-title': 'Envie uma Mensagem',
                'contact-name': 'Nome',
                'contact-email': 'E-mail',
                'contact-subject': 'Assunto',
                'contact-message': 'Mensagem',
                'contact-send': 'Enviar Mensagem',
                'testimonial-title': 'Depoimentos',
                'blog-title': 'Blog',
                'portfolio-title': 'Portfólio',
                'about-title': 'Sobre Mim',
                'skills-title': 'Habilidades',
                'experience-title': 'Experiência',
                'education-title': 'Formação',
                'courses-title': 'Cursos',
                'contact-title': 'Contato',
                'github-title': 'Atividades no GitHub',
                'game-title': 'Demonstração Técnica',
                'welcome-text': 'Wallace Phellipe',
                'developer-title': 'Desenvolvedor Front-end Júnior | Em transição para desenvolvimento',
                'cta-button': 'Entrar em Contato',
                'github-button': 'Ver GitHub',
                'contact-button': 'Pular Introdução'
            },
            en: {
                // Traduções em inglês
                'contact-form-title': 'Send a Message',
                'contact-name': 'Name',
                'contact-email': 'Email',
                'contact-subject': 'Subject',
                'contact-message': 'Message',
                'contact-send': 'Send Message',
                'testimonial-title': 'Testimonials',
                'blog-title': 'Blog',
                'portfolio-title': 'Portfolio',
                'about-title': 'About Me',
                'skills-title': 'Skills',
                'experience-title': 'Experience',
                'education-title': 'Education',
                'courses-title': 'Courses',
                'contact-title': 'Contact',
                'github-title': 'GitHub Activities',
                'game-title': 'Technical Demo',
                'welcome-text': 'Wallace Phellipe',
                'developer-title': 'Front-end Junior Developer | Transitioning to development',
                'cta-button': 'Get in Touch',
                'github-button': 'View GitHub',
                'contact-button': 'Skip Introduction'
            }
        };
    }

    // Define o idioma atual
    setLanguage(lang) {
        if (this.supportedLanguages.includes(lang)) {
            this.currentLanguage = lang;
            this.updatePageContent();
            // Salva a preferência do usuário
            localStorage.setItem('language', lang);
        }
    }

    // Obtém a tradução de uma chave
    t(key) {
        const lang = this.translations[this.currentLanguage];
        return lang && lang[key] ? lang[key] : key;
    }

    // Atualiza o conteúdo da página com base no idioma
    updatePageContent() {
        // Atualiza todos os elementos com atributo data-i18n
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            element.textContent = translation;
        });
        
        // Atualiza placeholders
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            element.placeholder = translation;
        });
        
        // Atualiza títulos
        const titles = document.querySelectorAll('[data-i18n-title]');
        titles.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.t(key);
            element.title = translation;
        });
        
        // Atualiza textos alternativos
        const alts = document.querySelectorAll('[data-i18n-alt]');
        alts.forEach(element => {
            const key = element.getAttribute('data-i18n-alt');
            const translation = this.t(key);
            element.alt = translation;
        });
    }

    // Inicializa o sistema de i18n
    init() {
        // Verifica o idioma salvo ou detecta o idioma do navegador
        const savedLang = localStorage.getItem('language');
        const browserLang = navigator.language.substring(0, 2);
        
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.setLanguage(savedLang);
        } else if (this.supportedLanguages.includes(browserLang)) {
            this.setLanguage(browserLang);
        }
        
        // Adiciona o seletor de idioma à página
        this.addLanguageSelector();
    }

    // Adiciona o seletor de idiomas ao DOM
    addLanguageSelector() {
        // Encontra ou cria um container para o seletor de idioma
        let selectorContainer = document.getElementById('language-selector');
        if (!selectorContainer) {
            // Se não encontrar, cria um e adiciona no header
            const header = document.querySelector('header');
            if (header) {
                selectorContainer = document.createElement('div');
                selectorContainer.id = 'language-selector';
                selectorContainer.className = 'language-selector';
                selectorContainer.style.position = 'absolute';
                selectorContainer.style.top = '20px';
                selectorContainer.style.left = '20px';
                selectorContainer.style.zIndex = '1001';
                
                header.appendChild(selectorContainer);
            }
        }
        
        if (selectorContainer) {
            selectorContainer.innerHTML = `
                <select id="lang-select" onchange="i18nInstance.setLanguage(this.value)">
                    <option value="pt" ${this.currentLanguage === 'pt' ? 'selected' : ''}>Português</option>
                    <option value="en" ${this.currentLanguage === 'en' ? 'selected' : ''}>English</option>
                </select>
            `;
        }
    }
}

// Inicializa o sistema de internacionalização
const i18nInstance = new I18n();
document.addEventListener('DOMContentLoaded', () => {
    i18nInstance.init();
});

// Torna a instância globalmente acessível
window.i18n = i18nInstance;
window.i18nInstance = i18nInstance;