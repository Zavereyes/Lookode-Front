import React, { useState } from 'react';
import './perfilheader.css';
import { Link } from 'react-router-dom';

const PerfilHeader = ({showViewsButton = true}) => {
  // Estado para manejar el botón activo
  const [activeButton, setActiveButton] = useState(null);
  const [displayText, setDisplayText] = useState(''); // Estado para mostrar el texto

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
    
  
    if (buttonId === 'button1') {
      setDisplayText('Creados');
    } else if (buttonId === 'button2') {
      setDisplayText('Favoritos');
    }
  };

  return (
    <>
      <div className="profile-container">
        <Link to = "/editarperfil" > <div className="logo">
          <img 
            src="/zave.jpg" 
            alt="Avatar" 
            width="40" 
            height="40" 
            style={{ borderRadius: '50%' }} 
          /> 
        </div>
        </Link>

        <div className="username">ZAVEREYES</div>
        
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
