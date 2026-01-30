import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CacheProvider } from './core/context';
import { Navbar } from './shared/components';
import Home from './features/home';
import Characters from './features/characters';
import Houses from './features/houses';
import Spells from './features/spells';
import Students from './features/students';
import Staff from './features/staff';
import Cats from './features/cats';
import './App.css';

function App() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Intentar reproducir el audio cuando se carga la página
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('Autoplay bloqueado por el navegador. El usuario debe interactuar primero.');
        }
      }
    };
    playAudio();
  }, []);

  const toggleMusic = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('Error al reproducir música:', error);
        }
      }
    }
  };

  return (
    <CacheProvider>
      <Router>
        <div className="App">
          <audio ref={audioRef} loop>
            <source src="/music.mp3" type="audio/mpeg" />
          </audio>
          
          <button 
            className="music-toggle" 
            onClick={toggleMusic}
            aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
          >
            {isPlaying ? '🎵' : '🔇'}
          </button>

          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/characters" element={<Characters />} />
              <Route path="/houses" element={<Houses />} />
              <Route path="/spells" element={<Spells />} />
              <Route path="/students" element={<Students />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/cats" element={<Cats />} />
            </Routes>
          </main>
          <footer className="footer">
            <div className="footer-content">
              <p className="footer-text">
                ⚡ El Mundo Mágico de Harry Potter ⚡
              </p>
              <p className="footer-credits">
                Creado con React JS | APIs: <a href="https://hp-api.onrender.com" target="_blank" rel="noopener noreferrer">HP-API</a> y <a href="https://thecatapi.com" target="_blank" rel="noopener noreferrer">The Cat API</a>
              </p>
              <p className="footer-disclaimer">
                Este proyecto no está afiliado con J.K. Rowling o Warner Bros.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </CacheProvider>
  );
}

export default App;
