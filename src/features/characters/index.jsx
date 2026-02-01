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
            <div className="character-header">
              <h3 className="character-name">{character.displayName}</h3>
              {character.house && (
                <span
                  className="house-badge-header"
                  style={{ background: character.house.colorGradient }}
                >
                  {character.house.name}
                </span>
              )}
            </div>

            <div className="character-body">
              <div className="character-image-container">
                <img
                  src={character.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(character.displayName)}&size=300&background=d4af37&color=1a1a2e&bold=true`}
                  alt={character.name}
                  className="character-image-normal"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(character.displayName)}&size=300&background=d4af37&color=1a1a2e&bold=true`;
                  }}
                />
              </div>

              <table className="character-details-table">
                <tbody>
                  {character.actor && (
                    <tr>
                      <td className="table-label">🎭 Actor</td>
                      <td className="table-value">{character.actor}</td>
                    </tr>
                  )}
                  {character.species && (
                    <tr>
                      <td className="table-label">🧬 Especie</td>
                      <td className="table-value">{character.species}</td>
                    </tr>
                  )}
                  {character.gender && (
                    <tr>
                      <td className="table-label">👤 Género</td>
                      <td className="table-value">{character.gender === 'male' ? 'Masculino' : 'Femenino'}</td>
                    </tr>
                  )}
                  {character.dateOfBirth && (
                    <tr>
                      <td className="table-label">🎂 Nacimiento</td>
                      <td className="table-value">{character.dateOfBirth}</td>
                    </tr>
                  )}
                  {character.ancestry && character.ancestry !== 'unknown' && (
                    <tr>
                      <td className="table-label">📜 Ascendencia</td>
                      <td className="table-value">{character.ancestry}</td>
                    </tr>
                  )}
                  {character.eyeColour && (
                    <tr>
                      <td className="table-label">👁️ Ojos</td>
                      <td className="table-value">{character.eyeColour}</td>
                    </tr>
                  )}
                  {character.hairColour && (
                    <tr>
                      <td className="table-label">💈 Cabello</td>
                      <td className="table-value">{character.hairColour}</td>
                    </tr>
                  )}
                  {character.patronus && (
                    <tr>
                      <td className="table-label">✨ Patronus</td>
                      <td className="table-value">{character.patronus}</td>
                    </tr>
                  )}
                  {character.wand?.wood && (
                    <tr>
                      <td className="table-label">🪄 Varita</td>
                      <td className="table-value">
                        {character.wand.wood}
                        {character.wand.core && `, ${character.wand.core}`}
                        {character.wand.length && `, ${character.wand.length}"`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="character-footer">
              {character.isStudent && (
                <span className="role-badge student">🎓 Estudiante</span>
              )}
              {character.isStaff && (
                <span className="role-badge staff">👨‍🏫 Personal</span>
              )}
              {!character.isStudent && !character.isStaff && (
                <span className="role-badge other">✨ Personaje</span>
              )}
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

            <div className="modal-horizontal-layout">
              <div className="modal-left-section">
                <div className="modal-image-container">
                  <div className="modal-diamond-frame">
                    <img
                      src={selectedCharacter.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCharacter.displayName)}&size=400&background=d4af37&color=1a1a2e&bold=true`}
                      alt={selectedCharacter.name}
                      className="modal-image-diamond"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCharacter.displayName)}&size=400&background=d4af37&color=1a1a2e&bold=true`;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-right-section">
                <div className="modal-header-new">
                  <h2 className="modal-title-new">{selectedCharacter.displayName}</h2>
                  {selectedCharacter.alternateNames?.length > 0 && (
                    <p className="modal-alternate-new">
                      {selectedCharacter.alternateNames.join(', ')}
                    </p>
                  )}
                  {selectedCharacter.house && (
                    <span
                      className="modal-house-badge"
                      style={{ background: selectedCharacter.house.colorGradient }}
                    >
                      {selectedCharacter.house.name}
                    </span>
                  )}
                </div>

                <table className="modal-details-table">
                  <tbody>
                    {selectedCharacter.actor && (
                      <tr>
                        <td className="modal-table-label">🎭 Actor</td>
                        <td className="modal-table-value">{selectedCharacter.actor}</td>
                      </tr>
                    )}
                    {selectedCharacter.species && (
                      <tr>
                        <td className="modal-table-label">🧬 Especie</td>
                        <td className="modal-table-value">{selectedCharacter.species}</td>
                      </tr>
                    )}
                    {selectedCharacter.gender && (
                      <tr>
                        <td className="modal-table-label">👤 Género</td>
                        <td className="modal-table-value">{selectedCharacter.gender === 'male' ? 'Masculino' : 'Femenino'}</td>
                      </tr>
                    )}
                    {selectedCharacter.dateOfBirth && (
                      <tr>
                        <td className="modal-table-label">🎂 Nacimiento</td>
                        <td className="modal-table-value">{selectedCharacter.dateOfBirth}</td>
                      </tr>
                    )}
                    {selectedCharacter.ancestry && selectedCharacter.ancestry !== 'unknown' && (
                      <tr>
                        <td className="modal-table-label">📜 Ascendencia</td>
                        <td className="modal-table-value">{selectedCharacter.ancestry}</td>
                      </tr>
                    )}
                    {selectedCharacter.eyeColour && (
                      <tr>
                        <td className="modal-table-label">👁️ Ojos</td>
                        <td className="modal-table-value">{selectedCharacter.eyeColour}</td>
                      </tr>
                    )}
                    {selectedCharacter.hairColour && (
                      <tr>
                        <td className="modal-table-label">💈 Cabello</td>
                        <td className="modal-table-value">{selectedCharacter.hairColour}</td>
                      </tr>
                    )}
                    {selectedCharacter.patronus && (
                      <tr>
                        <td className="modal-table-label">✨ Patronus</td>
                        <td className="modal-table-value">{selectedCharacter.patronus}</td>
                      </tr>
                    )}
                    {selectedCharacter.wand?.wood && (
                      <tr>
                        <td className="modal-table-label">🪄 Varita</td>
                        <td className="modal-table-value">
                          {selectedCharacter.wand.wood}
                          {selectedCharacter.wand.core && `, ${selectedCharacter.wand.core}`}
                          {selectedCharacter.wand.length && `, ${selectedCharacter.wand.length}"`}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="modal-table-label">🧙 Rol</td>
                      <td className="modal-table-value">
                        {selectedCharacter.isStudent ? '🎓 Estudiante' : ''}
                        {selectedCharacter.isStaff ? '👨‍🏫 Personal' : ''}
                        {!selectedCharacter.isStudent && !selectedCharacter.isStaff ? '✨ Personaje' : ''}
                      </td>
                    </tr>
                    {selectedCharacter.alternateActors?.length > 0 && (
                      <tr>
                        <td className="modal-table-label">🎬 Otros</td>
                        <td className="modal-table-value">{selectedCharacter.alternateActors.join(', ')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
