// Sistema de validação avançada para formulários
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.errors = {};
        this.init();
    }

    init() {
        if (!this.form) return;
        
        // Adicionar eventos de validação em tempo real
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
        
        // Validar o formulário antes de submeter
        this.form.addEventListener('submit', (e) => {
            if (!this.validateForm()) {
                e.preventDefault();
            }
        });
    }

    validateField(field) {
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';

        // Validar campos obrigatórios
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        }
        
        // Validar email
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Por favor, insira um email válido';
            }
        }
        
        // Validar tamanho máximo
        if (field.maxLength && field.value.length > field.maxLength) {
            isValid = false;
            errorMessage = `Máximo de ${field.maxLength} caracteres excedido`;
        }
        
        // Validar tamanho mínimo
        if (field.minLength && field.value.length < field.minLength) {
            isValid = false;
            errorMessage = `Mínimo de ${field.minLength} caracteres não atingido`;
        }

        if (!isValid) {
            this.errors[fieldName] = errorMessage;
            this.showError(field, errorMessage);
        } else {
            delete this.errors[fieldName];
            this.clearError(field);
        }

        return isValid;
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    showError(field, message) {
        // Remover mensagem de erro existente
        this.clearError(field);
        
        // Adicionar classe de erro ao campo
        field.classList.add('error');
        
        // Criar elemento de mensagem de erro
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.fontStyle = 'italic';
        
        // Inserir após o campo
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    clearError(field) {
        field.classList.remove('error');
        
        // Remover mensagem de erro existente
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Método para obter todos os erros
    getErrors() {
        return { ...this.errors };
    }

    // Método para verificar se há erros
    hasErrors() {
        return Object.keys(this.errors).length > 0;
    }
}

// Estilos para campos com erro
const addFieldErrorStyles = () => {
    if (!document.querySelector('#field-error-styles')) {
        const style = document.createElement('style');
        style.id = 'field-error-styles';
        style.textContent = `
            input.error, textarea.error {
                border-color: #dc3545 !important;
                box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
            }
        `;
        document.head.appendChild(style);
    }
};

// Adicionar estilos quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', addFieldErrorStyles);

// Exportar para uso em outros módulos se estiver usando ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}