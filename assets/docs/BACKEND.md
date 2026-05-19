# Backend do Portfólio

Este é o backend do portfólio de Wallace Phellipe, implementado com Node.js, Express e outras tecnologias para fornecer funcionalidades server-side.

## Funcionalidades

- API RESTful para processamento de formulário de contato
- Sistema de envio de e-mails usando Nodemailer
- Endpoint para estatísticas do portfólio
- Endpoint para informações do usuário
- Middleware de segurança e validação

## Instalação

1. Clone ou copie os arquivos para sua máquina local
2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente no arquivo `.env`:

```env
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_aplicativo
PORT=3000
```

## Configuração do Gmail

Para usar o sistema de envio de e-mails com Gmail, você precisa:

1. Ativar a "Less secure app access" ou
2. Criar uma "App Password" (recomendado):
   - Vá para [Google Account Settings](https://myaccount.google.com/)
   - Vá para "Security"
   - Ative a "2-Step Verification"
   - Gere uma "App Password" para o seu app

## Rotas da API

### POST /api/contact
Envia um e-mail de contato com os dados do formulário.

**Payload:**
```json
{
  "name": "Nome do usuário",
  "email": "email@exemplo.com",
  "subject": "Assunto",
  "message": "Mensagem do usuário"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso! Entrarei em contato em breve."
}
```

### GET /api/stats
Retorna estatísticas do portfólio.

**Response:**
```json
{
  "totalViews": 1250,
  "totalContacts": 42,
  "projectsCompleted": 8,
  "blogPosts": 5,
  "githubRepos": 12,
  "followers": 25,
  "updated": "2024-12-23T10:30:00.000Z"
}
```

### GET /api/user
Retorna informações do usuário.

**Response:**
```json
{
  "name": "Wallace Phellipe Melo de Araújo",
  "title": "Desenvolvedor Front-end Júnior",
  "email": "wallacephellipe03@gmail.com",
  "location": "Curitiba, PR",
  "bio": "Texto de bio...",
  "skills": ["HTML5", "CSS3", "JavaScript (básico)", ...],
  "updated": "2024-12-23T10:30:00.000Z"
}
```

## Execução

Para executar o servidor:

```bash
# Modo de desenvolvimento
npm run dev

# Modo de produção
npm start
```

## Segurança

O backend inclui:

- Validação de dados de entrada
- Proteção contra injeção de e-mail
- Uso de variáveis de ambiente para credenciais
- CORS configurado para segurança

## Estrutura de Arquivos

```
portfolio-backend/
├── server.js           # Arquivo principal do servidor
├── package.json        # Dependências e scripts
├── .env               # Variáveis de ambiente (não versionado)
└── README.md          # Este arquivo
```

## Deploy

Para fazer deploy em produção:

1. Configure as variáveis de ambiente no servidor
2. Execute o comando de início:

```bash
npm start
```

## Contribuição

Sinta-se à vontade para abrir issues ou pull requests para melhorar este projeto.