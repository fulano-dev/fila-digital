// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();  // Carregar variáveis de ambiente
const mysql = require('mysql2');  // Substitua o 'pg' por 'mysql2'
const cors = require('cors');  // Importando o CORS
const filaRoutes = require('./routes/filaRoutes');
const clienteRoutes = require('./routes/clienteRoutes'); // Certifique-se de que o caminho está correto
const restaurantRoutes = require('./routes/restaurantRoutes');  // Importa as rotas de restaurante
const layoutRoutes = require('./routes/layoutRoutes');  // Importando as rotas de layout

// Verificar as variáveis de ambiente
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

const app = express();

// Configuração do CORS - permite todas as origens
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
    req.pool = pool.promise(); // Usando promise() para facilitar o uso com async/await
    next();
});

// Rotas
app.use('/api/fila', filaRoutes);
app.use('/api/cliente', clienteRoutes); // Certifique-se de que está chamando as rotas corretamente
// Rota para acessar os restaurantes
app.use('/api/restaurants', restaurantRoutes);
app.use(layoutRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});