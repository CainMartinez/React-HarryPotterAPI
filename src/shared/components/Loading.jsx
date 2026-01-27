import React from 'react';
import './Loading.css';

export function Loading({ message = 'Cargando magia...' }) {
  return (
    <div className="loading-container">
      <div className="wand">✨</div>
      <p className="loading-text">{message}</p>
    </div>
  );
}
