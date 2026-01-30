import React, { useState } from 'react';
import { useStaff } from '../../core/hooks';
import { Loading, ErrorMessage } from '../../shared/components';
import './Staff.css';

export default function Staff() {
  const { data: staff, loading, error, refetch } = useStaff();
  const [selectedStaff, setSelectedStaff] = useState(null);

  if (loading) return <Loading message="Convocando al personal..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="staff-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="title-icon">👨‍🏫</span>
          Personal de Hogwarts
        </h1>
        <p className="page-subtitle">Los profesores y personal del castillo</p>
      </div>

      <div className="staff-grid">
        {staff?.map((member) => (
          <div
            key={member.id}
            className="staff-card"
            onClick={() => setSelectedStaff(member)}
          >
            <div className="staff-card-image-section">
              <img
                src={member.image || 'https://via.placeholder.com/200x280.png?text=Sin+Foto'}
                alt={member.name}
                className="staff-card-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x280.png?text=Sin+Foto';
                }}
              />
              {member.house && (
                <div className="staff-house-tag" style={{ background: member.house.colorGradient }}>
                  {member.house.name}
                </div>
              )}
            </div>

            <div className="staff-card-content">
              <h3 className="staff-card-name">{member.displayName}</h3>
              
              <div className="staff-card-details">
                {member.actor && (
                  <div className="staff-detail-item">
                    <span className="staff-icon">🎭</span>
                    <span className="staff-text">{member.actor}</span>
                  </div>
                )}
                {member.species && (
                  <div className="staff-detail-item">
                    <span className="staff-icon">🧬</span>
                    <span className="staff-text">{member.species}</span>
                  </div>
                )}
                {member.ancestry && member.ancestry !== 'unknown' && (
                  <div className="staff-detail-item">
                    <span className="staff-icon">📜</span>
                    <span className="staff-text">{member.ancestry}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedStaff && (
        <div className="modal-overlay" onClick={() => setSelectedStaff(null)}>
          <div className="modal-content-staff" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-staff" onClick={() => setSelectedStaff(null)}>
              ✕
            </button>

            <div className="modal-staff-layout">
              <div className="modal-staff-left">
                <img
                  src={selectedStaff.image || 'https://via.placeholder.com/300x420.png?text=Sin+Foto'}
                  alt={selectedStaff.name}
                  className="modal-staff-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x420.png?text=Sin+Foto';
                  }}
                />
              </div>

              <div className="modal-staff-right">
                <h2 className="modal-staff-title">{selectedStaff.displayName}</h2>
                
                {selectedStaff.alternateNames?.length > 0 && (
                  <p className="modal-staff-subtitle">
                    {selectedStaff.alternateNames.join(', ')}
                  </p>
                )}

                <div className="modal-staff-grid">
                  {selectedStaff.house && (
                    <div className="modal-staff-item">
                      <div className="modal-staff-label">🏠 Casa</div>
                      <div className="modal-staff-badge" style={{ background: selectedStaff.house.colorGradient }}>
                        {selectedStaff.house.name}
                      </div>
                    </div>
                  )}
                  {selectedStaff.actor && (
                    <div className="modal-staff-item">
                      <div className="modal-staff-label">🎭 Actor</div>
                      <div className="modal-staff-value">{selectedStaff.actor}</div>
                    </div>
                  )}
                  {selectedStaff.species && (
                    <div className="modal-staff-item">
                      <div className="modal-staff-label">🧬 Especie</div>
                      <div className="modal-staff-value">{selectedStaff.species}</div>
                    </div>
                  )}
                  {selectedStaff.gender && (
                    <div className="modal-staff-item">
                      <div className="modal-staff-label">👤 Género</div>
                      <div className="modal-staff-value">{selectedStaff.gender === 'male' ? 'Masculino' : 'Femenino'}</div>
                    </div>
                  )}
                  {selectedStaff.ancestry && selectedStaff.ancestry !== 'unknown' && (
                    <div className="modal-staff-item">
                      <div className="modal-staff-label">📜 Ascendencia</div>
                      <div className="modal-staff-value">{selectedStaff.ancestry}</div>
                    </div>
                  )}
                  {selectedStaff.patronus && (
                    <div className="modal-staff-item">
                      <div className="modal-staff-label">✨ Patronus</div>
                      <div className="modal-staff-value">{selectedStaff.patronus}</div>
                    </div>
                  )}
                  {selectedStaff.wand?.wood && (
                    <div className="modal-staff-item">
                      <div className="modal-staff-label">🪄 Varita</div>
                      <div className="modal-staff-value">
                        {selectedStaff.wand.wood}
                        {selectedStaff.wand.core && `, ${selectedStaff.wand.core}`}
                        {selectedStaff.wand.length && `, ${selectedStaff.wand.length}"`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
