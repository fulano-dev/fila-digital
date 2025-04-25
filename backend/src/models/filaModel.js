// src/models/filaModel.js
const pool = require('./db');  // Importando a conexão

// Função para adicionar cliente à fila
const adicionarFila = async (idFilial, idCliente) => {
  const query = `
    INSERT INTO TabelaFila (idFilial, idCliente, PosicaoFila, HorarioEntrada)
    VALUES (?, ?, 
            (SELECT COALESCE(MAX(PosicaoFila), 0) + 1 FROM TabelaFila WHERE idFilial = ?), 
            CURRENT_TIMESTAMP)
    `;
  try {
    const [result] = await pool.execute(query, [idFilial, idCliente, idFilial]);
    return { idFila: result.insertId };  // Retorna o idFila do novo cliente na fila
  } catch (err) {
    console.error('Erro ao adicionar cliente à fila', err);
    throw err;
  }
};

// Função para obter os clientes na fila
const obterFila = async (idFilial) => {
  const query = 'SELECT * FROM TabelaFila WHERE idFilial = ? ORDER BY PosicaoFila';
  try {
    const [rows] = await pool.execute(query, [idFilial]);
    return rows;  // Retorna todos os clientes da fila dessa filial
  } catch (err) {
    console.error('Erro ao obter fila', err);
    throw err;
  }
};

module.exports = {
  adicionarFila,
  obterFila
};