import React, { useEffect } from 'react';
import { useCats } from '../../core/hooks';
import { Loading, ErrorMessage } from '../../shared/components';
import './Cats.css';

export default function Cats() {
  const { cats, loading, error, loadMore, refresh, hasMore } = useCats(10);

  useEffect(() => {
    refresh();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading && cats.length === 0) {
    return <Loading message="Invocando amigos de Mrs Norris..." />;
  }

  if (error && cats.length === 0) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <div className="cats-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="title-icon">🐱</span>
          Amigos de Mrs Norris
        </h1>
        <p className="page-subtitle">Los gatos más mágicos del mundo felino</p>
      </div>

      <div className="cats-grid">
        {cats.map((cat) => (
          <div key={cat.id} className="cat-card">
            <div className="cat-image-container">
              <img
                src={cat.url}
                alt={cat.breedName || 'Gato mágico'}
                className="cat-image"
                loading="lazy"
              />
            </div>

            <div className="cat-info">
              {cat.hasBreedInfo && (
                <>
                  <h3 className="cat-breed">{cat.breedName}</h3>
                  
                  {cat.temperament && (
                    <p className="cat-temperament">
                      <span className="info-icon">😸</span>
                      {cat.temperament}
                    </p>
                  )}

                  {cat.origin && (
                    <p className="cat-origin">
                      <span className="info-icon">🌍</span>
                      {cat.origin}
                    </p>
                  )}

                  {cat.lifeSpan && (
                    <p className="cat-lifespan">
                      <span className="info-icon">⏳</span>
                      {cat.lifeSpan} años
                    </p>
                  )}

                  {cat.description && (
                    <p className="cat-description">{cat.description}</p>
                  )}
                </>
              )}

              {!cat.hasBreedInfo && (
                <p className="cat-no-breed">Gato mágico sin raza específica</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && cats.length > 0 && (
        <div className="load-error">
          <p>❌ Error al cargar más gatos: {error}</p>
        </div>
      )}

      <div className="load-more-container">
        {hasMore && !loading && (
          <button className="load-more-button" onClick={loadMore}>
            🐾 Cargar más gatos
          </button>
        )}

        {loading && cats.length > 0 && (
          <p className="loading-more">Invocando más gatos...</p>
        )}
      </div>
    </div>
  );
}
