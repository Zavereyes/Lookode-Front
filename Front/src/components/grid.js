import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './grid.css';

function Grid({ showEditButton = false }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // First, fetch the projects
        const projectsResponse = await axios.get('http://localhost:3001/proyectos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const projectsWithImages = await Promise.all(
          projectsResponse.data.map(async (project) => {
            try {
              const imageResponse = await axios.get(`http://localhost:3001/proyectos/${project.idProyecto}/primera-imagen`, {
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
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="grid-container">
      {projects.map((project) => (
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
            
            {showEditButton && (
              <Link to={`/editarpryct/${project.idProyecto}`}>
                <button className="edit-button"> <img 
            src="img_simbolos/crear_simbolo.png" 
            alt="Avatar" 
            width="5" 
            height="5" 
          />
          </button>
              </Link>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Grid;