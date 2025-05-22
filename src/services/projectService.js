// src/services/projectService.js
import axios from 'axios';

const API_URL = 'https://lookode-back.vercel.app';

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

// Eliminar un proyecto
const deleteProject = async (projectId) => {
  try {
    const response = await axios.delete(`${API_URL}/proyectos/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    throw error;
  }
};

// Obtener un proyecto por ID
const getProjectById = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/proyectos/${projectId}/detalles`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener proyecto:', error);
    throw error;
  }
};

// Actualizar un proyecto existente
const updateProject = async (projectId, projectData) => {
  try {
    const formData = new FormData();
    formData.append('titulo', projectData.titulo);
    
    // Manejo de tags
    if (projectData.tags && projectData.tags.length > 0) {
      projectData.tags.forEach(tag => {
        formData.append('tags[]', tag);
      });
    }
    
    // Agregar imagen solo si se proporciona una nueva
    if (projectData.imagen) {
      formData.append('imagen', projectData.imagen);
    }
    
    const response = await axios.put(`${API_URL}/proyectos/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    throw error;
  }
};

export const projectService = {
  createProject,
  getAllTags,
  deleteProject,
  getProjectById,
  updateProject
};

export default projectService;