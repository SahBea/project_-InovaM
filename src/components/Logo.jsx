import React from 'react';

export default function Logo({ className = '', height = 45, light = false }) {
  // Configurações de cores baseadas nas preferências do tema
  const textColor = light ? '#FFFFFF' : 'var(--text)';
  const accentColor = 'var(--accent)'; // Tom cobre/madeira quente do logo original

  // Geração dos dentes da serra para a lâmina cortada ao meio (semicírculo superior)
  const teeth = [];
  const teethCount = 15;
  const cx = 45;       // Centro X da serra
  const cy = 52;       // Centro Y da serra (alinhado com a linha horizontal)
  const rInner = 22;   // Raio interno
  const rOuter = 26;   // Raio externo (ponta do dente)

  for (let i = 0; i < teethCount; i++) {
    // Ângulos de 180° (esquerda) até 360° (direita)
    const angleStart = 180 + (i * 180) / teethCount;
    const angleTip = 180 + ((i + 0.6) * 180) / teethCount;
    const angleEnd = 180 + ((i + 1) * 180) / teethCount;

    const radStart = (angleStart * Math.PI) / 180;
    const radTip = (angleTip * Math.PI) / 180;
    const radEnd = (angleEnd * Math.PI) / 180;

    const x1 = cx + Math.cos(radStart) * rInner;
    const y1 = cy + Math.sin(radStart) * rInner;
    const x2 = cx + Math.cos(radTip) * rOuter;
    const y2 = cy + Math.sin(radTip) * rOuter;
    const x3 = cx + Math.cos(radEnd) * rInner;
    const y3 = cy + Math.sin(radEnd) * rInner;

    teeth.push(
      <polygon 
        key={i}
        points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
        fill={textColor}
      />
    );
  }

  // Altura padrão baseada no aspecto original 320x80 (proporção 4:1)
  const width = height * 4;

  return (
    <svg 
      viewBox="0 0 320 80" 
      width={width} 
      height={height} 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Linha Horizontal com pequenos círculos nas pontas */}
      <line 
        x1="15" 
        y1="52" 
        x2="305" 
        y2="52" 
        stroke={textColor} 
        strokeWidth="2" 
      />
      <circle cx="15" cy="52" r="3" fill={textColor} />
      <circle cx="305" cy="52" r="3" fill={textColor} />

      {/* Lâmina de Serra em Semicírculo (com o furo central recortado) */}
      <path 
        d="M 22 52 A 23 23 0 0 1 68 52 L 51 52 A 6 6 0 0 0 39 52 Z" 
        fill={textColor} 
      />
      
      {/* Desenho dos dentes da serra */}
      {teeth}

      {/* Texto INOVA (Tom rose gold / cobre destacado) */}
      <text 
        x="80" 
        y="44" 
        fill={accentColor} 
        fontFamily="var(--font-heading)" 
        fontSize="42px" 
        fontWeight="800" 
        letterSpacing="4px"
      >
        INOVA
      </text>

      {/* Texto MÓVEIS PLANEJADOS */}
      <text 
        x="160" 
        y="71" 
        fill={textColor} 
        fontFamily="var(--font-heading)" 
        fontSize="11px" 
        fontWeight="500" 
        letterSpacing="6px" 
        textAnchor="middle"
      >
        MÓVEIS PLANEJADOS
      </text>
    </svg>
  );
}
