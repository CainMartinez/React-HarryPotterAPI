import React, { useState } from 'react';
import { useSpells } from '../../core/hooks';
import { Loading, ErrorMessage } from '../../shared/components';
import './Spells.css';

export default function Spells() {
  const { data: spells, loading, error, refetch } = useSpells();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpells = spells?.filter(spell =>
    spell.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) return <Loading message="Conjurando hechizos..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="spells-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="title-icon">🪄</span>
          Hechizos y Encantamientos
        </h1>
        <p className="page-subtitle">Los conjuros más poderosos del mundo mágico</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Buscar hechizo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <p className="search-info">
            {filteredSpells.length} hechizo{filteredSpells.length !== 1 ? 's' : ''} encontrado
            {filteredSpells.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="spells-grid">
        {filteredSpells.map((spell) => (
          <div key={spell.id} className="spell-card">
            <div className="spell-icon">✨</div>
            <h3 className="spell-name">{spell.displayName}</h3>
            {spell.hasDescription ? (
              <p className="spell-description">{spell.description}</p>
            ) : (
              <p className="spell-no-description">Descripción no disponible</p>
            )}
          </div>
        ))}
      </div>

      {filteredSpells.length === 0 && !loading && (
        <div className="no-results">
          <p>🔮 No se encontraron hechizos con ese nombre</p>
        </div>
      )}
    </div>
  );
}
