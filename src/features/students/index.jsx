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
            <div className="student-image-container">
              {student.hasImage ? (
                <img
                  src={student.image}
                  alt={student.name}
                  className="student-image"
                />
              ) : (
                <div className="student-placeholder">🎓</div>
              )}
            </div>

            <div className="student-info">
              <h3 className="student-name">{student.displayName}</h3>
              
              {student.house && (
                <span
                  className="house-badge"
                  style={{ background: student.house.colorGradient }}
                >
                  {student.house.name}
                </span>
              )}

              {student.dateOfBirth && (
                <p className="student-detail">
                  <span className="detail-icon">🎂</span>
                  {student.dateOfBirth}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedStudent(null)}>
              ✕
            </button>

            <div className="modal-header">
              {selectedStudent.hasImage ? (
                <img
                  src={selectedStudent.image}
                  alt={selectedStudent.name}
                  className="modal-image"
                />
              ) : (
                <div className="modal-placeholder">🎓</div>
              )}
              
              <h2 className="modal-title">{selectedStudent.displayName}</h2>
            </div>

            <div className="modal-body">
              <div className="modal-info-grid">
                {selectedStudent.house && (
                  <div className="modal-info-item">
                    <span className="info-label">🏠 Casa:</span>
                    <span
                      className="house-badge-large"
                      style={{ background: selectedStudent.house.colorGradient }}
                    >
                      {selectedStudent.house.name}
                    </span>
                  </div>
                )}

                {selectedStudent.patronus && (
                  <div className="modal-info-item">
                    <span className="info-label">✨ Patronus:</span>
                    <span className="info-value">{selectedStudent.patronus}</span>
                  </div>
                )}

                {selectedStudent.actor && (
                  <div className="modal-info-item full-width">
                    <span className="info-label">🎭 Actor:</span>
                    <span className="info-value">{selectedStudent.actor}</span>
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
