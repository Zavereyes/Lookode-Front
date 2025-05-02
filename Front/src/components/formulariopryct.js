import React, { useState, useEffect } from 'react';
import './formulariopryct.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { projectService } from '../services/projectService';
import Select from 'react-select';

const Formularioprcyt = ({ showContinuarButton = true, showEditarButton = true, showEliminarButton = true }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [tags, setTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
  const { idProyecto } = useParams(); // Obtener idProyecto de la URL

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await projectService.getAllTags();
                const formattedTags = response.map(tag => ({
                    value: tag.NombreTag,
                    label: tag.NombreTag
                }));
                setAvailableTags(formattedTags);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const handleUploadClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleTagChange = (selectedOptions) => {
        setTags(selectedOptions);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && event.target.value) {
            event.preventDefault();
            const newTag = { value: event.target.value, label: event.target.value };
            
            // Check if tag already exists
            const tagExists = availableTags.some(tag => tag.value === newTag.value);
            
            if (!tagExists) {
                // Add to available tags if it's a new tag
                setAvailableTags([...availableTags, newTag]);
            }
            
            // Add to selected tags
            setTags([...tags, newTag]);
            event.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!titulo) {
            setError('El título es obligatorio');
            return;
        }
    
        setIsLoading(true);
        setError('');
    
        try {
            // Modificación aquí: asegurar que los tags sean un array de strings
            const tagValues = tags.map(tag => tag.value);
            
            const projectData = {
                titulo: titulo,
                tags: tagValues,
                imagen: imageFile,
            };
    
            const response = await projectService.createProject(projectData);
    
            if (response.idProyecto) {
                navigate(`/addcontentpryct/${response.idProyecto}`);
            } else {
                navigate('/perfil');
            }
        } catch (error) {
            console.error('Error al crear proyecto:', error);
            setError('Error al crear el proyecto. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!idProyecto) {
            setError('No se pudo identificar el proyecto a eliminar');
            return;
        }

        const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.');
        
        if (!confirmar) {
            return;
        }

        setIsDeleting(true);
        setError('');

        try {
            await projectService.deleteProject(idProyecto);
            navigate('/perfil');
        } catch (error) {
            console.error('Error al eliminar proyecto:', error);
            setError('Error al eliminar el proyecto. Inténtalo de nuevo.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="main-content">
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="upload-area" onClick={handleUploadClick}>
                        <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />

                        {selectedImage ? (
                            <img src={selectedImage} alt="Vista previa" className="preview-image" />
                        ) : (
                            <button type="button" required className="btn btn-upload">Cargar</button>
                        )}
                    </div>

                    <div className="form-area">
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label className="form-label">Título<span>*</span></label>
                            <input
                                type="text"
                                className="form-input"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tag<span>*</span></label>
                            <Select
                                options={availableTags}
                                isMulti
                                value={tags}
                                onChange={handleTagChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Escribe y presiona Enter..."
                            />
                        </div>

                        <div className="button-container">
                            <Link to="/perfil">
                                <button type="button" className="btn btn-exit">Salir</button>
                            </Link>

                            {showContinuarButton && (
                                <button
                                    type="submit"
                                    className="btn btn-continue"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Guardando...' : 'Continuar'}
                                </button>
                            )}

                            {showEliminarButton && (
                                <button 
                                    type="button" 
                                    className="btn btn-eliminar"
                                    onClick={handleDeleteProject}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            )}

                            {showEditarButton && (
                                <button type="button" className="btn btn-editar">Editar</button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Formularioprcyt;