// src/controllers/filaController.js
const filaModel = require('../models/filaModel');

const adicionarFila = async (req, res) => {
  const { idFilial, idCliente } = req.body;
  try {
    const { idFila } = await filaModel.adicionarFila(idFilial, idCliente);
    res.status(201).json({ idFila });
  } catch (err) {
    console.error('Erro ao adicionar cliente à fila', err);
    res.status(500).send('Erro ao adicionar cliente à fila');
  }
};

module.exports = {
  adicionarFila
};