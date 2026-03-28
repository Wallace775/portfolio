/**
 * Configuração de APIs do Portfólio
 * 
 * Este arquivo contém todas as configurações de APIs utilizadas no projeto.
 * Substitua os valores pelos seus dados reais.
 */

const API_CONFIG = {
    // Configuração da API do GitHub
    github: {
        username: 'Wallace775', // Seu usuário do GitHub
        baseUrl: 'https://api.github.com',
        endpoints: {
            repos: '/users/{username}/repos',
            user: '/users/{username}',
            events: '/users/{username}/events/public'
        },
        // Repositórios para destacar (opcional - deixe vazio para pegar todos)
        featuredRepos: [
            // Adicione os IDs ou nomes dos repositórios que quer destacar
            // 'portfolio',
            // 'projeto-exemplo'
        ]
    },

    // Configuração do EmailJS (formulário de contato)
    emailjs: {
        // Para usar, crie uma conta em https://www.emailjs.com/
        // e substitua pelos seus dados
        publicKey: 'SUA_PUBLIC_KEY_AQUI', // Ex: 'user_XXXXXXXXXXXXXXXXXXXXX'
        serviceId: 'SEU_SERVICE_ID_AQUI', // Ex: 'service_XXXXXXXX'
        templateId: 'SEU_TEMPLATE_ID_AQUI' // Ex: 'template_XXXXXXXX'
    },

    // Configuração de APIs de dados dinâmicos
    dynamicData: {
        // API de clima (OpenWeatherMap - gratuita até 60 chamadas/min)
        // Crie uma conta em https://openweathermap.org/api
        weather: {
            apiKey: 'SUA_API_KEY_AQUI',
            city: 'São Paulo', // Sua cidade
            units: 'metric' // 'metric' para Celsius, 'imperial' para Fahrenheit
        },

        // API de cotação de moedas (Brasil API - gratuita, sem auth)
        currency: {
            baseUrl: 'https://brasilapi.com.br/api',
            endpoints: {
                exchange: '/exchange/v1/moedas/{moeda}/data/{data}'
            }
        },

        // API de frases motivacionais (gratuita, sem auth)
        quotes: {
            baseUrl: 'https://type.fit/api/quotes'
        }
    },

    // Configurações gerais
    general: {
        // Timeout para requisições (em ms)
        timeout: 10000,
        // Quantidade de projetos para exibir
        projectsLimit: 6,
        // Cache de dados (em minutos)
        cacheDuration: 30
    }
};

// Exportar para uso em outros módulos (se estiver usando módulos ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
