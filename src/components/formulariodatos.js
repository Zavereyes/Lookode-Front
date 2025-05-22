import React, { useState, useEffect } from 'react';
import './formulariodatos.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Formulariodatos = ({ 
    modo = 'registro', 
    showRegistrarButton = true, 
    showGuardarButton = true,
    showLookodeLogo = true, 
    showLinkLookoder = true
}) => {    
    const usuario = authService.getCurrentUser();
    const navigate = useNavigate();

    const [modal, setModal] = useState({ show: false, type: '', message: '', onConfirm: null });
    
    // Estados para los campos del formulario
    const [nombre, setNombre] = useState(modo === 'editar' ? usuario?.nickname || '' : ''); 
    const [correo, setCorreo] = useState(modo === 'editar' ? usuario?.correo || '' : '');
    const [contra, setContra] = useState(modo === 'editar' ? usuario?.contraseña || '' : '');
    const [twitter, setTwitter] = useState(modo === 'editar' ? usuario?.twitter || '' : '');
    const [ig, setIg] = useState(modo === 'editar' ? usuario?.ig || '' : '');
    const [fileImg, setFileImg] = useState(null);
    const [preview, setPreview] = useState('');

    // Estados para errores de validación
    const [errors, setErrors] = useState({
        nombre: '',
        correo: '',
        contra: ''
    });

    // Validación de formulario
    const validarFormulario = () => {
        let isValid = true;
        const newErrors = { nombre: '', correo: '', contra: '' };

        // Validación del nickname (mínimo 3 caracteres)
        if (nombre.trim().length < 3) {
            newErrors.nombre = 'El nickname debe tener al menos 3 caracteres';
            isValid = false;
        }

        // Validación del correo electrónico
        const emailRegex = /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com|icloud\.com|aol\.com|protonmail\.com|mail\.com|zoho\.com|yandex\.com)$/i;
        if (!emailRegex.test(correo.trim())) {
            newErrors.correo = 'Ingresa un correo electrónico válido (Gmail, Outlook, etc.)';
            isValid = false;
        }

        // Validación de la contraseña
        if (contra.length < 8) {
            newErrors.contra = 'La contraseña debe tener al menos 8 caracteres';
            isValid = false;
        } else if (!/[A-Z]/.test(contra)) {
            newErrors.contra = 'La contraseña debe contener al menos una letra mayúscula';
            isValid = false;
        } else if (!/[0-9]/.test(contra)) {
            newErrors.contra = 'La contraseña debe contener al menos un número';
            isValid = false;
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(contra)) {
            newErrors.contra = 'La contraseña debe contener al menos un carácter especial';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleDesactivarCuenta = () => {
        setModal({
            show: true,
            type: 'confirm',
            message: "¿Seguro que quieres desactivar tu cuenta de Lookode? Tus proyectos dejaran de ser visibles para los demás",
            onConfirm: () => desactivarCuenta()
        });
    };

    const desactivarCuenta = () => {
        const token = localStorage.getItem('token');

        axios.put(`https://lookode-back.vercel.app/usuario/desactivar/${usuario.idUsuario}`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            setModal({
                show: true,
                type: 'success',
                message: "Tu cuenta ha sido desactivada.",
                onConfirm: () => {
                    authService.logout();
                    navigate('/login');
                }
            });
        })
        .catch(error => {
            setModal({
                show: true,
                type: 'error',
                message: "Hubo un error al desactivar la cuenta.",
                onConfirm: () => setModal({ show: false })
            });
        });
    };
    
    useEffect(() => {
        if (modo === 'editar' && usuario?.idUsuario && !fileImg) { 
            axios.get(`https://lookode-back.vercel.app/usuario/avatar/${usuario.idUsuario}`, { 
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                const imgUrl = URL.createObjectURL(response.data);
                setPreview(imgUrl);
            })
            .catch(error => console.error('Error al cargar el avatar:', error));
        }
    }, [modo, usuario, fileImg]); 

    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileImg(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result); 
            };
            reader.readAsDataURL(file);
        }
    };
    
    // Manejadores de cambio para campos individuales que validan en tiempo real
    const handleNombreChange = (e) => {
        const value = e.target.value;
        setNombre(value);
        
        if (value.trim().length < 3 && value.trim().length > 0) {
            setErrors(prev => ({ ...prev, nombre: 'El nickname debe tener al menos 3 caracteres' }));
        } else {
            setErrors(prev => ({ ...prev, nombre: '' }));
        }
    };

    const handleCorreoChange = (e) => {
        const value = e.target.value;
        setCorreo(value);
        
        const emailRegex = /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com|icloud\.com|aol\.com|protonmail\.com|mail\.com|zoho\.com|yandex\.com)$/i;
        if (!emailRegex.test(value.trim()) && value.trim().length > 0) {
            setErrors(prev => ({ ...prev, correo: 'Ingresa un correo electrónico válido (Gmail, Outlook, etc.)' }));
        } else {
            setErrors(prev => ({ ...prev, correo: '' }));
        }
    };

    const handleContraChange = (e) => {
        const value = e.target.value;
        setContra(value);
        
        if (value.length > 0) {
            if (value.length < 8) {
                setErrors(prev => ({ ...prev, contra: 'La contraseña debe tener al menos 8 caracteres' }));
            } else if (!/[A-Z]/.test(value)) {
                setErrors(prev => ({ ...prev, contra: 'La contraseña debe contener al menos una letra mayúscula' }));
            } else if (!/[0-9]/.test(value)) {
                setErrors(prev => ({ ...prev, contra: 'La contraseña debe contener al menos un número' }));
            } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)) {
                setErrors(prev => ({ ...prev, contra: 'La contraseña debe contener al menos un carácter especial' }));
            } else {
                setErrors(prev => ({ ...prev, contra: '' }));
            }
        } else {
            setErrors(prev => ({ ...prev, contra: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar el formulario antes de enviarlo
        if (!validarFormulario()) {
            setModal({
                show: true,
                type: 'error',
                message: "Por favor, corrige los errores en el formulario antes de continuar.",
                onConfirm: () => setModal({ show: false })
            });
            return;
        }

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("correo", correo);
        formData.append("contra", contra);
        formData.append("twitter", twitter);
        formData.append("ig", ig);

        if (fileImg) {
            formData.append("fileImg", fileImg);
        }

        if (modo === 'registro') {
            // Proceso de registro
            axios.post("https://lookode-back.vercel.app/registro", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(response => {
                if (response.data.message === "Registrado") {
                    setModal({
                        show: true,
                        type: 'success',
                        message: "Usuario registrado con éxito",
                        onConfirm: () => navigate('/login')
                    });
                } else {
                    setModal({
                        show: true,
                        type: 'success',
                        message: response.data.message || "Registro exitoso",
                        onConfirm: () => navigate('/login')
                    });
                }
            })
            .catch(error => {
                console.error(error);
                setModal({
                    show: true,
                    type: 'error',
                    message: error.response?.data?.message || "Hubo un error al registrar",
                    onConfirm: () => setModal({ show: false })
                });
            });
        } else if (modo === 'editar') {
            // Proceso de edición
            const token = localStorage.getItem('token');
            
            axios.put("https://lookode-back.vercel.app/usuario/editar", formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.data.message === "Perfil actualizado correctamente") {
                    // Actualizar el token y datos del usuario en localStorage
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
                    
                    setModal({
                        show: true,
                        type: 'success',
                        message: "Perfil actualizado con éxito",
                        onConfirm: () => navigate('/perfil')
                    });
                } else {
                    setModal({
                        show: true,
                        type: 'success',
                        message: response.data.message || "Actualización exitosa",
                        onConfirm: () => navigate('/perfil')
                    });
                }
            })
            .catch(error => {
                console.error(error);
                setModal({
                    show: true,
                    type: 'error',
                    message: error.response?.data?.message || "Hubo un error al actualizar el perfil",
                    onConfirm: () => setModal({ show: false })
                });
            });
        }
    };

    return (
        <div className="formulariodatos-wrapper">
             {modal.show && (
                <div className="custom-modal">
                    <div className="modal-content">
                        <p>{modal.message}</p>
                        <div className="modal-buttons">
                            {modal.type === 'confirm' ? (
                                <>
                                    <button className="btn-cancel" onClick={() => setModal({ show: false })}>Cancelar</button>
                                    <button className="btn-confirm" onClick={() => { modal.onConfirm(); setModal({ show: false }) }}>Confirmar</button>
                                </>
                            ) : (
                                <button className="btn-ok" onClick={() => modal.onConfirm()}>OK</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="formulariodatos-background-pattern"></div>
            <div className="formulariodatos-container">
                {showLookodeLogo && (
                    <div className="formulariodatos-logo">
                        <img 
                            src="img_simbolos/logo_lookode.png" 
                            alt="Avatar" 
                            width="200" 
                            height="27" 
                        />
                    </div>
                )}

                <form className="formulariodatos-form" onSubmit={handleSubmit}>
                    <div className="image-upload-container">
                        <label required htmlFor="fileImg" className="image-upload-label">
                            <div className="image-preview">
                                {preview ? (
                                    <img src={preview} alt="Avatar Preview" className="preview-img" />
                                ) : (
                                    <span className="default-avatar">+</span>
                                )}
                            </div>
                        </label>
                        <input 
                            type="file" 
                            id="fileImg" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="file-input" 
                        />
                    </div>
                                
                    <div className="formulariodatos-form-group">
                        <label className="formulariodatos-label" htmlFor="nickname">nickname*</label>
                        <input 
                            className={`formulariodatos-input ${errors.nombre ? 'input-error' : ''}`}
                            type="text" 
                            id="nickname" 
                            value={nombre} 
                            required 
                            onChange={handleNombreChange} 
                        />
                        {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                    </div>          

                    <div className="formulariodatos-form-group">
                        <label className="formulariodatos-label" htmlFor="email">correo electrónico*</label>
                        <input 
                            className={`formulariodatos-input ${errors.correo ? 'input-error' : ''}`}
                            type="email" 
                            id="email" 
                            value={correo} 
                            required 
                            onChange={handleCorreoChange} 
                        />
                        {errors.correo && <span className="error-message">{errors.correo}</span>}
                    </div>

                    <div className="formulariodatos-form-group">
                        <label className="formulariodatos-label" htmlFor="password">contraseña*</label>
                        <input 
                            className={`formulariodatos-input ${errors.contra ? 'input-error' : ''}`}
                            type="password" 
                            id="password" 
                            value={contra} 
                            required 
                            onChange={handleContraChange} 
                        />
                        {errors.contra && <span className="error-message">{errors.contra}</span>}
                    </div>

                    <div className="formulariodatos-form-group">
                        <label className="formulariodatos-label" htmlFor="ig">instagram</label>
                        <input 
                            className="formulariodatos-input" 
                            type="text" 
                            id="ig" 
                            value={ig} 
                            onChange={(e) => setIg(e.target.value)} 
                        />
                    </div>

                    <div className="formulariodatos-form-group">
                        <label className="formulariodatos-label" htmlFor="twitter">x</label>
                        <input 
                            className="formulariodatos-input" 
                            type="text" 
                            id="twitter" 
                            value={twitter} 
                            onChange={(e) => setTwitter(e.target.value)} 
                        />
                    </div>

                    {modo === 'registro' && showRegistrarButton && (
                        <button className="formulariodatos-button" type="submit">REGISTRAR</button>
                    )}
                    
                    {modo === 'editar' && showGuardarButton && (
                        <button className="formulariodatos-button" type="submit">GUARDAR</button>
                    )}
                </form>

                {modo === 'editar' && showGuardarButton && (
                    <button className="formulariodatos-button eliminar-cuenta" onClick={handleDesactivarCuenta}>
                        Desactivar cuenta
                    </button>
                )}

                {showLinkLookoder && (
                    <Link to="/login" className="formulariodatos-login-link">Ya soy Lookoder</Link>
                )}
            </div>
        </div>
    );
};

export default Formulariodatos;