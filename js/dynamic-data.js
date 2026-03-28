/**
 * Dynamic Data Module
 * 
 * Responsável por buscar e exibir dados dinâmicos de APIs externas:
 * - Clima (OpenWeatherMap)
 * - Cotação de moedas (Brasil API)
 * - Frases motivacionais (Type.fit API)
 * - GitHub Status
 */

class DynamicDataAPI {
    constructor(config) {
        this.config = config;
        this.cache = new Map();
        this.cacheExpiry = config.general.cacheDuration * 60 * 1000;
    }

    /**
     * Método auxiliar para fetch com timeout
     */
    async fetchWithTimeout(url, options = {}, timeout = this.config.general.timeout) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    }

    /**
     * Buscar dados do clima (OpenWeatherMap)
     */
    async getWeather() {
        const { apiKey, city, units } = this.config.dynamicData.weather;
        
        if (apiKey === 'SUA_API_KEY_AQUI') {
            console.warn('[DynamicData] Weather API não configurada');
            return this.getMockWeather();
        }

        const cacheKey = `weather_${city}`;
        const cached = this.getCachedData(cacheKey);
        
        if (cached) return cached;

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}&lang=pt_br`;
            
            const response = await this.fetchWithTimeout(url);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar dados do clima');
            }

            const data = await response.json();
            
            const weatherData = {
                city: data.name,
                country: data.sys.country,
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.feels_like),
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            };

            this.setCacheData(cacheKey, weatherData);
            return weatherData;
        } catch (error) {
            console.error('[DynamicData] Erro ao buscar clima:', error.message);
            return this.getMockWeather();
        }
    }

    /**
     * Dados mock de clima (fallback)
     */
    getMockWeather() {
        return {
            city: 'São Paulo',
            country: 'BR',
            temperature: 25,
            feelsLike: 26,
            humidity: 65,
            windSpeed: 3.5,
            description: 'Parcialmente nublado',
            icon: '02d',
            sunrise: '06:30',
            sunset: '18:45'
        };
    }

    /**
     * Buscar cotação de moedas (Brasil API)
     */
    async getCurrencyRates(currencies = ['USD', 'EUR', 'BTC']) {
        const rates = [];

        for (const currency of currencies) {
            try {
                const url = `https://brasilapi.com.br/api/cotacoes/moedas/v1/${currency}`;
                const response = await this.fetchWithTimeout(url);
                
                if (!response.ok) continue;

                const data = await response.json();
                const latestRate = data[data.length - 1];

                rates.push({
                    currency: currency,
                    name: this.getCurrencyName(currency),
                    buy: latestRate.cotacao,
                    variation: latestRate.variacao
                });
            } catch (error) {
                console.warn(`[DynamicData] Erro ao buscar cotação de ${currency}:`, error.message);
                // Adicionar dados mock
                rates.push(this.getMockCurrency(currency));
            }
        }

        return rates;
    }

    /**
     * Nome da moeda em português
     */
    getCurrencyName(currency) {
        const names = {
            'USD': 'Dólar Americano',
            'EUR': 'Euro',
            'GBP': 'Libra Esterlina',
            'BTC': 'Bitcoin',
            'ARS': 'Peso Argentino'
        };
        return names[currency] || currency;
    }

    /**
     * Dados mock de moedas (fallback)
     */
    getMockCurrency(currency) {
        const mockRates = {
            'USD': { currency: 'USD', name: 'Dólar Americano', buy: 5.05, variation: 0.5 },
            'EUR': { currency: 'EUR', name: 'Euro', buy: 5.50, variation: -0.3 },
            'BTC': { currency: 'BTC', name: 'Bitcoin', buy: 250000.00, variation: 2.1 }
        };
        return mockRates[currency] || { currency, name: currency, buy: 0, variation: 0 };
    }

    /**
     * Buscar frase motivacional
     */
    async getQuote() {
        const cacheKey = 'quote';
        const cached = this.getCachedData(cacheKey);
        
        if (cached) return cached;

        try {
            const url = this.config.dynamicData.quotes.baseUrl;
            const response = await this.fetchWithTimeout(url);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar frase');
            }

            const quotes = await response.json();
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

            const quoteData = {
                text: randomQuote.text,
                author: randomQuote.author || 'Desconhecido'
            };

            this.setCacheData(cacheKey, quoteData);
            return quoteData;
        } catch (error) {
            console.error('[DynamicData] Erro ao buscar frase:', error.message);
            return this.getMockQuote();
        }
    }

    /**
     * Frase mock (fallback)
     */
    getMockQuote() {
        const quotes = [
            { text: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.', author: 'Robert Collier' },
            { text: 'A única maneira de fazer um excelente trabalho é amar o que você faz.', author: 'Steve Jobs' },
            { text: 'A persistência realiza o impossível.', author: 'Provérbio Chinês' },
            { text: 'Comece onde você está. Use o que você tem. Faça o que você pode.', author: 'Arthur Ashe' }
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    /**
     * Buscar estatísticas do GitHub
     */
    async getGitHubStats() {
        const username = this.config.github.username;
        
        try {
            // Buscar perfil
            const profileResponse = await this.fetchWithTimeout(
                `${this.config.github.baseUrl}/users/${username}`
            );
            
            if (!profileResponse.ok) {
                throw new Error('Perfil não encontrado');
            }

            const profile = await profileResponse.json();

            // Buscar repositórios para contar total
            const reposResponse = await this.fetchWithTimeout(
                `${this.config.github.baseUrl}/users/${username}/repos`
            );
            
            const repos = await reposResponse.json();
            
            // Calcular total de estrelas
            const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

            return {
                name: profile.name || username,
                bio: profile.bio || '',
                publicRepos: profile.public_repos,
                followers: profile.followers,
                following: profile.following,
                totalStars: totalStars,
                avatar: profile.avatar_url,
                profileUrl: profile.html_url
            };
        } catch (error) {
            console.error('[DynamicData] Erro ao buscar GitHub stats:', error.message);
            return null;
        }
    }

    /**
     * Renderizar widget do clima
     */
    renderWeather(containerId, weatherData) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const iconUrl = `https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`;

        container.innerHTML = `
            <div class="weather-widget">
                <div class="weather-header">
                    <i class="fas fa-cloud-sun"></i>
                    <span>Clima em ${weatherData.city}</span>
                </div>
                <div class="weather-content">
                    <img src="${iconUrl}" alt="${weatherData.description}" class="weather-icon">
                    <div class="weather-temp">
                        <span class="temp">${weatherData.temperature}°C</span>
                        <span class="description">${weatherData.description}</span>
                    </div>
                </div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <i class="fas fa-wind"></i>
                        <span>${weatherData.windSpeed} m/s</span>
                    </div>
                    <div class="weather-detail">
                        <i class="fas fa-tint"></i>
                        <span>${weatherData.humidity}%</span>
                    </div>
                    <div class="weather-detail">
                        <i class="fas fa-thermometer-half"></i>
                        <span>Sensação: ${weatherData.feelsLike}°C</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderizar widget de cotações
     */
    renderCurrency(containerId, rates) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="currency-widget">
                <div class="currency-header">
                    <i class="fas fa-chart-line"></i>
                    <span>Cotação de Moedas</span>
                </div>
                <div class="currency-content">
                    ${rates.map(rate => `
                        <div class="currency-item">
                            <div class="currency-info">
                                <span class="currency-name">${rate.name}</span>
                                <span class="currency-code">${rate.currency}</span>
                            </div>
                            <div class="currency-value">
                                <span class="currency-buy">R$ ${rate.buy.toFixed(2)}</span>
                                <span class="currency-variation ${rate.variation >= 0 ? 'positive' : 'negative'}">
                                    <i class="fas fa-${rate.variation >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                                    ${(rate.variation * 100).toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="currency-footer">
                    <small>Fonte: Brasil API</small>
                </div>
            </div>
        `;
    }

    /**
     * Renderizar frase motivacional
     */
    renderQuote(containerId, quote) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="quote-widget">
                <i class="fas fa-quote-left quote-icon"></i>
                <blockquote class="quote-text">
                    "${quote.text}"
                </blockquote>
                <cite class="quote-author">— ${quote.author}</cite>
            </div>
        `;
    }

    /**
     * Renderizar estatísticas do GitHub
     */
    renderGitHubStats(containerId, stats) {
        const container = document.getElementById(containerId);
        if (!container || !stats) return;

        container.innerHTML = `
            <div class="github-stats-widget">
                <div class="github-stats-header">
                    <img src="${stats.avatar}" alt="${stats.name}" class="github-avatar">
                    <div class="github-stats-info">
                        <h4>${stats.name}</h4>
                        <p class="github-bio">${stats.bio || 'Desenvolvedor'}</p>
                    </div>
                </div>
                <div class="github-stats-content">
                    <div class="github-stat">
                        <i class="fas fa-code-branch"></i>
                        <span class="stat-value">${stats.publicRepos}</span>
                        <span class="stat-label">Repositórios</span>
                    </div>
                    <div class="github-stat">
                        <i class="fas fa-star"></i>
                        <span class="stat-value">${stats.totalStars}</span>
                        <span class="stat-label">Estrelas</span>
                    </div>
                    <div class="github-stat">
                        <i class="fas fa-users"></i>
                        <span class="stat-value">${stats.followers}</span>
                        <span class="stat-label">Seguidores</span>
                    </div>
                </div>
                <a href="${stats.profileUrl}" target="_blank" rel="noopener noreferrer" class="github-profile-btn">
                    <i class="fab fa-github"></i> Ver Perfil no GitHub
                </a>
            </div>
        `;
    }

    /**
     * Carregar todos os widgets dinâmicos
     */
    async loadAllWidgets() {
        console.log('[DynamicData] Carregando widgets...');

        // Carregar clima
        const weather = await this.getWeather();
        this.renderWeather('weather-widget', weather);

        // Carregar cotações
        const rates = await this.getCurrencyRates();
        this.renderCurrency('currency-widget', rates);

        // Carregar frase
        const quote = await this.getQuote();
        this.renderQuote('quote-widget', quote);

        // Carregar stats do GitHub
        const stats = await this.getGitHubStats();
        this.renderGitHubStats('github-stats-widget', stats);

        console.log('[DynamicData] Widgets carregados com sucesso');
    }

    /**
     * Métodos de Cache
     */
    setCacheData(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    getCachedData(key) {
        const cached = this.cache.get(key);
        
        if (!cached) return null;
        
        if (Date.now() - cached.timestamp > this.cacheExpiry) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    refreshAll() {
        this.cache.clear();
        return this.loadAllWidgets();
    }
}

// Instanciar e exportar
const dynamicDataAPI = new DynamicDataAPI(API_CONFIG);
window.dynamicDataAPI = dynamicDataAPI;
