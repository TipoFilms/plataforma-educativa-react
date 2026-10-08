import React, { useState } from 'react';

function App() {
  const [descargaActiva, setDescargaActiva] = useState(false);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <header style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ color: '#0056b3' }}>Plataforma Educativa UDG</h1>
        <nav>
          <ul style={{ display: 'flex', gap: '15px', listStyle: 'none', padding: 0, fontWeight: 'bold' }}>
            <li style={{ cursor: 'pointer' }}>Inicio</li>
            <li style={{ cursor: 'pointer' }}>Mis Módulos</li>
            <li style={{ cursor: 'pointer' }}>Foro</li>
          </ul>
        </nav>
      </header>

      <main>
        <section style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', maxWidth: '500px' }}>
          <h2>Módulo de Lectura Offline</h2>
          <p>Descarga tus paquetes de estudio (REQ-002).</p>
          <button 
            onClick={() => setDescargaActiva(true)}
            style={{ 
              backgroundColor: descargaActiva ? '#28a745' : '#007bff', 
              color: 'white', 
              padding: '10px 15px', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {descargaActiva ? "Descargando archivo ZIP..." : "Descargar Material"}
          </button>
        </section>
      </main>
    </div>
  );
}

export default App;