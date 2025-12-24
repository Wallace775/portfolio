const { 
    validateEmail, 
    isBetween, 
    getFormattedDate, 
    countWords, 
    containsKeywords 
} = require('./utils');

describe('Testes das funções utilitárias', () => {
    describe('validateEmail', () => {
        test('deve retornar true para e-mails válidos', () => {
            expect(validateEmail('test@example.com')).toBe(true);
            expect(validateEmail('user.name@domain.co.uk')).toBe(true);
            expect(validateEmail('user+tag@example.org')).toBe(true);
        });

        test('deve retornar false para e-mails inválidos', () => {
            expect(validateEmail('invalid-email')).toBe(false);
            expect(validateEmail('')).toBe(false);
            expect(validateEmail('test@')).toBe(false);
            expect(validateEmail('@example.com')).toBe(false);
        });
    });

    describe('isBetween', () => {
        test('deve retornar true quando o valor estiver dentro do intervalo', () => {
            expect(isBetween(5, 1, 10)).toBe(true);
            expect(isBetween(1, 1, 10)).toBe(true); // limite inferior
            expect(isBetween(10, 1, 10)).toBe(true); // limite superior
        });

        test('deve retornar false quando o valor estiver fora do intervalo', () => {
            expect(isBetween(0, 1, 10)).toBe(false);
            expect(isBetween(11, 1, 10)).toBe(false);
        });
    });

    describe('getFormattedDate', () => {
        test('deve formatar a data corretamente', () => {
            const date = new Date('2024-01-15');
            expect(getFormattedDate(date)).toBe('15/01/2024');
        });
    });

    describe('countWords', () => {
        test('deve contar palavras corretamente', () => {
            expect(countWords('Hello world')).toBe(2);
            expect(countWords('')).toBe(0);
            expect(countWords('   ')).toBe(0);
            expect(countWords('One')).toBe(1);
            expect(countWords('A B C')).toBe(3);
        });

        test('deve lidar com entradas inválidas', () => {
            expect(countWords(null)).toBe(0);
            expect(countWords(undefined)).toBe(0);
            expect(countWords(123)).toBe(0);
        });
    });

    describe('containsKeywords', () => {
        test('deve retornar true se o texto contiver alguma das palavras-chave', () => {
            expect(containsKeywords('This is a test', ['test', 'example'])).toBe(true);
            expect(containsKeywords('Hello World', ['world'])).toBe(true);
        });

        test('deve retornar false se o texto não contiver nenhuma das palavras-chave', () => {
            expect(containsKeywords('This is a test', ['example', 'sample'])).toBe(false);
            expect(containsKeywords('', ['test'])).toBe(false);
        });

        test('deve lidar com entradas inválidas', () => {
            expect(containsKeywords(null, ['test'])).toBe(false);
            expect(containsKeywords('test', null)).toBe(false);
        });
    });
});