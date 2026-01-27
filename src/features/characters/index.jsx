import React, { useState } from 'react';
import { useCharacters } from '../../core/hooks';
import { Loading, ErrorMessage } from '../../shared/components';
import './Characters.css';

export default function Characters() {
  const { data: characters, loading, error, refetch } = useCharacters();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const filteredCharacters = characters?.filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) return <Loading message="Invocando personajes..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="characters-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="title-icon">👤</span>
          Personajes del Mundo Mágico
        </h1>
        <p className="page-subtitle">Descubre a los brujos, magos y criaturas mágicas</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Buscar personaje por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="search-info">
          {searchTerm && (
            <p>
              {filteredCharacters.length} personaje{filteredCharacters.length !== 1 ? 's' : ''} encontrado
              {filteredCharacters.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="characters-grid">
        {filteredCharacters.map((character) => (
          <div
            key={character.id}
            className="character-card"
            onClick={() => setSelectedCharacter(character)}
          >
            <div className="character-image-container">
              {character.hasImage ? (
                <img
                  src={character.image}
                  alt={character.name}
                  className="character-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="character-placeholder" style={{ display: character.hasImage ? 'none' : 'flex' }}>
                👤
              </div>
            </div>

            <div className="character-info">
              <h3 className="character-name">{character.displayName}</h3>
              
              {character.house && (
                <span
                  className="house-badge"
                  style={{ background: character.house.colorGradient }}
                >
                  {character.house.name}
                </span>
              )}

              <div className="character-details">
                {character.species && (
                  <p className="detail-item">
                    <span className="detail-icon">🧬</span>
                    {character.species}
                  </p>
                )}
                
                {character.ancestry && (
                  <p className="detail-item">
                    <span className="detail-icon">📜</span>
                    {character.ancestry}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCharacter && (
        <div className="modal-overlay" onClick={() => setSelectedCharacter(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCharacter(null)}>
              ✕
            </button>

            <div className="modal-header">
              {selectedCharacter.hasImage ? (
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="modal-image"
                />
              ) : (
                <div className="modal-placeholder">👤</div>
              )}
              
              <div className="modal-title-section">
                <h2 className="modal-title">{selectedCharacter.displayName}</h2>
                {selectedCharacter.alternateNames?.length > 0 && (
                  <p className="modal-alternate">
                    También conocido como: {selectedCharacter.alternateNames.join(', ')}
                  </p>
                )}
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-info-grid">
                {selectedCharacter.house && (
                  <div className="modal-info-item">
                    <span className="info-label">🏠 Casa:</span>
                    <span
                      className="house-badge-large"
                      style={{ background: selectedCharacter.house.colorGradient }}
                    >
                      {selectedCharacter.house.name}
                    </span>
                  </div>
                )}

                {selectedCharacter.species && (
                  <div className="modal-info-item">
                    <span className="info-label">🧬 Especie:</span>
                    <span className="info-value">{selectedCharacter.species}</span>
                  </div>
                )}

                {selectedCharacter.gender && (
                  <div className="modal-info-item">
                    <span className="info-label">👤 Género:</span>
                    <span className="info-value">{selectedCharacter.gender}</span>
                  </div>
                )}

                {selectedCharacter.dateOfBirth && (
                  <div className="modal-info-item">
                    <span className="info-label">🎂 Nacimiento:</span>
                    <span className="info-value">{selectedCharacter.dateOfBirth}</span>
                  </div>
                )}

                {selectedCharacter.ancestry && (
                  <div className="modal-info-item">
                    <span className="info-label">📜 Ascendencia:</span>
                    <span className="info-value">{selectedCharacter.ancestry}</span>
                  </div>
                )}

                {selectedCharacter.eyeColour && (
                  <div className="modal-info-item">
                    <span className="info-label">👁️ Ojos:</span>
                    <span className="info-value">{selectedCharacter.eyeColour}</span>
                  </div>
                )}

                {selectedCharacter.hairColour && (
                  <div className="modal-info-item">
                    <span className="info-label">💈 Cabello:</span>
                    <span className="info-value">{selectedCharacter.hairColour}</span>
                  </div>
                )}

                {selectedCharacter.wand?.wood && (
                  <div className="modal-info-item">
                    <span className="info-label">🪄 Varita:</span>
                    <span className="info-value">
                      {selectedCharacter.wand.wood}
                      {selectedCharacter.wand.core && `, ${selectedCharacter.wand.core}`}
                      {selectedCharacter.wand.length && `, ${selectedCharacter.wand.length}"`}
                    </span>
                  </div>
                )}

                {selectedCharacter.patronus && (
                  <div className="modal-info-item">
                    <span className="info-label">✨ Patronus:</span>
                    <span className="info-value">{selectedCharacter.patronus}</span>
                  </div>
                )}

                <div className="modal-info-item">
                  <span className="info-label">🧙 Rol:</span>
                  <span className="info-value">
                    {selectedCharacter.isStudent ? '🎓 Estudiante' : ''}
                    {selectedCharacter.isStaff ? '👨‍🏫 Personal' : ''}
                    {!selectedCharacter.isStudent && !selectedCharacter.isStaff ? 'Personaje' : ''}
                  </span>
                </div>

                {selectedCharacter.actor && (
                  <div className="modal-info-item full-width">
                    <span className="info-label">🎭 Interpretado por:</span>
                    <span className="info-value">{selectedCharacter.actor}</span>
                  </div>
                )}

                {selectedCharacter.alternateActors?.length > 0 && (
                  <div className="modal-info-item full-width">
                    <span className="info-label">🎬 Otros actores:</span>
                    <span className="info-value">{selectedCharacter.alternateActors.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredCharacters.length === 0 && !loading && (
        <div className="no-results">
          <p>✨ No se encontraron personajes con ese nombre</p>
        </div>
      )}
    </div>
  );
}
