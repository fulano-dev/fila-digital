// src/routes/filaRoutes.js
const express = require('express');
const router = express.Router();
const filaController = require('../controllers/filaController');

// Definir a rota POST para adicionar um cliente à fila
router.post('/', filaController.adicionarFila); // Função que adiciona cliente à fila

// Exportar o router para ser usado no server.js
module.exports = router;