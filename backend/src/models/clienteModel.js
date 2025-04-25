// src/models/clienteModel.js
const pool = require('./db');  // Importando a conexão com o banco de dados MySQL

// Função para adicionar um cliente
const adicionarCliente = async (numeroWhatsApp, preferencial, numeroPessoas, comentario) => {
  const query = `
    INSERT INTO TabelaCliente (NumeroWhatsApp, Preferencial, NumeroPessoas, Comentario)
    VALUES (?, ?, ?, ?)
  `;
  try {
    const [result] = await pool.execute(query, [numeroWhatsApp, preferencial, numeroPessoas, comentario]);
    return { idCliente: result.insertId };  // Retorna o idCliente do novo cliente
  } catch (err) {
    console.error('Erro ao adicionar cliente', err);
    throw err;
  }
};

module.exports = {
  adicionarCliente
};