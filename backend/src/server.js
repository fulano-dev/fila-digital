const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); // Carregar variáveis de ambiente
const mysql = require('mysql2');
const cors = require('cors'); // Importando o CORS
const filaRoutes = require('./routes/filaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const layoutRoutes = require('./routes/layoutRoutes');
const WebSocket = require('ws'); // Importando o WebSocket

// Verificar as variáveis de ambiente
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

const app = express();

// Configuração do CORS
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

// Configuração do banco de dados MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware para passar o pool do banco para as rotas
app.use((req, res, next) => {
    req.pool = pool.promise();
    next();
});

// Rotas
app.use('/api/fila', filaRoutes); // Configuração correta da rota
app.use('/api/cliente', clienteRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use(layoutRoutes);

// Criar o servidor HTTP
const server = app.listen(process.env.PORT || 3001, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 3001}`);
});

// Criar o servidor WebSocket e associar ao servidor HTTP
const wss = new WebSocket.Server({ noServer: true }); // Alterando para não criar um novo servidor

wss.on('connection', (ws) => {
    console.log('Novo cliente conectado ao WebSocket');

    // Aqui você pode tratar a comunicação via WebSocket, por exemplo, ouvindo mensagens
    ws.on('message', (message) => {
        console.log('Mensagem recebida:', message);
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

// Adicionando a função de upgrade de WebSocket ao servidor HTTP
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});