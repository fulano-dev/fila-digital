// src/pages/RestaurantDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocationDropdown from '../components/LocationDropdown';
import LayoutBackground from '../components/LayoutBackground'; // Importar o componente LayoutBackground

function RestaurantDetails() {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [branches, setBranches] = useState([]); 
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [layoutConfig, setLayoutConfig] = useState({});

  const fetchLayoutConfig = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/restaurants/${id}/layout`);
      setLayoutConfig(response.data);
    } catch (error) {
      console.error('Erro ao buscar configurações de layout:', error);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      fetchLayoutConfig(restaurantId);

      axios.get(`${process.env.REACT_APP_API_URL}/api/restaurants/${restaurantId}`)
        .then(response => {
          setRestaurant(response.data);
          setBranches(response.data.filiais || []);
          setFilteredBranches(response.data.filiais || []);
        })
        .catch(error => {
          console.error("Erro ao buscar restaurante:", error);
          setBranches([]);
          setFilteredBranches([]);
        });
    }
  }, [restaurantId]);

  // Filtrando as filiais com base na localização selecionada
  useEffect(() => {
    console.log('selected', selectedLocation);
    if (selectedLocation && Array.isArray(branches)) {
      setFilteredBranches(branches.filter(branch => branch.idLocalizacao === selectedLocation.value));
      console.log('filteredBranches', filteredBranches);
    } else {
      setFilteredBranches(Array.isArray(branches) ? branches : []);
    }
  }, [selectedLocation, branches]);

  const corPrincipal = layoutConfig.CorPrincipal || '#3498db'; 
  const corSecundaria = layoutConfig.CorSecundaria || '#e67e22'; 
  const corTerceira = layoutConfig.CorTercearia || '#2ecc71'; 
  const corNome = layoutConfig.CorNome || '#ffffff'; 
  const corFonte = layoutConfig.CorFonte || '#333333'; 
  const corFonteSecundaria = layoutConfig.FonteSecundaria || '#000000';

  const styles = {
    container: {
      fontFamily: 'Roboto, sans-serif',
      minHeight: '100vh',
      paddingBottom: '50px',
    },
    header: {
      backgroundImage: `url(${restaurant ? restaurant.FotoUrl : 'default-image-url.jpg'})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '350px',
      textAlign: 'center',
      color: corNome,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '6vw',
      fontWeight: 'bold',
      paddingTop: '60px',
      textShadow: 'none',
    },
    heading: {
      margin: '20px 0',
      fontSize: '10vw',
      fontWeight: 'bold',
      color: corNome
    },
    logo: {
      width: '100px',
      height: '100px',
      objectFit: 'contain',
      marginBottom: '20px',
      border: `3px solid ${corTerceira}`,
      boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)',
    },
    dropdown: {
      padding: '16px 20px',
      fontSize: '1.4rem',
      borderRadius: '12px',
      margin: '20px 0',
      border: `2px solid ${corSecundaria}`,
      backgroundColor: '#fff',
      cursor: 'pointer',
      width: '80%',
      maxWidth: '350px',
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      fontWeight: '500',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      color: corFonte,
      marginBottom: '15px',
      fontWeight: '500',
      textAlign: 'center',
    },
    list: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '30px',
    },
    listItem: {
      backgroundColor: corSecundaria,
      color: corFonteSecundaria,
      margin: '20px 0',
      padding: '20px',
      borderRadius: '12px',
      width: '80%',
      maxWidth: '450px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      border: `2px solid ${corTerceira}`,
    },
    listItemHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
    },
    noFiliaisMessage: {
      textAlign: 'center',
      color: '#333',
      fontSize: '1.2rem',
      marginTop: '20px',
    },
  };

  const navigate = useNavigate();

  const handleBranchClick = (branch) => {
    navigate(`/waitlist-form/${branch.idFilial}`, { state: { branch, restaurant, layoutConfig } });
  };

  if (!restaurant) return <div>Carregando...</div>;

  return (
    <LayoutBackground 
      corPrincipal={corPrincipal}
      corSecundaria={corSecundaria}
      corTerceira={corTerceira}
      corNome={corNome}
      corFonte={corFonte}
      corFonteSecundaria={corFonteSecundaria}
    > {/* Usando LayoutBackground aqui */}
      <div style={styles.container}>
        <div style={styles.header}>
          {restaurant.LogoUrl && <img src={restaurant.LogoUrl} alt="Logo" style={styles.logo} />}
          <h2 style={styles.heading}>{restaurant.NomeDoRestaurante}</h2>
        </div>
        <LocationDropdown
        corPrincipal={corPrincipal}
        corSecundaria={corSecundaria}
        corTerceira={corTerceira}
        corNome={corNome}
        corFonte={corFonte}
        corFonteSecundaria={corFonteSecundaria}
          locations={branches}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
        />
        <h3 style={styles.sectionTitle}>Escolha sua Unidade:</h3>
        <ul style={styles.list}>
          {filteredBranches.length > 0 ? (
            filteredBranches.map(branch => (
              <li
                key={branch.idFilial}
                style={styles.listItem}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => handleBranchClick(branch)}
              >
                <h3>{branch.NomeFilial}</h3>
                <p>{branch.localizacao}</p>
              </li>
            ))
          ) : (
            <p style={styles.noFiliaisMessage}>
              Não há filiais disponíveis{selectedLocation && selectedLocation.value ? ' para essa localização' : '.'}
            </p>
          )}
        </ul>
      </div>
    </LayoutBackground> 
  );
}

export default RestaurantDetails;