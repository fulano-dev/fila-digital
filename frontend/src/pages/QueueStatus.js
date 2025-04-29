import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ProgressRing from '../components/ProgressRing';
import LayoutBackground from '../components/LayoutBackground'; // Componente de LayoutBackground que vai manter o fundo e outras informações


const QueueStatus = () => {
  const { idFila } = useParams(); // Obtém o ID da fila da URL
  const navigate = useNavigate();

  const [status, setStatus] = useState(null);
  const [idFilaStorge, setIdFilaStorge] = useState(localStorage.getItem('idFila'));
  const [posicao, setPosicao] = useState(null);
  const [layoutConfig, setLayoutConfig] = useState(null); // Estado para armazenar as configurações de layout

  useEffect(() => {
   
    if (idFilaStorge) {
      // Se o idFila existir no localStorage, vai diretamente para a página de status da fila
      fetchLayout(idFilaStorge); // Chama a função para obter o layout
      fetchPosition(idFilaStorge);
      navigate(`/queue-status/${idFilaStorge}`);
    } else {
      // Caso contrário, redireciona o usuário de volta para a página inicial ou outra página
      navigate('/');
    }
  }, [navigate]);
  useEffect(() => {
     // Chama a função para obter a posição na fila
  }, []);

  const fetchLayout = async (idFilaStorge) => {
    try {
      // Faz a requisição para obter o layout e outras informações
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fila/configs-fila/${idFilaStorge}`);
      setLayoutConfig(response.data.configsLayout); // Armazena os dados de layout recebidos
    } catch (error) {
      console.error("Erro ao obter layout", error);
    }
  };

  const fetchPosition = async () => {
    try {
      // Faz a requisição para obter a posição do cliente na fila
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fila/posicao/${idFilaStorge}`);
      setPosicao(response.data.posicao);
      setStatus(response.data.status);

      if (response.data.status === 'Chamado') {
        // Atualize o estado ou faça algo quando o cliente for chamado
      }
    } catch (error) {
      console.error("Erro ao obter a posição na fila:", error);
    }
  };

  // Verifica se o layoutConfig foi carregado antes de tentar usá-lo
  if (!layoutConfig) {
    return <div>Carregando...</div>; // Mostra uma mensagem de carregamento até obter as configurações
  }

  // Definindo as cores do layout a partir do layoutConfig, com fallback para cores padrão
  const corPrincipal = layoutConfig?.CorPrincipal || '#3498db';
  const corSecundaria = layoutConfig?.CorSecundaria || '#e67e22';
  const corNome = layoutConfig?.CorNome || '#ffffff';
  const corFonte = layoutConfig?.CorFonte || '#333333';
  const corStatusVerde = '#28a745'; // Cor verde quando chamado
  const corStatusAmarelo = '#f39c12'; // Cor amarela quando aguardando
  const corTercearia = layoutConfig?.CorTercearia || '#ffffff';
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
      minHeight: '45vh', // Garante que o container ocupe toda a altura da tela
    },
    header: {
      backgroundImage: `url(${layoutConfig?.FotoUrl || 'default-image-url.jpg'})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '40vh',
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
      width: '90%',
      padding: '16px',
      backgroundColor: corSecundaria,
      color: corFonteSecundaria,
      border: 'none',
      marginLeft: '5%',
      marginBottom:'5%',
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
  const handleLeaveQueue = () => {
    // Limpa o idFila do localStorage
    localStorage.removeItem('idFila');
  
    // Redireciona o usuário para a página principal ou qualquer outra página desejada
    navigate(`/${layoutConfig?.idFilial}`);
  };
  

  return (
    <LayoutBackground corPrincipal={status !== 'Chamado' ? corPrincipal : corStatusVerde }
    corSecundaria={corSecundaria}
    corTercearia={corTercearia}
    corNome={corNome}
    corFonte={corFonte}
    corFonteSecundaria={corFonteSecundaria}>
      <div>
        <div style={styles.header}>
          {layoutConfig?.LogoUrl && <img src={layoutConfig?.LogoUrl} alt="Logo" style={styles.logo} />}
          <h2 style={styles.heading}>{layoutConfig?.NomeFilial}</h2> {/* Exibe o nome da filial */}
        </div>
        <div style={styles.container}>
          <h3 style={{ color: corFonte }}>Posição na Fila</h3>
         
          {status !== 'Chamado' ? (<ProgressRing color="#28a745" time={20} onComplete={fetchPosition} number={posicao}/>):(
            <><img src='https://i.imgur.com/aIeZVEQ.png' 
            style={{
              width: '120px',
              height: '120px',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',}} /> 
            
            <p>Você foi chamado!</p></>)}

            <div>
              {status === 'Chamado' ? (
                <>
                  <i className="fa fa-check-circle" style={{ fontSize: '3rem', marginBottom: '10px' }} />
                  <p>Por favor, dirija-se ao restaurante.</p>
                  

                </>
              ) : (
                <>
                  <i className="fa fa-hourglass-half" style={{ fontSize: '3rem', marginBottom: '10px' }} />
                  <p>Aguarde, sua vez está chegando!</p>
                  

                </>
              )}
          </div>
        </div>

        <button 
          onClick={handleLeaveQueue} 
          style={styles.button}
          
        >
          Sair da Fila
        </button>
      </div>
    </LayoutBackground>
  );
};

export default QueueStatus;