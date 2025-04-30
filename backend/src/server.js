const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); // Carregar variáveis de ambiente
const mysql = require('mysql2');
const cors = require('cors'); // Importando o CORS
const filaRoutes = require('./routes/filaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const layoutRoutes = require('./routes/layoutRoutes');

// Verificar as variáveis de ambiente

const app = express();

// Configuração do CORS - Permitir todas as origens
app.use(cors({
  origin: '*', // Permite apenas o frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  credentials: true, // Permite cookies, se necessário
}));

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
const server = app.listen(5000, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 5000}`);
});