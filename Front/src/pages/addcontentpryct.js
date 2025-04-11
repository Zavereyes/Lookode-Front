import React, { useState } from 'react';
import Header from '../components/header.js';
import './addcontentpryct.css'; 
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

function AddContentPryct() {
    const { idProyecto } = useParams();
    const [content, setContent] = useState([]); 
    const navigate = useNavigate();
    const handleFileUpload = (type) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = type === 'image' ? 'image/*' : '.txt';

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
                            { type: 'documento', file: file, content: reader.result }
                        ]);
                    };
                    reader.readAsText(file);
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
            // Create a FormData object to send files
            const formData = new FormData();
            formData.append('idProyecto', idProyecto);

            // Append each content item
            content.forEach((item, index) => {
                formData.append(`tipo`, item.type);
                formData.append(`contenido`, item.file);
            });

            // Send to backend
            const response = await axios.post('http://localhost:3001/proyectos/contenido', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Handle successful upload
            alert('Proyecto Publicado Exitosamente');
            
            navigate('/perfil')
            // Optionally, clear content or redirect
            setContent([]);
        } catch (error) {
            console.error('Error al publicar contenido:', error);
            alert('Error al publicar contenido');
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
                                        &#10005;
                                    </button>
                                </div>
                            ) : (
                                <div className="addcontentpryct-text-container">
                                    <pre>{item.content}</pre>
                                    <button 
                                        className="addcontentpryct-delete-btn" 
                                        onClick={() => handleDelete(index)}
                                    >
                                        &#10005;
                                    </button>
                                </div>
                            )}
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
                        ^
                    </button>
                    <button 
                        className="addcontentpryct-btn addcontentpryct-btn-icon"
                        onClick={() => handleFileUpload('txt')}
                    >
                        T
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