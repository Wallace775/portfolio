// Funções utilitárias para testes

// Função para validar email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para verificar se um número está em um intervalo
function isBetween(value, min, max) {
    return value >= min && value <= max;
}

// Função para obter data formatada
function getFormattedDate(date) {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Função para contar palavras em um texto
function countWords(text) {
    if (!text || typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Função para verificar se uma string contém palavras-chave
function containsKeywords(text, keywords) {
    if (!text || !keywords) return false;
    const textLower = text.toLowerCase();
    return keywords.some(keyword => textLower.includes(keyword.toLowerCase()));
}

module.exports = {
    validateEmail,
    isBetween,
    getFormattedDate,
    countWords,
    containsKeywords
};