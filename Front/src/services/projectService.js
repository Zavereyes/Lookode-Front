// src/services/projectService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Crear un nuevo proyecto
const createProject = async (projectData) => {
  try {
    const formData = new FormData();
    formData.append('titulo', projectData.titulo);
    
    // Mejorar el manejo de tags
    if (projectData.tags && projectData.tags.length > 0) {
      // Para FormData, necesitamos agregar cada tag con el mismo nombre
      projectData.tags.forEach(tag => {
        formData.append('tags[]', tag);
      });
    }
    
    // Agregar imagen si existe
    if (projectData.imagen) {
      formData.append('imagen', projectData.imagen);
    }
    
    const response = await axios.post(`${API_URL}/proyectos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    throw error;
  }
};

// Obtener todos los tags
const getAllTags = async () => {
  try {
    const response = await axios.get(`${API_URL}/tags`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener tags:', error);
    throw error;
  }
};

export const projectService = {
  createProject,
  getAllTags
};

export default projectService;