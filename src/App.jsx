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
    <div style={{ fontFamily: '"Inter", "Segoe UI", sans-serif', backgroundColor: '#f0f4f8', color: '#1e293b', minHeight: '100vh', margin: 0, display: 'flex', flexDirection: 'column' }}>
      
      {/* Header mejorado con gradiente y sombras */}
      <header style={{ background: 'linear-gradient(135deg, #003b5c 0%, #006699 100%)', color: 'white', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }}>Plataforma Educativa UDG</h1>
          <p style={{ color: '#e0f2fe', margin: '5px 0 0 0', fontSize: '14px', fontWeight: '500' }}>Avance Sprint 3: Interacción Social (Foro) y Cierre</p>
        </div>
        <nav>
          <ul style={{ display: 'flex', gap: '10px', listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' }}>
            {['inicio', 'videos', 'quiz', 'foro'].map((tab) => (
              <li key={tab}>
                <button 
                  aria-label={`Ir a la sección de ${tab}`}
                  onClick={() => setPestanaActiva(tab)} 
                  style={estiloBotonNav(pestanaActiva === tab)}
                >
                  {tab === 'inicio' ? 'Lectura y Descargas' : tab === 'videos' ? 'Videos' : tab === 'quiz' ? 'Cuestionarios' : 'Foro Comunitario'}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Contenido principal flex: 1 empuja el footer hasta abajo */}
      <main style={{ maxWidth: '960px', width: '100%', margin: '40px auto', padding: '0 20px', flex: '1' }}>
        
        {pestanaActiva === 'inicio' && (
          <section style={estiloTarjeta}>
            <div style={estiloCabeceraSeccion}>
              <h2 style={{ margin: 0, color: '#003b5c', fontSize: '22px' }}>📚 Módulo de Lectura y Material Offline</h2>
              <p style={{ color: '#64748b', marginTop: '5px', fontSize: '14px' }}>Descarga tus recursos para estudiar sin conexión.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '25px' }}>
              <button aria-label="Descargar material PDF" onClick={iniciarDescarga} disabled={descargando} style={{ ...estiloBotonPrimario, backgroundColor: descargando ? '#94a3b8' : '#0284c7', cursor: descargando ? 'wait' : 'pointer' }}>
                {descargando ? `📦 Empaquetando... (${progreso}%)` : '⬇ Descargar Material Offline (PDF)'}
              </button>
              <button aria-label="Abrir visor de documentos" onClick={() => setMostrarVisor(!mostrarVisor)} style={estiloBotonSecundario}>
                {mostrarVisor ? 'Ocultar Visor' : '📖 Abrir Visor PDF'}
              </button>
            </div>
            {mostrarVisor && <iframe src="/roger-rabbit.pdf" title="Visor de Documentos PDF" width="100%" height="600px" style={{ marginTop: '25px', border: 'none', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />}
          </section>
        )}

        {pestanaActiva === 'videos' && (
          <section style={estiloTarjeta}>
            <div style={estiloCabeceraSeccion}>
              <h2 style={{ margin: 0, color: '#003b5c', fontSize: '22px' }}>🎥 Repositorio de Video Educativo</h2>
            </div>
            <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', marginTop: '20px' }}>
              <video width="100%" height="auto" controls preload="metadata" style={{ display: 'block', backgroundColor: '#000' }}>
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              </video>
            </div>
          </section>
        )}

        {pestanaActiva === 'quiz' && (
          <section style={estiloTarjeta}>
            <div style={estiloCabeceraSeccion}>
              <h2 style={{ margin: 0, color: '#003b5c', fontSize: '22px' }}>📝 Evaluación de Aprendizaje (Quiz)</h2>
              <p style={{ color: '#64748b', marginTop: '5px', fontSize: '14px' }}>Selecciona la respuesta correcta para cada pregunta.</p>
            </div>
            
            <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {preguntasQuiz.map((q) => (
                <div key={q.id} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px' }}>
                  <p style={{ fontWeight: '600', fontSize: '16px', color: '#0f172a', margin: '0 0 15px 0' }}>{q.pregunta}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {q.opciones.map((opcion, idx) => (
                      <label key={idx} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '10px 15px', backgroundColor: respuestas[q.id] === idx ? '#e0f2fe' : 'white', border: `1px solid ${respuestas[q.id] === idx ? '#38bdf8' : '#cbd5e1'}`, borderRadius: '8px', transition: 'all 0.2s' }}>
                        <input type="radio" name={`pregunta-${q.id}`} onChange={() => setRespuestas({ ...respuestas, [q.id]: idx })} style={{ marginRight: '12px', transform: 'scale(1.2)' }} />
                        <span style={{ color: '#334155' }}>{opcion}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button aria-label="Validar respuestas del cuestionario" onClick={calificarQuiz} style={estiloBotonPrimario}>✅ Validar Respuestas</button>
              {puntaje !== null && (
                <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', border: '1px solid #bbf7d0' }}>
                  Resultado: {puntaje} de {preguntasQuiz.length} aciertos
                </div>
              )}
            </div>
          </section>
        )}

        {pestanaActiva === 'foro' && (
          <section style={estiloTarjeta}>
            <div style={estiloCabeceraSeccion}>
              <h2 style={{ margin: 0, color: '#003b5c', fontSize: '22px' }}>💬 Foro de Discusión Comunitario</h2>
              <p style={{ color: '#64748b', marginTop: '5px', fontSize: '14px' }}>Resuelve tus dudas y comparte conocimiento con tus compañeros.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '25px' }}>
              {comentarios.map((comentario) => (
                <div key={comentario.id} style={{ display: 'flex', gap: '15px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  
                  <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 }}>
                    {comentario.autor.charAt(0)}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ color: '#0f172a', fontSize: '15px' }}>{comentario.autor}</strong>
                      <span style={{ fontSize: '12px', color: '#94a3b8', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '10px' }}>{comentario.fecha}</span>
                    </div>
                    <div style={{ color: '#475569', lineHeight: '1.6', fontSize: '14px' }}>{comentario.texto}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '30px', backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '16px', color: '#0f172a', marginTop: 0, marginBottom: '15px' }}>Agregar una nueva aportación</h3>
              <textarea
                aria-label="Caja de texto para nuevo comentario"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                placeholder="Escribe tu duda o comentario aquí..."
                style={{ width: '100%', height: '90px', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '14px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  aria-label="Publicar comentario en el foro"
                  onClick={publicarComentario}
                  disabled={nuevoMensaje.trim() === ''}
                  style={{
                    ...estiloBotonPrimario,
                    backgroundColor: nuevoMensaje.trim() === '' ? '#94a3b8' : '#0284c7',
                    cursor: nuevoMensaje.trim() === '' ? 'not-allowed' : 'pointer',
                  }}
                >
                  🚀 Publicar en el foro
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer style={{ background: '#0f172a', color: '#cbd5e1', padding: '50px 20px 20px', borderTop: '4px solid #0284c7', marginTop: 'auto' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
          
          <div>
            <h3 style={{ color: 'white', marginTop: 0, marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>Plataforma Educativa</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#94a3b8', margin: 0 }}>
              Entorno virtual de aprendizaje de UDGVirtual. Diseñado para ofrecer recursos, interactividad y soporte técnico a los estudiantes en cualquier lugar.
            </p>
          </div>

          <div>
            <h3 style={{ color: 'white', marginTop: 0, marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>Enlaces Legales y Soporte</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <li><span style={{ color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}>Centro de Ayuda Estudiantil</span></li>
              <li><span style={{ color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}>Aviso de Privacidad (GDPR)</span></li>
              <li><span style={{ color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}>Ejercicio de Derechos ARCO</span></li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: 'white', marginTop: 0, marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>Contacto Administrativo</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#94a3b8' }}>
              <li>📍 Sede de Enlace: Lagos de Moreno, Jalisco</li>
              <li>📧 soporte@udgvirtual.edu.mx</li>
              <li>📞 Atención a Estudiantes: 800-UDG-VIRT</li>
            </ul>
          </div>
        </div>

        <div style={{ maxWidth: '960px', margin: '40px auto 0', paddingTop: '20px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', fontSize: '13px', color: '#64748b' }}>
          <span>© 2026 Plataforma Educativa. Todos los derechos reservados.</span>
          <span style={{ fontWeight: 'bold', color: '#e2e8f0' }}>Desarrollo Front-End: Alejandro García Ortega</span>
        </div>
      </footer>

    </div>
  );
}

// Objetos de estilo
const estiloTarjeta = { backgroundColor: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' };
const estiloCabeceraSeccion = { borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' };
const estiloBotonPrimario = { backgroundColor: '#0284c7', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(2, 132, 199, 0.2)' };
const estiloBotonSecundario = { backgroundColor: '#f1f5f9', color: '#334155', padding: '12px 24px', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' };
const estiloBotonNav = (activo) => ({ backgroundColor: activo ? 'rgba(255, 255, 255, 0.15)' : 'transparent', color: '#ffffff', border: activo ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' });

export default App;