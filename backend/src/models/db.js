// src/models/db.js

require('dotenv').config();  // Certifique-se de carregar as variáveis de ambiente

const mysql = require('mysql2');
const pool = mysql.createPool({
  host: '192.99.13.191',
  port: 3306,
  user: 'deiapres_fila',
  password: 'zyrzix-jedZud-5nujcy',
  database: 'deiapres_fila',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para criar todas as tabelas caso não existam
const createTables = async () => {
  const createLocalizacaoTable = `
    CREATE TABLE IF NOT EXISTS TabelaLocalizacao (
      IdDaLocalizacao INT AUTO_INCREMENT PRIMARY KEY,
      NomeDaLocalizacao VARCHAR(255) NOT NULL
    );
  `;

  const createRestauranteTable = `
    CREATE TABLE IF NOT EXISTS TabelaRestaurante (
      IdRestaurante INT AUTO_INCREMENT PRIMARY KEY,
      NomeDoRestaurante VARCHAR(255) NOT NULL,
      FotoUrl VARCHAR(255),
      LogoUrl VARCHAR(255)
    );
  `;

  const createFilialTable = `
    CREATE TABLE IF NOT EXISTS TabelaFilial (
      idFilial INT AUTO_INCREMENT PRIMARY KEY,
      idRestaurante INT,
      NomeFilial VARCHAR(255) NOT NULL,
      idLocalizacao INT,
      FOREIGN KEY (idRestaurante) REFERENCES TabelaRestaurante(IdRestaurante),
      FOREIGN KEY (idLocalizacao) REFERENCES TabelaLocalizacao(IdDaLocalizacao)
    );
  `;

  const createClienteTable = `
    CREATE TABLE IF NOT EXISTS TabelaCliente (
      idCliente INT AUTO_INCREMENT PRIMARY KEY,
      NumeroWhatsApp VARCHAR(15),
      Preferencial BOOLEAN,
      NumeroPessoas INT,
      Comentario TEXT,
      Chamado BOOLEAN
    );
  `;

  const createFilaTable = `
    CREATE TABLE IF NOT EXISTS TabelaFila (
      idFila INT AUTO_INCREMENT PRIMARY KEY,
      idFilial INT,
      idCliente INT,
      PosicaoFila INT,
      HorarioEntrada DATETIME,
      FOREIGN KEY (idFilial) REFERENCES TabelaFilial(idFilial),
      FOREIGN KEY (idCliente) REFERENCES TabelaCliente(idCliente)
    );
  `;

  const createControlePreferencialTable = `
    CREATE TABLE IF NOT EXISTS ControlePreferencial (
      idFilial INT,
      ChamadosNormal INT,
      PRIMARY KEY (idFilial),
      FOREIGN KEY (idFilial) REFERENCES TabelaFilial(idFilial)
    );
  `;

  try {
    // Executar as queries para criar as tabelas
    await pool.promise().query(createLocalizacaoTable);
    await pool.promise().query(createRestauranteTable);
    await pool.promise().query(createFilialTable);
    await pool.promise().query(createClienteTable);
    await pool.promise().query(createFilaTable);
    await pool.promise().query(createControlePreferencialTable);
    console.log('Tabelas criadas ou já existem.');
  } catch (err) {
    console.error('Erro ao criar tabelas:', err);
  }
};

// Chamar a função para garantir que as tabelas sejam criadas ao iniciar o servidor
createTables();

module.exports = pool.promise();