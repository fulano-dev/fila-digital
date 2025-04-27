const pool = require('../models/db');  // Importa a conexão com o banco de dados MySQL

// Função para retornar todos os restaurantes
const getAllRestaurants = async (req, res) => {
  try {
    // Consulta para buscar todos os restaurantes
    const [restaurants] = await pool.execute('SELECT * FROM TabelaRestaurante');
    
    // Retorna os dados dos restaurantes para o front-end
    res.json(restaurants);
  } catch (err) {
    console.error('Erro ao buscar restaurantes:', err);
    res.status(500).json({ message: 'Erro ao buscar restaurantes' });
  }
};

// Função para retornar um restaurante por ID, incluindo as filiais e localização
const getRestaurantById = async (req, res) => {
  const { restaurantId } = req.params; // Pega o ID do restaurante da URL

  try {
    // Consulta para buscar o restaurante pelo ID
    const [restaurant] = await pool.execute('SELECT * FROM TabelaRestaurante WHERE IdRestaurante = ?', [restaurantId]);
    
    if (restaurant.length === 0) {
      return res.status(404).json({ message: 'Restaurante não encontrado' });
    }

    // Consulta para buscar as filiais do restaurante
    const [filiais] = await pool.execute('SELECT * FROM TabelaFilial WHERE idRestaurante = ?', [restaurantId]);

    // Garantir que idLocalizacao seja associado à filial e não ao restaurante
    const filiaisComLocalizacao = await Promise.all(filiais.map(async (filial) => {
      // Buscar a localização da filial
      const [localizacao] = await pool.execute('SELECT NomeDaLocalizacao FROM TabelaLocalizacao WHERE IdDaLocalizacao = ?', [filial.idLocalizacao]);

      // Adiciona a localização à filial
      filial.localizacao = localizacao.length > 0 ? localizacao[0].NomeDaLocalizacao : 'Localização não definida';
      return filial;
    }));

    // Adiciona as filiais com localização aos dados do restaurante
    const restaurantWithDetails = {
      ...restaurant[0],
      filiais: filiaisComLocalizacao
    };

    // Retorna os dados do restaurante com filiais e localização
    res.json(restaurantWithDetails);
  } catch (err) {
    console.error('Erro ao buscar restaurante:', err);
    res.status(500).json({ message: 'Erro ao buscar restaurante' });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById
};