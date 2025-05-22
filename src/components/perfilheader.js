import React, { useState, useEffect } from 'react';
import './perfilheader.css';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const PerfilHeader = ({ showViewsButton = true, onViewModeChange }) => {
  // Estado para manejar el botón activo
  const [activeButton, setActiveButton] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [displayText, setDisplayText] = useState(''); // Estado para mostrar el texto
  const usuario = authService.getCurrentUser();
  
  useEffect(() => {
      // Cargar el avatar cuando el componente se monta
      const fetchAvatar = async () => {
        if (usuario && usuario.idUsuario) {
          try {
            const url = await authService.getAvatar(usuario.idUsuario);
            if (url) {
              setAvatarUrl(url);
            }
          } catch (error) {
            console.error("Error al cargar el avatar:", error);
          }
        }
      };
  
      fetchAvatar();
  
      // Limpieza del URL.createObjectURL al desmontar
      return () => {
        if (avatarUrl) {
          URL.revokeObjectURL(avatarUrl);
        }
      };
    }, [usuario]);

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
    
    if (buttonId === 'button1') {
      setDisplayText('Creados');
      // Notificar al componente padre sobre el cambio de modo de visualización
      if (onViewModeChange) {
        onViewModeChange('created');
      }
    } else if (buttonId === 'button2') {
      setDisplayText('Favoritos');
      // Notificar al componente padre sobre el cambio de modo de visualización
      if (onViewModeChange) {
        onViewModeChange('favorites');
      }
    }
  };

  return (
    <>
      <div className="profile-container">
        <Link to = "/editarperfil" > <div className="logo">
          <img 
            src= {avatarUrl}
            alt="Avatar" 
            width="40" 
            height="40" 
            /> 
        </div>
        </Link>

        <div className="username"> {usuario ? usuario.nickname : 'Invitado'}</div>
        
        <div className="buttons-container">
        {showViewsButton && <button 
            className={`perfil-button ${activeButton === 'button1' ? 'active' : ''}`} 
            onClick={() => handleButtonClick('button1')}
          >
            <img 
            src="img_simbolos/crear_simbolo.png" 
            alt="Avatar" 
            width="15" 
            height="9" 
          />
          </button>}
          {showViewsButton &&<button 
            className={`perfil-button ${activeButton === 'button2' ? 'active' : ''}`} 
            onClick={() => handleButtonClick('button2')}
          >
            <img 
            src="img_simbolos/estrella.png" 
            alt="Avatar" 
            width="15" 
            height="15" 
          />
      </button>}
        </div>
        {/* Se muestra el texto debajo si hay uno seleccionado */}
        <div className="text-display">{displayText}</div>
      </div>
    </>
  );
};

export default PerfilHeader;