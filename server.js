const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '.')));

// Rota para o formulário de contato
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validação básica
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

    try {
        // Configurar o transporte de email
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Opções do email
        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `Contato Portfolio: ${subject}`,
            text: `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`,
            html: `
                <h3>Novo contato do portfólio</h3>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Assunto:</strong> ${subject}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        };

        // Enviar email
        await transporter.sendMail(mailOptions);

        res.json({ 
            success: true, 
            message: 'Mensagem enviada com sucesso! Entrarei em contato em breve.' 
        });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao enviar mensagem. Por favor, tente novamente mais tarde.' 
        });
    }
});

// Rota para obter estatísticas do portfólio
app.get('/api/stats', (req, res) => {
    // Simular dados de estatísticas
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

// Rota para obter informações do usuário
app.get('/api/user', (req, res) => {
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

// Rota principal para servir o index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});