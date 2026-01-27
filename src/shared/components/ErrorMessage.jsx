import React from 'react';
import './ErrorMessage.css';

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p className="error-text">{message || 'Algo salió mal en el mundo mágico...'}</p>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          🔄 Intentar de nuevo
        </button>
      )}
    </div>
  );
}
