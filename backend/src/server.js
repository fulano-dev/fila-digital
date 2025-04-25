// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const filaRoutes = require('./routes/filaRoutes');
const clienteRoutes = require('./routes/clienteRoutes'); // Certifique-se de que o caminho está correto

dotenv.config();  // Carregar variáveis de ambiente

const app = express();
app.use(bodyParser.json()); // Parse JSON bodies

// Configuração do banco de dados
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Middleware para passar o pool do banco para as rotas
app.use((req, res, next) => {
    req.pool = pool;
    next();
});

// Rotas
app.use('/api/fila', filaRoutes);
app.use('/api/cliente', clienteRoutes); // Certifique-se de que está chamando as rotas corretamente

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});