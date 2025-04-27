// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Buscar lista de restaurantes
    axios.get('/api/restaurants')
      .then(response => setRestaurants(response.data))
      .catch(error => console.error("Erro ao buscar restaurantes:", error));
  }, []);

  return (
    <div className="home">
      <h1>Escolha seu restaurante</h1>
      {restaurants.map(restaurant => (
        <div key={restaurant.id}>
          <Link to={`/${restaurant.id}`}>
            <h2>{restaurant.nome}</h2>
            <img src={restaurant.logoUrl} alt={restaurant.nome} className="restaurant-logo" />
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Home;