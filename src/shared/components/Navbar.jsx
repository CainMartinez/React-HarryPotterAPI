import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              <span className="nav-icon">🏰</span>
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/characters" className={`nav-link ${isActive('/characters')}`}>
              <span className="nav-icon">👤</span>
              Personajes
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/houses" className={`nav-link ${isActive('/houses')}`}>
              <span className="nav-icon">🛡️</span>
              Casas
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/spells" className={`nav-link ${isActive('/spells')}`}>
              <span className="nav-icon">🪄</span>
              Hechizos
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/students" className={`nav-link ${isActive('/students')}`}>
              <span className="nav-icon">🎓</span>
              Estudiantes
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/staff" className={`nav-link ${isActive('/staff')}`}>
              <span className="nav-icon">👨‍🏫</span>
              Personal
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/cats" className={`nav-link ${isActive('/cats')}`}>
              <span className="nav-icon">🐱</span>
              Amigos de Mrs Norris
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
