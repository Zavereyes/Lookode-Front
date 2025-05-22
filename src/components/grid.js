// grid.js - modificación
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './grid.css';
import { ImMagicWand } from "react-icons/im";
function Grid({ showEditButton = false, viewMode = 'all', searchQuery = '' }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        let url;
        let config = {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        };

        // Determinar la URL basada en el modo de visualización
        if (viewMode === 'search' && searchQuery) {
          // URL para búsqueda
          url = `https://lookode-back.onrender.com/proyectos/buscar?q=${encodeURIComponent(searchQuery)}`;
        } else if (viewMode === 'favorites') {
          url = 'https://lookode-back.onrender.com/favoritos/proyectos';
        } else if (viewMode === 'created') {
          url = 'https://lookode-back.onrender.com/proyectos/usuario';
        } else {
          url = 'https://lookode-back.onrender.com/proyectos'; // Mostrar todos los proyectos (default)
        }
          
        // Fetch the projects based on viewMode
        const projectsResponse = await axios.get(url, config);

        if (projectsResponse.data.length === 0) {
          setProjects([]);
          setIsLoading(false);
          return;
        }

        const projectsWithImages = await Promise.all(
          projectsResponse.data.map(async (project) => {
            try {
              const imageResponse = await axios.get(`https://lookode-back.onrender.com/proyectos/${project.idProyecto}/primera-imagen`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                responseType: 'blob'
              });
              
              // Convert blob to base64
              const reader = new FileReader();
              return new Promise((resolve) => {
                reader.onloadend = () => {
                  resolve({
                    ...project,
                    imageSrc: reader.result
                  });
                };
                reader.readAsDataURL(imageResponse.data);
              });
            } catch (error) {
              console.error('Error fetching project image:', error);
              return {
                ...project,
                imageSrc: null // Default image or placeholder
              };
            }
          })
        );

        setProjects(projectsWithImages);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [viewMode, searchQuery]); // Dependencies updated to include searchQuery

  return (
    <div className="grid-container">
      {isLoading ? (
        <div className="loading-message">Cargando proyectos...</div>
      ) : projects.length > 0 ? (
        projects.map((project) => (
          <Link 
            key={project.idProyecto} 
            to={`/viewproyecto/${project.idProyecto}`}
          >
            <div className="grid-item">
              {project.imageSrc ? (
                <img 
                  src={project.imageSrc} 
                  alt={`Proyecto ${project.Titulo}`} 
                />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
              
              
              {/* Solo mostrar botón de editar si showEditButton=true y estamos en modo created */}
              {showEditButton && viewMode === 'created' && (
                <Link to={`/editarpryct/${project.idProyecto}`} onClick={(e) => e.stopPropagation()}>
                  <button className="edit-button">
                  <ImMagicWand className='icon-editar'/>
                  </button>
                </Link>
              )}
            </div>
          </Link>
        ))
      ) : (
        <div className="no-projects-message">
          {viewMode === 'search' ? `No se encontraron resultados para "${searchQuery}"` :
           viewMode === 'favorites' ? 'No tienes proyectos en favoritos' : 
           viewMode === 'created' ? 'No has creado proyectos aún' : 
           'No hay proyectos disponibles'}
        </div>
      )}
    </div>
  );
}

export default Grid;