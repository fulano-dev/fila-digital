// src/routes/layoutRoutes.js
const express = require('express');
const router = express.Router();
const layoutController = require('../controllers/layoutController');

// Rota para obter as configurações de layout de um restaurante
router.get('/api/restaurants/:restaurantId/layout', layoutController.getLayoutByRestaurant);

module.exports = router;