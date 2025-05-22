import React, { useState, useEffect } from 'react';
import './viewproyecto.css';
import { useParams } from 'react-router-dom';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
import axios from 'axios';

const Viewproyecto = () => {
  const { idProyecto } = useParams(); // Obtener idProyecto de la URL
  const [proyecto, setProyecto] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [contenidos, setContenidos] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [textContents, setTextContents] = useState({});
  const [enFavoritos, setEnFavoritos] = useState(false); // Estado para controlar si está en favoritos
  const [actualizandoFavorito, setActualizandoFavorito] = useState(false); // Para prevenir múltiples clics
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  // Función para verificar si el proyecto está en favoritos
  const verificarFavorito = async (token) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.get(
        `https://lookode-back.onrender.com/favoritos/check/${idProyecto}`,
        config
      );
      
      setEnFavoritos(response.data.enFavoritos);
    } catch (err) {
      console.error('Error al verificar favoritos:', err);
      // No mostramos error al usuario para no interferir con la experiencia principal
    }
  };

  // Función para gestionar añadir o quitar de favoritos
  const toggleFavorito = async () => {
    if (actualizandoFavorito) return; // Evitar múltiples clics
    
    setActualizandoFavorito(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No se ha iniciado sesión');
        setActualizandoFavorito(false);
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      if (enFavoritos) {
        // Eliminar de favoritos
        await axios.delete(
          `https://lookode-back.onrender.com/remove/${idProyecto}`,
          config
        );
        setEnFavoritos(false);
      } else {
        // Añadir a favoritos
        await axios.post(
          'https://lookode-back.onrender.com/favoritos/add',
          { idProyecto },
          config
        );
        setEnFavoritos(true);
      }
    } catch (err) {
      console.error('Error al actualizar favoritos:', err);
      alert(err.response?.data?.message || 'Error al actualizar favoritos');
    } finally {
      setActualizandoFavorito(false);
    }
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        // Obtener el token del almacenamiento local
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No se ha iniciado sesión');
          setLoading(false);
          return;
        }

        // Configurar los headers con el token
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        // Realizar la petición para obtener los detalles del proyecto
        const response = await axios.get(
          `https://lookode-back.onrender.com/proyectos/${idProyecto}/detalles`, 
          config
        );

        // Actualizar el estado con los datos recibidos
        setProyecto(response.data.proyecto);
        setUsuario(response.data.usuario);
        setContenidos(response.data.contenidos);
        setTags(response.data.tags);

        // Cargar el contenido de los archivos TXT
        const txtFiles = response.data.contenidos.filter(item => item.tipo === 'txt');
        const txtContents = {};
        
        for (const txt of txtFiles) {
          try {
            const txtResponse = await axios.get(
              `https://lookode-back.onrender.com/${txt.idContenido}`, 
              {
                ...config,
                responseType: 'text'
              }
            );
            txtContents[txt.idContenido] = txtResponse.data;
          } catch (err) {
            console.error(`Error loading text file ${txt.idContenido}:`, err);
            txtContents[txt.idContenido] = "Error al cargar el archivo de texto";
          }
        }
        
        setTextContents(txtContents);
        
        // Verificar si está en favoritos
        await verificarFavorito(token);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError(err.response?.data?.message || 'Error al cargar los detalles del proyecto');
        setLoading(false);
      }
    };

    if (idProyecto) {
      fetchProjectDetails();
    }
  }, [idProyecto]);

  // Renderizar un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <main className="main-content">
          <div className="loading">Cargando detalles del proyecto...</div>
        </main>
        <Footer />
      </div>
    );
  }

  // Renderizar un mensaje de error si ocurrió algún problema
  if (error) {
    return (
      <div className="page-container">
        <Header />
        <main className="main-content">
          <div className="error">{error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  // Separar los contenidos por tipo
  const imagenes = contenidos.filter(item => item.tipo === 'imagen');
  const videos = contenidos.filter(item => item.tipo === 'video');
  const documentos = contenidos.filter(item => item.tipo === 'documento');
  const textos = contenidos.filter(item => item.tipo === 'txt');
  
  // Obtener el primer contenido a mostrar (prioridad: imagen, luego video, luego texto, luego documento)
  const primerContenido = imagenes[0] || videos[0] || textos[0] || documentos[0];
  
  // Imágenes adicionales (sin la primera)
  const imagenesAdicionales = imagenes.slice(1);

  return (
    <div className="page-container">
      <Header />
      <main className="main-content">
        <section className="project-view">
          <div className="main-image">
            {/* Contenido principal destacado */}
            {primerContenido && (
              <div className="featured-content">
                {primerContenido.tipo === 'imagen' ? (
                  <img 
                    src={`https://lookode-back.onrender.com/${primerContenido.idContenido}`} 
                    alt={proyecto?.titulo || 'Imagen principal'} 
                  />
                ) : primerContenido.tipo === 'video' ? (
                  <video controls>
                    <source 
                      src={`https://lookode-back.onrender.com/${primerContenido.idContenido}`} 
                      type="video/mp4" 
                    />
                    Tu navegador no soporta el tag de video.
                  </video>
                ) : primerContenido.tipo === 'txt' ? (
                  <div className="text-content">
                    <h4>Archivo de texto</h4>
                    <pre>{textContents[primerContenido.idContenido] || "Cargando contenido..."}</pre>
                  </div>
                ) : (
                  <div className="document-preview">
                    <a 
                      href={`https://lookode-back.onrender.com/${primerContenido.idContenido}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver documento
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Grid de imágenes adicionales */}
            {imagenesAdicionales.length > 0 && (
              <div className="image-grid">
                {imagenesAdicionales.map((imagen) => (
                  <img 
                  key={imagen.idContenido}
                  src={`https://lookode-back.onrender.com/${imagen.idContenido}`} 
                  alt="Imagen del proyecto" 
                  onClick={() => setImagenSeleccionada(imagen.idContenido)}
                />
                
                ))}
              </div>
            )}
            {imagenSeleccionada && (
              <div className="modal" onClick={() => setImagenSeleccionada(null)}>
                <span className="close">&times;</span>
                <img 
                  className="modal-content"
                  src={`https://lookode-back.onrender.com/${imagenSeleccionada}`} 
                  alt="Imagen en tamaño completo"
                />
              </div>
            )}

            {/* Mostrar videos adicionales si existen */}
            {videos.length > 0 && videos.map((video, index) => (
              index > 0 || (index === 0 && primerContenido.tipo !== 'video') ? (
                <div key={video.idContenido} className="featured-content">
                  <video controls>
                    <source 
                      src={`https://lookode-back.onrender.com/contenidos/${video.idContenido}`} 
                      type="video/mp4" 
                    />
                    Tu navegador no soporta el tag de video.
                  </video>
                </div>
              ) : null
            ))}

            {/* Mostrar archivos de texto adicionales si existen */}
            {textos.length > 0 && textos.map((texto, index) => (
              index > 0 || (index === 0 && primerContenido.tipo !== 'txt') ? (
                <div key={texto.idContenido} className="text-content">
                  <h4>Codigo {index + 1}</h4>
                  <pre>{textContents[texto.idContenido] || "Cargando contenido..."}</pre>
                </div>
              ) : null
            ))}

            {/* Mostrar documentos adicionales si existen */}
            {documentos.length > 0 && documentos.map((documento, index) => (
              index > 0 || (index === 0 && primerContenido.tipo !== 'documento') ? (
                <div key={documento.idContenido} className="document-preview">
                  <a 
                    href={`https://lookode-back.onrender.com/${documento.idContenido}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver documento {index + 1}
                  </a>
                </div>
              ) : null
            ))}
          </div>

          <aside className="project-details">
            <div className="avatar-large">
              {usuario && (
                <img 
                  src={`https://lookode-back.onrender.com/usuario/avatar/${usuario.idUsuario}`} 
                  alt="Avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.jpg';
                  }}
                />
              )}
            </div>
            <h2>{usuario ? usuario.nickname : 'Usuario'}</h2>
            <h3>{proyecto ? `[${proyecto.titulo}]` : '[Proyecto]'}</h3>
            
            {/* Botón para guardar/eliminar de favoritos */}
            <button 
              className={`btn ${enFavoritos ? 'delete-btn' : 'save-btn'}`}
              onClick={toggleFavorito}
              disabled={actualizandoFavorito}
            >
              {actualizandoFavorito ? 'PROCESANDO...' : (enFavoritos ? 'ELIMINAR' : 'GUARDAR')}
            </button>
            
            <div className="social-links">
            </div>
            
            <div className="tags">
              {tags.map(tag => (
                <span key={tag.idTag}>{tag.NombreTag}</span>
              ))}
            </div>
            
            <div className="circles">
              <div className="circle">
              {usuario?.twitter && (
                <a href={`https://twitter.com/${usuario.twitter}`} target="_blank" rel="noopener noreferrer">
                  <img alt="Avatar" width="15" height="15" src="/img_simbolos/x.png" />
                </a>
              )}
              </div>
              <div className="circle">
              {usuario?.ig && (
                <a href={`https://instagram.com/${usuario.ig}`} target="_blank" rel="noopener noreferrer">
                  <img alt="Avatar" width="15" height="15" src="/img_simbolos/instagram.png" />
                </a>
              )}
              </div>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
    
  );

  
};

export default Viewproyecto;