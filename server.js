const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de segurança
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por janela
});

// Middleware de segurança
app.use(limiter);
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Headers de segurança
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '.'), {
  maxAge: '1d', // Cache de 1 dia para assets estáticos
  etag: true
}));

// Rota para o formulário de contato
app.post('/api/contact', async (req, res) => {
    let { name, email, subject, message } = req.body;

    // Sanitização básica
    name = name ? name.toString().trim() : '';
    email = email ? email.toString().trim() : '';
    subject = subject ? subject.toString().trim() : '';
    message = message ? message.toString().trim() : '';

    // Validação básica
    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'Por favor, preencha todos os campos obrigatórios.'
        });
    }

    // Validação e sanitização adicionais
    if (name.length > 100 || email.length > 254 || subject.length > 200 || message.length > 2000) {
        return res.status(400).json({
            success: false,
            message: 'Dados fornecidos excedem os limites permitidos.'
        });
    }

    // Validação de email mais robusta
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Por favor, insira um email válido.'
        });
    }

    // Validação de conteúdo para prevenir injeção
    const suspiciousPatterns = [/<script/i, /javascript:/i, /vbscript:/i, /onload/i, /onerror/i];
    if (suspiciousPatterns.some(pattern => pattern.test(name + subject + message))) {
        return res.status(400).json({
            success: false,
            message: 'Dados inválidos detectados.'
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