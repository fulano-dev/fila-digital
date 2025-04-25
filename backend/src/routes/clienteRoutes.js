// src/routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Passando corretamente a função do controlador como handler
router.post('/', clienteController.adicionarCliente); // Verifique se está passando a função aqui

module.exports = router;