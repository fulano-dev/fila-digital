import React from 'react';

const LayoutBackground = ({
  children, 
  corPrincipal, 
  corSecundaria, 
  corTercearia, 
  corNome, 
  corFonte, 
  corFonteSecundaria
}) => {
  const backgroundColor = corPrincipal || '#3498db'; // Cor de fundo padrão
  const fontColor = corFonte || '#333333'; // Cor do texto padrão

  return (
    <div style={{
      backgroundColor: backgroundColor,
      color: fontColor,
      height: '100%',
      width: '100%',
      padding: '0',
      margin: '0',
    }}>
      {children}
    </div>
  );
};

export default LayoutBackground;