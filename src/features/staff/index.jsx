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
            <div className="staff-image-container">
              {member.hasImage ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="staff-image"
                />
              ) : (
                <div className="staff-placeholder">👨‍🏫</div>
              )}
            </div>

            <div className="staff-info">
              <h3 className="staff-name">{member.displayName}</h3>
              
              {member.house && (
                <span
                  className="house-badge"
                  style={{ background: member.house.colorGradient }}
                >
                  {member.house.name}
                </span>
              )}

              {member.ancestry && (
                <p className="staff-detail">
                  <span className="detail-icon">📜</span>
                  {member.ancestry}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedStaff && (
        <div className="modal-overlay" onClick={() => setSelectedStaff(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedStaff(null)}>
              ✕
            </button>

            <div className="modal-header">
              {selectedStaff.hasImage ? (
                <img
                  src={selectedStaff.image}
                  alt={selectedStaff.name}
                  className="modal-image"
                />
              ) : (
                <div className="modal-placeholder">👨‍🏫</div>
              )}
              
              <h2 className="modal-title">{selectedStaff.displayName}</h2>
            </div>

            <div className="modal-body">
              <div className="modal-info-grid">
                {selectedStaff.house && (
                  <div className="modal-info-item">
                    <span className="info-label">🏠 Casa:</span>
                    <span
                      className="house-badge-large"
                      style={{ background: selectedStaff.house.colorGradient }}
                    >
                      {selectedStaff.house.name}
                    </span>
                  </div>
                )}

                {selectedStaff.wand?.wood && (
                  <div className="modal-info-item">
                    <span className="info-label">🪄 Varita:</span>
                    <span className="info-value">
                      {selectedStaff.wand.wood}
                      {selectedStaff.wand.core && `, ${selectedStaff.wand.core}`}
                    </span>
                  </div>
                )}

                {selectedStaff.patronus && (
                  <div className="modal-info-item">
                    <span className="info-label">✨ Patronus:</span>
                    <span className="info-value">{selectedStaff.patronus}</span>
                  </div>
                )}

                {selectedStaff.actor && (
                  <div className="modal-info-item full-width">
                    <span className="info-label">🎭 Actor:</span>
                    <span className="info-value">{selectedStaff.actor}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
