// InstagramIcon.jsx – custom Instagram logo component
import React from 'react';

// The PNG asset will be served from the public folder at /instagram.png
export default function InstagramIcon({ size = 20, alt = 'Instagram' }) {
  return (
    <img
      src="/instagram.png"
      alt={alt}
      width={size}
      height={size}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  );
}
