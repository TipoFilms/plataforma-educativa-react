import React, { useState, useEffect } from 'react';

function App() {
  // Navegación entre módulos
  const [pestanaActiva, setPestanaActiva] = useState('inicio');

  // Estados para REQ-002 y REQ-006 (Descarga y Barra de progreso)
  const [descargando, setDescargando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [descargaCompletada, setDescargaCompletada] = useState(false);
  const [mostrarVisor, setMostrarVisor] = useState(false);

  // Estados para REQ-003 (Quizzes / Cuestionario)
  const [respuestas, setRespuestas] = useState({});
  const [puntaje, setPuntaje] = useState(null);

  const preguntasQuiz = [
    {
      id: 1,
      pregunta: "1. ¿Cuál es el objetivo principal del modo de lectura offline (REQ-002)?",
      opciones: [
        "Consumir más ancho de banda",
        "Permitir el estudio en zonas rurales sin conexión a internet",
        "Bloquear la descarga de archivos PDF"
      ],
      correcta: 1
    },
    {
      id: 2,
      pregunta: "2. ¿Por qué se implementó una barra de progreso en las descargas (REQ-006)?",
      opciones: [
        "Para dar retroalimentación visual y evitar clics repetidos que saturen la memoria",
        "Solo por decoración estética",
        "Para eliminar los archivos del servidor"
      ],
      correcta: 0
    }
  ];

  // Lógica de la barra de progreso animada (REQ-006)
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
      // Dispara la descarga real del PDF en la carpeta public
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
    if (descargando) return; // Evita clics múltiples
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

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', backgroundColor: '#f4f6f9', color: '#222', minHeight: '100vh', margin: 0 }}>
      {/* Encabezado Formal */}
      <header style={{ backgroundColor: '#003b5c', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Plataforma Educativa UDG</h1>
          <small style={{ color: '#cfd8dc' }}>Avance Sprint 2: Accesibilidad, UX Feedback y Multimedia</small>
        </div>
        <nav>
          <ul style={{ display: 'flex', gap: '15px', listStyle: 'none', margin: 0, padding: 0 }}>
            <li>
              <button onClick={() => setPestanaActiva('inicio')} style={estiloBotonNav(pestanaActiva === 'inicio')}>
                Lectura y Descargas
              </button>
            </li>
            <li>
              <button onClick={() => setPestanaActiva('videos')} style={estiloBotonNav(pestanaActiva === 'videos')}>
                Videos (REQ-004)
              </button>
            </li>
            <li>
              <button onClick={() => setPestanaActiva('quiz')} style={estiloBotonNav(pestanaActiva === 'quiz')}>
                Cuestionarios (REQ-003)
              </button>
            </li>
            <li>
              <button onClick={() => setPestanaActiva('foro')} style={estiloBotonNav(pestanaActiva === 'foro')}>
                Foro
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Contenido Principal */}
      <main style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px' }}>
        
        {/* MÓDULO 1: LECTURA Y DESCARGA CON BARRA DE PROGRESO (REQ-001, REQ-002, REQ-006) */}
        {pestanaActiva === 'inicio' && (
          <div style={{ display: 'grid', gap: '20px' }}>
            <section style={estiloTarjeta}>
              <span style={estiloBadge}>REQ-001 / REQ-002 / REQ-006</span>
              <h2 style={{ marginTop: '10px', color: '#003b5c' }}>Módulo de Lectura y Material Offline</h2>
              <p>
                <strong>Lectura asignada:</strong> <em>¿Quién censuró a Roger Rabbit?</em> (Archivo de prueba para lectura ligera y paquete de estudio sin internet).
              </p>

              <div style={{ display: 'flex', gap: '12px', marginTop: '15px', flexWrap: 'wrap' }}>
                <button
                  onClick={iniciarDescarga}
                  disabled={descargando}
                  style={{
                    backgroundColor: descargando ? '#6c757d' : descargaCompletada ? '#28a745' : '#0056b3',
                    color: 'white',
                    padding: '10px 18px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: descargando ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {descargando
                    ? `Empaquetando y descargando... (${progreso}%)`
                    : descargaCompletada
                    ? '✓ Descarga Completada (Volver a descargar)'
                    : '⬇ Descargar Material Offline (PDF)'}
                </button>

                <button
                  onClick={() => setMostrarVisor(!mostrarVisor)}
                  style={{
                    backgroundColor: '#e2e8f0',
                    color: '#1e293b',
                    padding: '10px 18px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {mostrarVisor ? 'Ocultar Visor Ligero' : '📖 Abrir Visor PDF en Línea (REQ-001)'}
                </button>
              </div>

              {/* Barra de Progreso Animada (REQ-006) */}
              {(descargando || descargaCompletada) && (
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                    <span>Estado de la transferencia (Botón bloqueado durante descarga para evitar saturación):</span>
                    <strong>{progreso}%</strong>
                  </div>
                  <div style={{ width: '100%', backgroundColor: '#e9ecef', borderRadius: '8px', overflow: 'hidden', height: '18px' }}>
                    <div
                      style={{
                        width: `${progreso}%`,
                        backgroundColor: progreso === 100 ? '#28a745' : '#007bff',
                        height: '100%',
                        transition: 'width 0.3s ease-in-out'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Visor PDF con Carga Diferida (REQ-001) */}
              {mostrarVisor && (
                <div style={{ marginTop: '20px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#eee', padding: '8px 15px', fontSize: '13px', fontWeight: 'bold' }}>
                    Visor Ligero de Documentos - Carga Diferida Activa
                  </div>
                  <iframe
                    src="/roger-rabbit.pdf"
                    title="Visor PDF"
                    width="100%"
                    height="500px"
                    style={{ border: 'none' }}
                  />
                </div>
              )}
            </section>
          </div>
        )}

        {/* MÓDULO 2: REPRODUCTOR DE VIDEO (REQ-004) */}
        {pestanaActiva === 'videos' && (
          <section style={estiloTarjeta}>
            <span style={estiloBadge}>REQ-004</span>
            <h2 style={{ marginTop: '10px', color: '#003b5c' }}>Repositorio de Video Educativo</h2>
            <p>Reproductor optimizado con carga fragmentada para conexiones de bajo ancho de banda.</p>
            <div style={{ backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', marginTop: '15px' }}>
              <video width="100%" height="400" controls preload="metadata">
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
            </div>
          </section>
        )}

        {/* MÓDULO 3: CUESTIONARIOS / QUIZZES (REQ-003) */}
        {pestanaActiva === 'quiz' && (
          <section style={estiloTarjeta}>
            <span style={estiloBadge}>REQ-003</span>
            <h2 style={{ marginTop: '10px', color: '#003b5c' }}>Evaluación de Aprendizaje (Quiz)</h2>
            <p>Responde las siguientes preguntas para evaluar los conceptos del módulo:</p>

            {preguntasQuiz.map((q) => (
              <div key={q.id} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontWeight: 'bold', marginTop: 0 }}>{q.pregunta}</p>
                {q.opciones.map((opcion, idx) => (
                  <label key={idx} style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name={`pregunta-${q.id}`}
                      checked={respuestas[q.id] === idx}
                      onChange={() => setRespuestas({ ...respuestas, [q.id]: idx })}
                      style={{ marginRight: '8px' }}
                    />
                    {opcion}
                  </label>
                ))}
              </div>
            ))}

            <button
              onClick={calificarQuiz}
              style={{ backgroundColor: '#0056b3', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Validar Respuestas
            </button>

            {puntaje !== null && (
              <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '6px', fontWeight: 'bold' }}>
                Resultado de la evaluación: Obtuviste {puntaje} de {preguntasQuiz.length} aciertos.
              </div>
            )}
          </section>
        )}

        {/* MÓDULO 4: FORO (SPRINT 3 - REQ-005) */}
        {pestanaActiva === 'foro' && (
          <section style={estiloTarjeta}>
            <span style={estiloBadge}>REQ-005 (Programado para Sprint 3)</span>
            <h2 style={{ marginTop: '10px', color: '#003b5c' }}>Foro de Discusión Comunitario</h2>
            <p>El esquema de base de datos de usuarios e hilos de comentarios se encuentra listo para integrarse en el Sprint 3.</p>
          </section>
        )}

      </main>
    </div>
  );
}

const estiloTarjeta = {
  backgroundColor: 'white',
  padding: '25px',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  border: '1px solid #e1e4e8'
};

const estiloBadge = {
  backgroundColor: '#e1f5fe',
  color: '#0277bd',
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 'bold'
};

const estiloBotonNav = (activo) => ({
  backgroundColor: activo ? '#ffffff' : 'transparent',
  color: activo ? '#003b5c' : '#ffffff',
  border: '1px solid #ffffff',
  padding: '8px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
});

export default App;