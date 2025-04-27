// src/pages/WaitlistForm.js
import React, { useState } from 'react';
import Select from 'react-select';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation para pegar os dados passados
import axios from 'axios';
import LayoutBackground from '../components/LayoutBackground';

function WaitlistForm() {
  const location = useLocation();
  const { branch, restaurant, layoutConfig } = location.state || {}; // Recebe a filial selecionada e as configurações de layout
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [observations, setObservations] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ numberOfPeople, name, phone, observations });
    navigate('/waitlist-confirmation'); // Redireciona para a confirmação
  };

  if (!branch) {
    return <div>Filial não encontrada.</div>;
  }

  const corPrincipal = layoutConfig?.CorPrincipal || '#3498db';
  const corSecundaria = layoutConfig?.CorSecundaria || '#e67e22';
  const corTercearia = layoutConfig?.CorTercearia || '#2ecc71';
  const corNome = layoutConfig?.CorNome || '#ffffff';
  const corFonte = layoutConfig?.CorFonte || '#333333';
  const corFonteSecundaria = layoutConfig?.FonteSecundaria || '#000000';

  const styles = {
    container: {
      fontFamily: 'Roboto, sans-serif',
      backgroundColor: 'transparent',
      paddingBottom: '50px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 20px',
    },
    header: {
      backgroundImage: `url(${restaurant?.FotoUrl || 'default-image-url.jpg'})`,
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
    },
    heading: {
      fontSize: '10vw',
      fontWeight: 'bold',
      color: corNome,
      textShadow: '2px 2px 10px rgba(0, 0, 0, 0.5)',
      margin: '20px 0',
    },
    logo: {
      width: '100px',
      height: '100px',
      objectFit: 'contain',
      marginBottom: '20px',
      border: `3px solid ${corTercearia}`, // Borda do logo com cor secundária
      boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)',
    },
    formContainer: {
      width: '90%',
      maxWidth: '400px',  // Ajustei o maxWidth para limitar a largura do formulário
      padding: '20px',
      backgroundColor: 'transparent',
      borderRadius: '8px',
    },
    input: {
      width: '90%',
      height: '30px',
      padding: '10px',
      minWidth: '350px !important',
      marginBottom: '20px',
      borderRadius: '4px',
      border: `1px solid ${corSecundaria}`, // Borda com a cor secundária (igual ao botão)
    },
    textarea: {
      width: '90%',
      padding: '10px',
      marginBottom: '20px',
      borderRadius: '4px',
      border: `1px solid ${corSecundaria}`, // Borda com a cor secundária (igual ao botão)
      height: '30px',
      resize: 'none',
    },
    button: {
      width: '100%',
      padding: '15px',
      backgroundColor: corSecundaria,
      color: corFonteSecundaria,
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      color: corFonte,
      marginBottom: '15px',
      fontWeight: '500',
      textAlign: 'center',
    },
    formCenter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  };

  return (
    <LayoutBackground corPrincipal={corPrincipal}
    corSecundaria={corSecundaria}
    corTercearia={corTercearia}
    corNome={corNome}
    corFonte={corFonte}
    corFonteSecundaria={corFonteSecundaria}>
      <div>
        <div style={styles.header}>
          {restaurant?.LogoUrl && <img src={restaurant?.LogoUrl} alt="Logo" style={styles.logo} />}
          <h2 style={styles.heading}>{branch.NomeFilial}</h2> {/* Exibe o nome da filial */}
        </div>

        <div style={styles.container}>
          <div style={styles.formContainer}>
            <div style={styles.formCenter}>
              <h3 style={styles.sectionTitle}>Quantas pessoas na mesa?</h3>
              <Select
                value={{ value: numberOfPeople, label: `${numberOfPeople} Pessoa${numberOfPeople > 1 ? 's' : ''}` }}
                onChange={(selectedOption) => setNumberOfPeople(selectedOption.value)}
                options={[...Array(10).keys()].map((num) => ({
                  value: num + 1,
                  label: `${num + 1} Pessoa${num + 1 > 1 ? 's' : ''}`
                }))}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    width: '90%', // Certifica que a largura do select seja a mesma que a dos inputs
                    padding: '10px',
                    minWidth: '350px !important',
                    borderRadius: '4px',
                    border: `1px solid ${corSecundaria}`,
                    marginBottom: '20px', // Pode ajustar conforme a necessidade
                    color: corFonteSecundaria,
                  }),
                  menu: (provided) => ({
                    ...provided,
                    borderRadius: '4px',
                    border: `1px solid ${corSecundaria}`,
                    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)',
                    color: corFonteSecundaria,
                  }),
                }}
              />
            </div>

            <div style={styles.formCenter}>
              <h3 style={styles.sectionTitle}>Suas Informações</h3>
              <input
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={styles.input}
              />
              <textarea
                placeholder="Observações"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                style={styles.textarea}
              ></textarea>
            </div>

            <button onClick={handleSubmit} style={styles.button}>
              Entrar na lista
            </button>
          </div>
        </div>
      </div>
    </LayoutBackground>
  );
}

export default WaitlistForm;