// backend/routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Rota para listar todos os restaurantes
router.get('/', restaurantController.getAllRestaurants);

// Rota para buscar restaurante por ID
router.get('/:restaurantId', restaurantController.getRestaurantById);  // Nova rota para pegar restaurante por ID

module.exports = router;