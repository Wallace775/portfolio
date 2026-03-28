/**
 * Contact Form Module
 * 
 * Responsável por gerenciar o formulário de contato
 * com integração EmailJS e API backend.
 */

class ContactForm {
    constructor(config) {
        this.config = config;
        this.emailjsLoaded = false;
        this.init();
    }

    /**
     * Inicializar o módulo
     */
    init() {
        // Carregar SDK do EmailJS dinamicamente
        this.loadEmailJSSDK();
        
        // Configurar eventos do formulário
        this.setupFormEvents();
    }

    /**
     * Carregar SDK do EmailJS dinamicamente
     */
    loadEmailJSSDK() {
        // Verificar se já existe
        if (window.emailjs) {
            this.emailjsLoaded = true;
            console.log('[ContactForm] EmailJS já carregado');
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.async = true;
        
        script.onload = () => {
            // Inicializar EmailJS
            if (this.config.emailjs.publicKey !== 'SUA_PUBLIC_KEY_AQUI') {
                window.emailjs.init(this.config.emailjs.publicKey);
                this.emailjsLoaded = true;
                console.log('[ContactForm] EmailJS inicializado com sucesso');
            } else {
                console.warn('[ContactForm] EmailJS não configurado. Edite api-config.js');
            }
        };
        
        script.onerror = () => {
            console.error('[ContactForm] Erro ao carregar EmailJS SDK');
        };
        
        document.head.appendChild(script);
    }

    /**
     * Configurar eventos do formulário
     */
    setupFormEvents() {
        const form = document.getElementById('contactForm');
        
        if (!form) {
            console.warn('[ContactForm] Formulário não encontrado');
            return;
        }

        form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Adicionar validação em tempo real
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    /**
     * Validar campo individual
     */
    validateField(field) {
        const value = field.value.trim();
        let error = null;

        // Validação de campo obrigatório
        if (field.hasAttribute('required') && !value) {
            error = 'Este campo é obrigatório';
        }
        // Validação de email
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = 'Digite um email válido';
            }
        }
        // Validação de tamanho mínimo
        else if (field.minLength > 0 && value.length < field.minLength) {
            error = `Mínimo de ${field.minLength} caracteres`;
        }

        if (error) {
            this.showFieldError(field, error);
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
    }

    /**
     * Mostrar erro no campo
     */
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    /**
     * Limpar erro do campo
     */
    clearFieldError(field) {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    /**
     * Validar formulário completo
     */
    validateForm(form) {
        const inputs = form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Handler de submit do formulário
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        
        // Validar formulário
        if (!this.validateForm(form)) {
            this.showNotification('Por favor, corrija os erros no formulário', 'error');
            return;
        }

        // Coletar dados
        const formData = {
            name: form.querySelector('[name="name"]')?.value.trim() || '',
            email: form.querySelector('[name="email"]')?.value.trim() || '',
            subject: form.querySelector('[name="subject"]')?.value.trim() || '',
            message: form.querySelector('[name="message"]')?.value.trim() || ''
        };

        // Desabilitar botão
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;

        try {
            // Tentar enviar com EmailJS primeiro
            if (this.emailjsLoaded && this.config.emailjs.publicKey !== 'SUA_PUBLIC_KEY_AQUI') {
                await this.sendWithEmailJS(formData);
                this.showNotification('Mensagem enviada com sucesso!', 'success');
                form.reset();
            } else {
                // Fallback para API backend
                await this.sendWithAPI(formData);
                this.showNotification('Mensagem enviada com sucesso!', 'success');
                form.reset();
            }
        } catch (error) {
            console.error('[ContactForm] Erro:', error);
            this.showNotification(
                error.message || 'Erro ao enviar mensagem. Tente novamente ou envie um email direto para wallacephellipe03@gmail.com',
                'error'
            );
        } finally {
            // Restaurar botão
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    /**
     * Enviar via EmailJS
     */
    async sendWithEmailJS(data) {
        if (!window.emailjs) {
            throw new Error('EmailJS não está disponível');
        }

        const { serviceId, templateId } = this.config.emailjs;

        if (serviceId === 'SEU_SERVICE_ID_AQUI' || templateId === 'SEU_TEMPLATE_ID_AQUI') {
            throw new Error('EmailJS não configurado. Verifique api-config.js');
        }

        const templateParams = {
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: data.message,
            to_name: 'Wallace Phellipe',
            reply_to: data.email
        };

        const response = await window.emailjs.send(serviceId, templateId, templateParams);
        
        if (response.status !== 200) {
            throw new Error('Erro ao enviar email');
        }

        return response;
    }

    /**
     * Enviar via API backend
     */
    async sendWithAPI(data) {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Erro ao enviar mensagem');
        }

        return result;
    }

    /**
     * Mostrar notificação
     */
    showNotification(message, type = 'info') {
        // Verificar se existe sistema de notificações
        if (window.notificationsAPI) {
            window.notificationsAPI.show(message, type);
            return;
        }

        // Fallback: criar notificação simples
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Estilos inline para fallback
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            backgroundColor: type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1',
            color: type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460',
            border: `1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideIn 0.3s ease-out',
            maxWidth: '400px'
        });

        document.body.appendChild(notification);

        // Remover após 5 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    /**
     * Limpar formulário
     */
    clearForm() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.reset();
            const errors = form.querySelectorAll('.field-error');
            errors.forEach(error => error.remove());
            const inputs = form.querySelectorAll('input.error, textarea.error');
            inputs.forEach(input => input.classList.remove('error'));
        }
    }
}

// Instanciar e exportar
const contactForm = new ContactForm(API_CONFIG);
window.contactForm = contactForm;
