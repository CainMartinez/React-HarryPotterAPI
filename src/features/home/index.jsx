import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const features = [
    {
      icon: '👤',
      title: 'Personajes',
      description: 'Explora todos los brujos, magos y criaturas del mundo mágico',
      link: '/characters',
      color: '#d4af37'
    },
    {
      icon: '🛡️',
      title: 'Casas de Hogwarts',
      description: 'Descubre Gryffindor, Hufflepuff, Ravenclaw y Slytherin',
      link: '/houses',
      color: '#c9a726'
    },
    {
      icon: '🪄',
      title: 'Hechizos',
      description: 'Aprende los encantamientos más poderosos',
      link: '/spells',
      color: '#e0b64d'
    },
    {
      icon: '🎓',
      title: 'Estudiantes',
      description: 'Conoce a los aprendices de Hogwarts',
      link: '/students',
      color: '#d4af37'
    },
    {
      icon: '👨‍🏫',
      title: 'Personal',
      description: 'Los maestros y personal del castillo',
      link: '/staff',
      color: '#c9a726'
    },
    {
      icon: '🐱',
      title: 'Amigos de Mrs Norris',
      description: 'Descubre los gatos mágicos del mundo felino',
      link: '/cats',
      color: '#e0b64d'
    }
  ];

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">El Mundo Mágico</span>
            <span className="title-line magic-text">de Harry Potter</span>
          </h1>
          <p className="hero-subtitle">
            Bienvenido al universo mágico más fascinante. Explora personajes, hechizos,
            casas de Hogwarts y mucho más.
          </p>
          <div className="hero-icons">
            <span className="hero-icon">⚡</span>
            <span className="hero-icon">🦉</span>
            <span className="hero-icon">🔮</span>
            <span className="hero-icon">📚</span>
            <span className="hero-icon">✨</span>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">
          <span className="section-icon">🔮</span>
          Explora el Universo Mágico
        </h2>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link 
              to={feature.link} 
              key={index}
              className="feature-card"
              style={{ '--feature-color': feature.color }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="quote-section">
        <div className="quote-content">
          <div className="quote-icon">❝</div>
          <p className="quote-text">
            "La felicidad se puede encontrar hasta en los momentos más oscuros, 
            si somos capaces de usar bien la luz."
          </p>
          <p className="quote-author">— Albus Dumbledore</p>
        </div>
      </div>
    </div>
  );
}
