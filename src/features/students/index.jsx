import React, { useState } from 'react';
import { useStudents } from '../../core/hooks';
import { Loading, ErrorMessage } from '../../shared/components';
import './Students.css';

export default function Students() {
  const { data: students, loading, error, refetch } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState(null);

  if (loading) return <Loading message="Reuniendo estudiantes..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="students-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="title-icon">🎓</span>
          Estudiantes de Hogwarts
        </h1>
        <p className="page-subtitle">Los aprendices de magia del colegio</p>
      </div>

      <div className="students-grid">
        {students?.map((student) => (
          <div
            key={student.id}
            className="student-card"
            onClick={() => setSelectedStudent(student)}
          >
            <div className="student-hexagon-wrapper">
              <div className="student-hexagon">
                <img
                  src={student.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.displayName)}&size=240&background=c864ff&color=fff&bold=true`}
                  alt={student.name}
                  className="student-hexagon-image"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.displayName)}&size=240&background=c864ff&color=fff&bold=true`;
                  }}
                />
              </div>
            </div>

            <div className="student-card-info">
              <h3 className="student-card-name">{student.displayName}</h3>
              
              {student.house && (
                <div className="student-house-container">
                  <span
                    className="student-house-tag"
                    style={{ background: student.house.colorGradient }}
                  >
                    {student.house.name}
                  </span>
                </div>
              )}

              <div className="student-meta">
                {student.dateOfBirth && (
                  <div className="student-meta-item">
                    <span>🎂</span>
                    <span>{student.dateOfBirth}</span>
                  </div>
                )}
                {student.actor && (
                  <div className="student-meta-item">
                    <span>🎭</span>
                    <span>{student.actor}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content-student" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-student" onClick={() => setSelectedStudent(null)}>
              ✕
            </button>

            <div className="modal-student-hero">
              <div className="modal-student-image-circle">
                <img
                  src={selectedStudent.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.displayName)}&size=280&background=c864ff&color=fff&bold=true`}
                  alt={selectedStudent.name}
                  className="modal-circle-img"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.displayName)}&size=280&background=c864ff&color=fff&bold=true`;
                  }}
                />
              </div>
              
              <div className="modal-student-header">
                <h2 className="modal-student-name">{selectedStudent.displayName}</h2>
                
                {selectedStudent.alternateNames?.length > 0 && (
                  <p className="modal-student-alt">
                    {selectedStudent.alternateNames.join(' • ')}
                  </p>
                )}

                {selectedStudent.house && (
                  <span
                    className="modal-student-house-big"
                    style={{ background: selectedStudent.house.colorGradient }}
                  >
                    {selectedStudent.house.name}
                  </span>
                )}
              </div>
            </div>

            <div className="modal-student-details">
              {selectedStudent.species && (
                <div className="student-detail-card">
                  <div className="detail-card-icon">🧬</div>
                  <div className="detail-card-content">
                    <div className="detail-card-label">Especie</div>
                    <div className="detail-card-value">{selectedStudent.species}</div>
                  </div>
                </div>
              )}
              {selectedStudent.gender && (
                <div className="student-detail-card">
                  <div className="detail-card-icon">👤</div>
                  <div className="detail-card-content">
                    <div className="detail-card-label">Género</div>
                    <div className="detail-card-value">{selectedStudent.gender === 'male' ? 'Masculino' : 'Femenino'}</div>
                  </div>
                </div>
              )}
              {selectedStudent.dateOfBirth && (
                <div className="student-detail-card">
                  <div className="detail-card-icon">🎂</div>
                  <div className="detail-card-content">
                    <div className="detail-card-label">Nacimiento</div>
                    <div className="detail-card-value">{selectedStudent.dateOfBirth}</div>
                  </div>
                </div>
              )}
              {selectedStudent.patronus && (
                <div className="student-detail-card">
                  <div className="detail-card-icon">✨</div>
                  <div className="detail-card-content">
                    <div className="detail-card-label">Patronus</div>
                    <div className="detail-card-value">{selectedStudent.patronus}</div>
                  </div>
                </div>
              )}
              {selectedStudent.wand?.wood && (
                <div className="student-detail-card">
                  <div className="detail-card-icon">🪄</div>
                  <div className="detail-card-content">
                    <div className="detail-card-label">Varita</div>
                    <div className="detail-card-value">
                      {selectedStudent.wand.wood}
                      {selectedStudent.wand.core && `, ${selectedStudent.wand.core}`}
                      {selectedStudent.wand.length && `, ${selectedStudent.wand.length}"`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
