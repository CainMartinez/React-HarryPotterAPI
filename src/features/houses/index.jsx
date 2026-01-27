import React, { useState, useEffect } from 'react';
import { useHouses } from '../../core/hooks';
import { CharacterService } from '../../core/services/CharacterService';
import { Loading, ErrorMessage } from '../../shared/components';
import './Houses.css';

export default function Houses() {
  const { data: houses, loading, error, refetch } = useHouses();
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [houseCharacters, setHouseCharacters] = useState([]);
  const [loadingCharacters, setLoadingCharacters] = useState(false);

  // Cargar personajes cuando se selecciona una casa
  useEffect(() => {
    if (selectedHouse?.name) {
      setLoadingCharacters(true);
      CharacterService.getByHouse(selectedHouse.name)
        .then(characters => {
          setHouseCharacters(characters);
          setLoadingCharacters(false);
        })
        .catch(err => {
          console.error('Error loading house characters:', err);
          setLoadingCharacters(false);
        });
    } else {
      setHouseCharacters([]);
    }
  }, [selectedHouse]);

  if (loading) return <Loading message="Convocando las casas de Hogwarts..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const handleHouseClick = (house) => {
    setSelectedHouse(selectedHouse?.name === house.name ? null : house);
  };

  return (
    <div className="houses-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="title-icon">🏰</span>
          Casas de Hogwarts
        </h1>
        <p className="page-subtitle">Las cuatro grandes casas del Colegio Hogwarts de Magia y Hechicería</p>
      </div>

      <div className="houses-grid">
        {houses?.map((house) => (
          <div key={house.name} className="house-card-wrapper">
            <div 
              className={`house-card ${selectedHouse?.name === house.name ? 'house-card-selected' : ''}`}
              onClick={() => handleHouseClick(house)}
            >
              <div
                className="house-header"
                style={{ background: house.colorGradient }}
              >
                <div className="house-animal">{house.animal}</div>
                <h2 className="house-name">{house.name}</h2>
                <p className="house-founder">Fundador: {house.founder}</p>
              </div>

            <div className="house-body">
              <div className="house-element">
                <span className="element-icon">{house.element}</span>
                <span className="element-label">Elemento</span>
              </div>

              <div className="house-traits">
                <h3 className="traits-title">Características:</h3>
                <p className="traits-text">{house.traits}</p>
              </div>

              <div className="house-description">
                <p>{house.description}</p>
              </div>

              <div className="house-colors">
                <span className="color-label">Colores:</span>
                <div className="color-swatches">
                  <div
                    className="color-swatch"
                    style={{ backgroundColor: house.primaryColor }}
                    title={house.primaryColor}
                  />
                  <div
                    className="color-swatch"
                    style={{ backgroundColor: house.secondaryColor }}
                    title={house.secondaryColor}
                  />
                </div>
              </div>
            </div>

            {selectedHouse?.name === house.name && (
              <div className="house-characters-section">
                <h3 className="house-characters-title">
                  <span className="characters-icon">👥</span>
                  Miembros de {house.name}
                </h3>
                
                {loadingCharacters ? (
                  <div className="characters-loading">Cargando miembros...</div>
                ) : (
                  <div className="house-characters-grid">
                    {houseCharacters?.map((character) => (
                      <div key={character.id} className="house-character-mini">
                        {character.hasImage ? (
                          <img 
                            src={character.image} 
                            alt={character.name}
                            className="character-mini-img"
                          />
                        ) : (
                          <div className="character-mini-placeholder">👤</div>
                        )}
                        <p className="character-mini-name">{character.displayName}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
