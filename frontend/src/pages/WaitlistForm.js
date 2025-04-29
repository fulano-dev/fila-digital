import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LayoutBackground from '../components/LayoutBackground';
import axios from 'axios';
import Select from 'react-select';

function WaitlistForm() {
  const location = useLocation();
  const { branch, restaurant, layoutConfig } = location.state || {}; // Recebe a filial selecionada e as configurações de layout
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [observations, setObservations] = useState('');
  const navigate = useNavigate(); // Usado para redirecionar o usuário para a tela de status

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Remove a máscara do telefone antes de enviar para o backend
    const unmaskedPhone = phone.replace(/[^\d]/g, ''); // Remove a máscara
    const formattedPhone = `+55${unmaskedPhone}`; // Adiciona o código do Brasil

    const data = {
      idFilial: branch.idFilial,
      nome: name,
      numeroWhatsapp: formattedPhone, // Envia o telefone com o código do Brasil
      numeroPessoas: numberOfPeople,
      comentario: observations
    };

    try {
      // Enviar os dados para o backend
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/fila/entrar-fila`, data);

      // Assumindo que a resposta tenha um campo 'queueId' que é o ID da fila
      if (response.status === 201 && response.data.idFila) {
        const queueId = response.data.idFila;

        // Redireciona para a página de status, passando o 'queueId' para mostrar a posição na fila
        
        navigate(`/queue-status/${response.data.idFila}`, { state: { branch, restaurant, layoutConfig } });
      } else {
        // Se não houve sucesso, você pode mostrar uma mensagem de erro
        alert('Não foi possível adicionar à fila. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao adicionar à fila:', error);
      alert('Houve um erro ao tentar entrar na fila. Tente novamente.');
    }
  };

  // Função para aplicar a máscara de telefone e limitar a quantidade de caracteres
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, ''); // Remove caracteres não numéricos

    // Limitar a 11 caracteres (DDD + 9 + 4 dígitos)
    if (value.length > 11) {
      value = value.slice(0, 11); // Limita para 11 caracteres
    }

    if (value.length <= 10) {
      value = value.replace(/^(\d{2})(\d{0,5})(\d{0,4})$/, '($1) $2-$3');
    } else {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3');
    }

    setPhone(value); // Atualiza o estado com o telefone formatado
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
      width: '150px',
      height: '150px',
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
      borderRadius: '12px',
    },
    input: {
      width: '100%',
      padding: '14px',
      marginBottom: '20px',
      borderRadius: '12px', // Borda arredondada
      border: `2px solid ${corSecundaria}`, // Borda com a cor secundária
      backgroundColor: '#f7f7f7', // Cor de fundo suave
      fontSize: '16px',
      color: corFonteSecundaria,
      transition: 'all 0.3s ease', // Transição suave ao focar
    },
    textarea: {
      width: '100%',
      padding: '14px',
      marginBottom: '20px',
      borderRadius: '12px', // Borda arredondada
      border: `2px solid ${corSecundaria}`, // Borda com a cor secundária
      backgroundColor: '#f7f7f7', // Cor de fundo suave
      fontSize: '16px',
      color: corFonteSecundaria,
      resize: 'none',
      transition: 'all 0.3s ease', // Transição suave ao focar
    },
    button: {
      width: '100%',
      padding: '16px',
      backgroundColor: corSecundaria,
      color: corFonteSecundaria,
      border: 'none',
      borderRadius: '12px', // Bordas arredondadas
      fontSize: '18px',
      cursor: 'pointer',
      transition: 'all 0.3s ease', // Transição suave ao passar o mouse
    },
    buttonHover: {
      backgroundColor: '#e67e22', // Cor um pouco mais forte ao passar o mouse
      boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)', // Efeito de sombra mais forte
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
                onChange={handlePhoneChange} // Usa a função handlePhoneChange
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