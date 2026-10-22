import React, { useState, useEffect } from 'react';

function App() {
  const [pestanaActiva, setPestanaActiva] = useState('foro'); 

  const [descargando, setDescargando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [descargaCompletada, setDescargaCompletada] = useState(false);
  const [mostrarVisor, setMostrarVisor] = useState(false);
  const [respuestas, setRespuestas] = useState({});
  const [puntaje, setPuntaje] = useState(null);


  const [comentarios, setComentarios] = useState([
    { id: 1, autor: 'Marisol', texto: '¡Me sirvió mucho el módulo offline para repasar en el camión sin gastar mis datos!', fecha: '19 oct. 2026' },
    { id: 2, autor: 'Aldo', texto: '¿Alguien sabe si el cuestionario del Sprint 2 tiene límite de intentos? Me equivoqué en la primera.', fecha: '20 oct. 2026' }
  ]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  const preguntasQuiz = [
    { id: 1, pregunta: "1. ¿Cuál es el objetivo principal del modo de lectura offline (REQ-002)?", opciones: ["Consumir más ancho de banda", "Permitir el estudio en zonas rurales sin conexión a internet", "Bloquear la descarga de archivos PDF"], correcta: 1 },
    { id: 2, pregunta: "2. ¿Por qué se implementó una barra de progreso en las descargas (REQ-006)?", opciones: ["Para dar retroalimentación visual y evitar clics repetidos que saturen la memoria", "Solo por decoración estética", "Para eliminar los archivos del servidor"], correcta: 0 }
  ];

  useEffect(() => {
    let intervalo;
    if (descargando && progreso < 100) {
      intervalo = setInterval(() => {
        setProgreso((prev) => {
          if (prev >= 100) {
            clearInterval(intervalo);
            return 100;
          }
          return prev + 20;
        });
      }, 400);
    } else if (progreso === 100 && descargando) {
      setDescargando(false);
      setDescargaCompletada(true);
      const link = document.createElement('a');
      link.href = '/roger-rabbit.pdf';
      link.download = 'Quien_censuro_a_Roger_Rabbit.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    return () => clearInterval(intervalo);
  }, [descargando, progreso]);

  const iniciarDescarga = () => {
    if (descargando) return;
    setDescargaCompletada(false);
    setProgreso(0);
    setDescargando(true);
  };

  const calificarQuiz = () => {
    let aciertos = 0;
    preguntasQuiz.forEach((p) => {
      if (respuestas[p.id] === p.correcta) aciertos++;
    });
    setPuntaje(aciertos);
  };


  const publicarComentario = () => {
    if (nuevoMensaje.trim() === '') return;
    const nuevo = {
      id: Date.now(),
      autor: 'Alejandro (Tú)',
      texto: nuevoMensaje,
      fecha: 'Hoy'
    };
    setComentarios([...comentarios, nuevo]);
    setNuevoMensaje('');
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', backgroundColor: '#f4f6f9', color: '#222', minHeight: '100vh', margin: 0 }}>
      <header style={{ backgroundColor: '#003b5c', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Plataforma Educativa UDG</h1>
          <small style={{ color: '#cfd8dc' }}>Avance Sprint 3: Interacción Social (Foro) y Cierre</small>
        </div>
        <nav>
          <ul style={{ display: 'flex', gap: '15px', listStyle: 'none', margin: 0, padding: 0 }}>
            <li><button onClick={() => setPestanaActiva('inicio')} style={estiloBotonNav(pestanaActiva === 'inicio')}>Lectura y Descargas</button></li>
            <li><button onClick={() => setPestanaActiva('videos')} style={estiloBotonNav(pestanaActiva === 'videos')}>Videos</button></li>
            <li><button onClick={() => setPestanaActiva('quiz')} style={estiloBotonNav(pestanaActiva === 'quiz')}>Cuestionarios</button></li>
            <li><button onClick={() => setPestanaActiva('foro')} style={estiloBotonNav(pestanaActiva === 'foro')}>Foro Comunitario</button></li>
          </ul>
        </nav>
      </header>

      <main style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px' }}>
        
        {pestanaActiva === 'inicio' && (
          <section style={estiloTarjeta}>
             <h2 style={{ marginTop: 0, color: '#003b5c' }}>Módulo de Lectura y Material Offline</h2>
             <button onClick={iniciarDescarga} disabled={descargando} style={{ backgroundColor: descargando ? '#6c757d' : '#0056b3', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', cursor: descargando ? 'not-allowed' : 'pointer' }}>
                  {descargando ? `Empaquetando... (${progreso}%)` : '⬇ Descargar Material Offline (PDF)'}
             </button>
             <button onClick={() => setMostrarVisor(!mostrarVisor)} style={{ marginLeft: '10px', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>
                  {mostrarVisor ? 'Ocultar Visor' : '📖 Abrir Visor PDF'}
             </button>
             {mostrarVisor && <iframe src="/roger-rabbit.pdf" title="Visor" width="100%" height="500px" style={{ marginTop: '20px', border: '1px solid #ccc' }} />}
          </section>
        )}

        {pestanaActiva === 'videos' && (
          <section style={estiloTarjeta}>
            <h2 style={{ marginTop: 0, color: '#003b5c' }}>Repositorio de Video Educativo</h2>
            <video width="100%" height="400" controls preload="metadata" style={{ backgroundColor: '#000', borderRadius: '8px' }}>
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            </video>
          </section>
        )}

        {pestanaActiva === 'quiz' && (
          <section style={estiloTarjeta}>
            <h2 style={{ marginTop: 0, color: '#003b5c' }}>Evaluación de Aprendizaje (Quiz)</h2>
            {preguntasQuiz.map((q) => (
              <div key={q.id} style={{ marginBottom: '15px' }}>
                <p style={{ fontWeight: 'bold' }}>{q.pregunta}</p>
                {q.opciones.map((opcion, idx) => (
                  <label key={idx} style={{ display: 'block' }}>
                    <input type="radio" name={`pregunta-${q.id}`} onChange={() => setRespuestas({ ...respuestas, [q.id]: idx })} style={{ marginRight: '8px' }} />
                    {opcion}
                  </label>
                ))}
              </div>
            ))}
            <button onClick={calificarQuiz} style={{ backgroundColor: '#0056b3', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Validar Respuestas</button>
            {puntaje !== null && <div style={{ marginTop: '15px', color: '#155724', fontWeight: 'bold' }}>Aciertos: {puntaje} de {preguntasQuiz.length}</div>}
          </section>
        )}

        {pestanaActiva === 'foro' && (
          <section style={estiloTarjeta}>
            <h2 style={{ marginTop: '10px', color: '#003b5c' }}>Foro de Discusión Comunitario</h2>
            <p style={{ color: '#555' }}>Resuelve tus dudas y comparte conocimiento con tus compañeros.</p>
            

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              {comentarios.map((comentario) => (
                <div key={comentario.id} style={{ padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ color: '#0f172a' }}>{comentario.autor}</strong>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{comentario.fecha}</span>
                  </div>
                  <div style={{ color: '#334155', lineHeight: '1.5' }}>{comentario.texto}</div>
                </div>
              ))}
            </div>


            <div style={{ marginTop: '25px', borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '16px', color: '#003b5c', marginTop: 0 }}>Agregar una nueva aportación</h3>
              <textarea
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                placeholder="Escribe tu duda o comentario aquí..."
                style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical', boxSizing: 'border-box' }}
              />
              <button
                onClick={publicarComentario}
                disabled={nuevoMensaje.trim() === ''}
                style={{
                  marginTop: '10px',
                  backgroundColor: nuevoMensaje.trim() === '' ? '#94a3b8' : '#0284c7',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: nuevoMensaje.trim() === '' ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Publicar en el foro
              </button>
            </div>

          </section>
        )}

      </main>
    </div>
  );
}

const estiloTarjeta = { backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e1e4e8' };
const estiloBadge = { backgroundColor: '#e1f5fe', color: '#0277bd', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
const estiloBotonNav = (activo) => ({ backgroundColor: activo ? '#ffffff' : 'transparent', color: activo ? '#003b5c' : '#ffffff', border: '1px solid #ffffff', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' });

export default App;