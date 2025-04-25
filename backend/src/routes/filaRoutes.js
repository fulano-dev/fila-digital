// src/routes/filaRoutes.js
const express = require('express');
const router = express.Router();
const filaController = require('../controllers/filaController');

// Certifique-se de que você está passando uma função como middleware
router.post('/', filaController.adicionarFila); // Verifique se a função está correta aqui

module.exports = router;