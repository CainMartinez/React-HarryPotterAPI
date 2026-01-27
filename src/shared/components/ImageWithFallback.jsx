import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de imagen con fallback automático
 * 
 * @component
 * @description
 * Maneja errores de carga de imágenes (404, 403, timeouts) mostrando
 * un placeholder o imagen alternativa. Implementa lazy loading y
 * estados de carga/error para mejorar UX.
 * 
 * @param {Object} props
 * @param {string} props.src - URL de la imagen principal
 * @param {string} props.alt - Texto alternativo
 * @param {string} props.fallback - URL de imagen de respaldo (opcional)
 * @param {React.ReactNode} props.placeholder - Elemento a mostrar si falla (opcional)
 * @param {string} props.className - Clases CSS
 * @param {Object} props.style - Estilos inline
 * @param {Function} props.onLoad - Callback cuando carga exitosamente
 * @param {Function} props.onError - Callback cuando falla la carga
 * 
 * @example
 * <ImageWithFallback
 *   src={character.image}
 *   alt={character.name}
 *   fallback="/images/placeholder.png"
 *   placeholder={<div className="avatar-placeholder">👤</div>}
 *   className="character-avatar"
 * />
 */
export function ImageWithFallback({
  src,
  alt,
  fallback = null,
  placeholder = null,
  className = '',
  style = {},
  onLoad = () => {},
  onError = () => {},
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  /**
   * Maneja el error de carga de imagen
   * Intenta usar fallback o muestra placeholder
   */
  const handleError = (e) => {
    console.warn(`[ImageWithFallback] Error loading image: ${imgSrc}`);
    
    // Si hay fallback y no lo hemos usado aún, intentar con él
    if (fallback && imgSrc !== fallback) {
      console.log(`[ImageWithFallback] Trying fallback: ${fallback}`);
      setImgSrc(fallback);
    } else {
      // No hay fallback o también falló, mostrar placeholder
      setHasError(true);
      setIsLoading(false);
      onError(e);
    }
  };

  /**
   * Maneja la carga exitosa de la imagen
   */
  const handleLoad = (e) => {
    console.log(`[ImageWithFallback] Image loaded successfully: ${imgSrc}`);
    setIsLoading(false);
    setHasError(false);
    onLoad(e);
  };

  // Si hay error y hay placeholder, mostrar placeholder
  if (hasError && placeholder) {
    return (
      <div className={`image-fallback ${className}`} style={style}>
        {placeholder}
      </div>
    );
  }

  // Si hay error y NO hay placeholder, mostrar div con emoji
  if (hasError && !placeholder) {
    return (
      <div 
        className={`image-fallback-default ${className}`} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'rgba(212, 175, 55, 0.1)',
          color: '#d4af37',
          fontSize: '2rem',
          ...style 
        }}
        title={alt}
      >
        🖼️
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div 
          className={`image-loading ${className}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(212, 175, 55, 0.05)',
            ...style
          }}
        >
          <div className="magical-spinner" />
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        style={{ 
          ...style,
          display: isLoading ? 'none' : 'block' 
        }}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        {...props}
      />
    </>
  );
}

ImageWithFallback.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  fallback: PropTypes.string,
  placeholder: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

export default ImageWithFallback;
