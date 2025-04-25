// src/controllers/clienteController.js
const clienteModel = require('../models/clienteModel');  // Importando o model

const adicionarCliente = async (req, res) => {
  const { numeroWhatsApp, preferencial, numeroPessoas, comentario } = req.body;

  try {
    const { idCliente } = await clienteModel.adicionarCliente(numeroWhatsApp, preferencial, numeroPessoas, comentario);  // Chama a função do model
    res.status(201).json({ idCliente });  // Retorna o idCliente para a resposta
  } catch (err) {
    console.error('Erro ao adicionar cliente', err);
    res.status(500).send('Erro ao adicionar cliente');
  }
};

module.exports = {
  adicionarCliente
};