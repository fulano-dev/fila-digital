// src/controllers/layoutController.js
const pool = require('../models/db');  // Pool de conexão com o banco de dados

// Função para obter as configurações de layout de um restaurante
exports.getLayoutByRestaurant = async (req, res) => {
  const { restaurantId } = req.params; // Obtém o id do restaurante via URL

  try {
    const [rows] = await pool.execute(
      `SELECT 
         CorPrincipal, 
         CorSecundaria, 
         CorTercearia, 
         CorNome, 
         CorFonte,
         FonteSecundaria
       FROM ConfigsLayout 
       WHERE idRestaurante = ?`, 
      [restaurantId]
    );

    // Se não encontrar dados de layout, retorna erro 404
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Configuração de layout não encontrada' });
    }

    // Retorna as configurações de layout do restaurante
    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar configuração de layout:", error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};