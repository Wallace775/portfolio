// Gerenciamento do formulário de contato
class ContactFormManager {
    constructor() {
        this.validator = new FormValidator('contactForm');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Mostrar mensagem de carregamento
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;

        // Pegar os valores dos campos
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Validação simples
        if (!name || !email || !subject || !message) {
            this.showErrorMessage('Por favor, preencha todos os campos obrigatórios.');
            
            // Resetar botão
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            return;
        }

        // Validação de email
        if (!Utils.validateEmail(email)) {
            this.showErrorMessage('Por favor, insira um email válido.');
            
            // Resetar botão
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            return;
        }

        try {
            // Enviar dados para a API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, subject, message })
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccessMessage(result.message);
                // Resetar o formulário após envio
                e.target.reset();
            } else {
                this.showErrorMessage(result.message);
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            this.showErrorMessage('Erro de rede. Por favor, verifique sua conexão e tente novamente.');
        } finally {
            // Resetar botão
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    showErrorMessage(message) {
        if (window.notificationManager) {
            window.notificationManager.error(message);
        } else {
            const form = document.getElementById('contactForm');
            this.showMessage(message, 'error', form);
        }
    }

    showSuccessMessage(message) {
        if (window.notificationManager) {
            window.notificationManager.success(message);
        } else {
            const form = document.getElementById('contactForm');
            this.showMessage(message, 'success', form);
        }
    }

    showMessage(text, type, parentElement) {
        // Remover mensagens anteriores
        const existingMessages = parentElement.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.setAttribute('role', 'alert');
        messageElement.setAttribute('aria-live', 'assertive');
        messageElement.textContent = text;

        // Estilizar mensagem
        messageElement.style.color = type === 'error' ? 'red' : 'green';
        messageElement.style.marginTop = '10px';
        messageElement.style.fontWeight = 'bold';
        messageElement.style.padding = '10px';
        messageElement.style.border = `1px solid ${type === 'error' ? 'red' : 'green'}`;
        messageElement.style.borderRadius = '5px';
        messageElement.style.backgroundColor = type === 'error' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)';
        messageElement.classList.add('form-message'); // Para facilitar remoção

        // Adicionar mensagem ao topo do formulário
        parentElement.insertBefore(messageElement, parentElement.firstChild);

        // Focar na mensagem para leitura por leitores de tela
        messageElement.focus();
    }
}

// Inicializar o gerenciador do formulário de contato
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormManager();
});

// Exportar para uso em outros módulos se estiver usando ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactFormManager;
}