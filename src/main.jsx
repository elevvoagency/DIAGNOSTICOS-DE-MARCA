import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Si algo falla al renderizar, en vez de pantalla en blanco ofrece reiniciar.
class Boundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  reset = () => {
    try {
      localStorage.removeItem('elevvo_diag_v2');
    } catch {
      /* ignore */
    }
    window.location.href = window.location.pathname;
  };
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24 }}>
        <div>
          <p style={{ letterSpacing: '.3em', fontWeight: 600 }}>ELEVVO</p>
          <p style={{ margin: '16px 0 24px', opacity: 0.7 }}>Algo salió mal al cargar el formulario.</p>
          <button className="btn-primary" onClick={this.reset}>
            Reiniciar
          </button>
        </div>
      </div>
    );
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Boundary>
      <App />
    </Boundary>
  </React.StrictMode>
);
