import React, { useState, useEffect } from 'react';
import Header from '../components/header.js';
import './addcontentpryct.css'; 
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoIosImage } from "react-icons/io";
import { RiTextSnippet } from "react-icons/ri";
import { PiVideoFill } from "react-icons/pi";
function AddContentPryct() {
    const { idProyecto } = useParams();
    const [content, setContent] = useState([]); 
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Obtener el token de autenticación
    
    // Verificar si el usuario está autenticado
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);
    
    const handleFileUpload = (type) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        if (type === 'image') {
            fileInput.accept = 'image/*';
        } else if (type === 'txt') {
            fileInput.accept = '.txt';
        } else if (type === 'video') {
            fileInput.accept = 'video/*'; // Aceptar cualquier formato de video
        }
        
        fileInput.onchange = (e) => {
            const file = e.target.files[0];

            if (file) {
                if (type === 'image') {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setContent(prevContent => [
                            ...prevContent,
                            { type: 'imagen', file: file, preview: reader.result }
                        ]);
                    };
                    reader.readAsDataURL(file);
                } else if (type === 'txt') {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setContent(prevContent => [
                            ...prevContent,
                            { type: 'txt', file: file, content: reader.result }
                        ]);
                    };
                    reader.readAsText(file);
                } else if (type === 'video') {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setContent(prevContent => [
                            ...prevContent,
                            { type: 'video', file: file, preview: reader.result }
                        ]);
                    };
                    reader.readAsDataURL(file);
                }
            }
        };

        fileInput.click();
    };

    // Function to delete an item
    const handleDelete = (index) => {
        setContent(prevContent => prevContent.filter((_, i) => i !== index));
    };

    // Function to publish content
    const handlePublish = async () => {
        try {
            if (!token) {
                alert('No has iniciado sesión');
                navigate('/login');
                return;
            }
            
            // Create a FormData object to send files
            const formData = new FormData();
            formData.append('idProyecto', idProyecto);

            // Append each content item
            content.forEach((item, index) => {
                formData.append(`tipo`, item.type);
                formData.append(`contenido`, item.file);
            });

            // Send to backend with authorization header
            const response = await axios.post('https://lookode-back.vercel.app/proyectos/contenido', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // Añadir el token de autorización
                }
            });

            // Handle successful upload
            alert('Proyecto Publicado Exitosamente');
            
            navigate('/perfil');
            // Optionally, clear content or redirect
            setContent([]);
        } catch (error) {
            console.error('Error al publicar contenido:', error);
            if (error.response && error.response.status === 401) {
                alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
                navigate('/login');
            } else {
                alert('Error al publicar contenido');
            }
        }
    };

    return (
        <>
            <Header />
            <div className="addcontentpryct-main-content">
                <div className="addcontentpryct-content-container">
                    {content.map((item, index) => (
                        <div 
                            key={index} 
                            className="addcontentpryct-content-item"
                            onMouseEnter={(e) => e.currentTarget.style.opacity = 0.8} 
                            onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
                        >
                            {item.type === 'imagen' ? (
                                <div className="addcontentpryct-image-container">
                                    <img 
                                        src={item.preview} 
                                        alt="Uploaded content" 
                                        className="addcontentpryct-main-image"
                                    />
                                    <button 
                                        className="addcontentpryct-delete-btn" 
                                        onClick={() => handleDelete(index)}
                                    >
                                       
                                    </button>
                                </div>
                            ) : item.type === 'txt' ? (
                                <div className="addcontentpryct-text-container">
                                    <pre>{item.content}</pre>
                                    <button 
                                        className="addcontentpryct-delete-btn" 
                                        onClick={() => handleDelete(index)}
                                    >
                                        &#10005;
                                    </button>
                                </div>
                            ) : item.type === 'video' ? (
                                <div className="addcontentpryct-video-container">
                                    <video 
                                        src={item.preview} 
                                        controls 
                                        className="addcontentpryct-main-video"
                                    />
                                    <button 
                                        className="addcontentpryct-delete-btn" 
                                        onClick={() => handleDelete(index)}
                                    >
                                        &#10005;
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>

            <div className="addcontentpryct-navbar">
                <Link to="/perfil">  
                    <button className="addcontentpryct-btn addcontentpryct-btn-salir">SALIR</button>
                </Link>

                <div className="addcontentpryct-buttons-group">
                    <button 
                        className="addcontentpryct-btn addcontentpryct-btn-icon"
                        onClick={() => handleFileUpload('image')}
                    >
                        <IoIosImage />;
                    </button>
                    <button 
                        className="addcontentpryct-btn addcontentpryct-btn-icon"
                        onClick={() => handleFileUpload('txt')}
                    >
                        <RiTextSnippet />
                    </button>
                    <button 
                        className="addcontentpryct-btn addcontentpryct-btn-icon"
                        onClick={() => handleFileUpload('video')}
                    >
                       <PiVideoFill />
                    </button>
                </div>

                <button 
                    className="addcontentpryct-btn addcontentpryct-btn-publicar"
                    onClick={handlePublish}
                    disabled={content.length === 0}
                >
                    PUBLICAR
                </button>
            </div>
        </>
    );
}

export default AddContentPryct;