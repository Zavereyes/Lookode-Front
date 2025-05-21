// src/services/authService.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  

const API_URL = 'https://lookode-unk7.vercel.app';


axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Configurar interceptor para manejar errores de autenticación
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expirado o inválido
            logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Verificar si hay un token válido
const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        // Verificar si el token no ha expirado
        return decodedToken.exp > currentTime;
    } catch (error) {
        return false;
    }
};

// Obtener datos del usuario actual
const getCurrentUser = () => {
    try {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    } catch (error) {
        return null;
    }
};

// Cerrar sesión
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
};

// Obtener perfil del usuario
const getProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/perfil`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        throw error;
    }
};

const getAvatar = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/usuario/avatar/${userId}`, {
            responseType: 'blob' // Importante para recibir el blob correctamente
        });
        return URL.createObjectURL(response.data);
    } catch (error) {
        console.error('Error al obtener el avatar:', error);
        return null;
    }
};


export const authService = {
    isAuthenticated,
    getCurrentUser,
    logout,
    getProfile,
    getAvatar
};

export default authService;