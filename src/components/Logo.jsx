import React from 'react';

export default function Logo({ className = '', height = 45, light = false }) {
  const primaryColor = light ? '#FFFFFF' : 'var(--primary)';
  const secondaryColor = light ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-muted)';
  const accentColor = 'var(--accent)';

  return (
    <div className={`logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Saw Blade Icon */}
      <svg
        width={height}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <circle cx="50" cy="50" r="38" fill="none" stroke={primaryColor} strokeWidth="6" strokeDasharray="12 4" />
        <circle cx="50" cy="50" r="24" fill="none" stroke={accentColor} strokeWidth="4" />
        <circle cx="50" cy="50" r="8" fill={primaryColor} />
        {/* Teeth */}
        {[...Array(16)].map((_, i) => {
          const angle = (i * 360) / 16;
          const rad = (angle * Math.PI) / 180;
          const x1 = 50 + Math.cos(rad) * 38;
          const y1 = 50 + Math.sin(rad) * 38;
          const x2 = 50 + Math.cos(rad + 0.1) * 44;
          const y2 = 50 + Math.sin(rad + 0.1) * 44;
          const x3 = 50 + Math.cos(rad + 0.2) * 38;
          const y3 = 50 + Math.sin(rad + 0.2) * 38;
          return (
            <path
              key={i}
              d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`}
              fill={primaryColor}
            />
          );
        })}
      </svg>

      {/* Brand Name Text */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.6rem',
            fontWeight: '800',
            color: primaryColor,
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Inova
        </span>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.62rem',
            fontWeight: '600',
            color: secondaryColor,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}
        >
          Móveis Planejados
        </span>
      </div>
    </div>
  );
}
