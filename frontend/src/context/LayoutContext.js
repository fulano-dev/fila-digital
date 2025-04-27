import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Criação do contexto LayoutContext
const LayoutContext = createContext();

// Provedor do contexto
export const LayoutProvider = ({ children }) => {
  const { restaurantId } = useParams(); // Pega o id do restaurante da URL
  const [layoutConfig, setLayoutConfig] = useState(null);

  useEffect(() => {
    if (restaurantId) {
      // Realiza a requisição usando o id do restaurante
      axios.get(`${process.env.REACT_APP_API_URL}/api/restaurants/${restaurantId}/layout`)
        .then(response => {
          setLayoutConfig(response.data); // Defina o layoutConfig com os dados da API
        })
        .catch(err => console.error("Erro ao buscar configuração de layout:", err));
    }
  }, [restaurantId]);

  return (
    <LayoutContext.Provider value={{ layoutConfig }}>
      {children}
    </LayoutContext.Provider>
  );
};

// Hook para acessar o contexto
export const useLayout = () => useContext(LayoutContext);