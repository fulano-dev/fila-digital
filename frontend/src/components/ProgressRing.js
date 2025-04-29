import React, { useState, useEffect } from 'react';

const ProgressRing = ({ color, time, onComplete, number }) => {
  const [progress, setProgress] = useState(0);  // Controla o progresso do anel
  const [isResetting, setIsResetting] = useState(false); // Flag para resetar a cor

  useEffect(() => {
    let startTime;
    let animationFrameId;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min((elapsed / (time * 1000)) * 100, 100); // Calcula a porcentagem do progresso com base no tempo

      setProgress(percent);

      if (percent < 100) {
        animationFrameId = requestAnimationFrame(animate); // Continua a animação até atingir 100%
      } else {
        // Ao atingir 100%, reinicia a contagem
        setIsResetting(true); // Aciona o reset da cor
        setTimeout(() => {
          setProgress(0); // Reseta o progresso
          setIsResetting(false); // Restaura a cor original
          startTime = Date.now(); // Reinicia o tempo
          animationFrameId = requestAnimationFrame(animate); // Reinicia a animação

          // Chama a função de callback quando o contador atinge o tempo
          if (onComplete) {
            onComplete();  // Função passada por parâmetro
          }
        }, 1000); // Após 1 segundo, reinicia o progresso
      }
    };

    startTime = Date.now();
    animationFrameId = requestAnimationFrame(animate); // Inicia a animação contínua

    return () => {
      cancelAnimationFrame(animationFrameId); // Limpa a animação ao desmontar o componente
    };
  }, [time, onComplete]); // Roda sempre que o tempo ou o callback mudar

  // Cálculos para o círculo de progresso
  const radius = 50;  // Raio do círculo
  const circumference = 2 * Math.PI * radius;  // Circunferência do círculo
  const offset = circumference - (progress / 100) * circumference;  // Deslocamento do traçado

  return (
    <svg width={120} height={120}>
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="transparent"
        stroke="#ddd"  // Cor do fundo
        strokeWidth="10"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="transparent"
        stroke={isResetting ? '#fff' : color}  // Cor do progresso, muda para branco durante o reset
        strokeWidth="10"
        strokeDasharray={circumference}  // Controla o comprimento total do traçado
        strokeDashoffset={offset}  // Controla o deslocamento do traçado
        transform="rotate(-90 60 60)" // Rotaciona o traçado para começar do topo (12 horas)
        transition="stroke-dashoffset 0.5s ease-in-out" // Suaviza a transição do preenchimento
      />
      <text
        x="50%" // Alinha o texto no centro do círculo
        y="53%" // Alinha o texto no centro do círculo
        dominantBaseline="middle" // Alinha verticalmente o texto
        textAnchor="middle" // Alinha horizontalmente o texto
        fontSize="50" // Tamanho da fonte
        fill={color} // Cor do número no centro
      >
        {number}
      </text>
    </svg>
  );
};

export default ProgressRing;