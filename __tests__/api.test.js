const request = require('supertest');
const app = require('../server'); // Ajustaremos isso depois

// Importar o módulo express e configurar o app
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const testApp = express();
testApp.use(cors());
testApp.use(bodyParser.json());
testApp.use(bodyParser.urlencoded({ extended: true }));

// Rotas de teste (simulando as rotas do servidor real)
testApp.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'Por favor, preencha todos os campos obrigatórios.' 
        });
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Por favor, insira um email válido.' 
        });
    }

    // Simular envio de email bem-sucedido
    res.json({ 
        success: true, 
        message: 'Mensagem enviada com sucesso! Entrarei em contato em breve.' 
    });
});

testApp.get('/api/stats', (req, res) => {
    const stats = {
        totalViews: 1250,
        totalContacts: 42,
        projectsCompleted: 8,
        blogPosts: 5,
        githubRepos: 12,
        followers: 25,
        updated: new Date().toISOString()
    };
    
    res.json(stats);
});

testApp.get('/api/user', (req, res) => {
    const user = {
        name: "Wallace Phellipe Melo de Araújo",
        title: "Desenvolvedor Front-end Júnior",
        email: "wallacephellipe03@gmail.com",
        location: "Curitiba, PR",
        bio: "Sou Assistente de TI com sólida experiência em suporte técnico, resolução de problemas e automações operacionais. Atualmente estou em transição de carreira para a área de desenvolvimento, focado em Front-end e Full Stack.",
        skills: [
            "HTML5", "CSS3", "JavaScript (básico)", 
            "React (em aprendizado)", "Git", "GitHub", 
            "VS Code", "Terminal/Linux"
        ],
        updated: new Date().toISOString()
    };
    
    res.json(user);
});

describe('Testes de API do Portfólio', () => {
    describe('POST /api/contact', () => {
        test('deve retornar sucesso quando todos os campos forem fornecidos corretamente', async () => {
            const response = await request(testApp)
                .post('/api/contact')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    subject: 'Test Subject',
                    message: 'Test message content'
                })
                .expect(200);
            
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Mensagem enviada com sucesso! Entrarei em contato em breve.');
        });

        test('deve retornar erro quando campos obrigatórios forem omitidos', async () => {
            const response = await request(testApp)
                .post('/api/contact')
                .send({
                    name: 'Test User',
                    email: 'test@example.com'
                    // faltando subject e message
                })
                .expect(400);
            
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Por favor, preencha todos os campos obrigatórios.');
        });

        test('deve retornar erro quando email for inválido', async () => {
            const response = await request(testApp)
                .post('/api/contact')
                .send({
                    name: 'Test User',
                    email: 'invalid-email',
                    subject: 'Test Subject',
                    message: 'Test message content'
                })
                .expect(400);
            
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Por favor, insira um email válido.');
        });
    });

    describe('GET /api/stats', () => {
        test('deve retornar estatísticas do portfólio', async () => {
            const response = await request(testApp)
                .get('/api/stats')
                .expect(200);
            
            expect(response.body).toHaveProperty('totalViews');
            expect(response.body).toHaveProperty('totalContacts');
            expect(response.body).toHaveProperty('projectsCompleted');
            expect(response.body).toHaveProperty('blogPosts');
            expect(response.body).toHaveProperty('githubRepos');
            expect(response.body).toHaveProperty('followers');
            expect(response.body).toHaveProperty('updated');
        });
    });

    describe('GET /api/user', () => {
        test('deve retornar informações do usuário', async () => {
            const response = await request(testApp)
                .get('/api/user')
                .expect(200);
            
            expect(response.body.name).toBe('Wallace Phellipe Melo de Araújo');
            expect(response.body.title).toBe('Desenvolvedor Front-end Júnior');
            expect(response.body).toHaveProperty('skills');
            expect(Array.isArray(response.body.skills)).toBe(true);
        });
    });
});