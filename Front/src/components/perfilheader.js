import React, { useState } from 'react';
import './perfilheader.css';

const PerfilHeader = () => {
  // Estado para manejar el botón activo
  const [activeButton, setActiveButton] = useState(null);
  const [displayText, setDisplayText] = useState(''); // Estado para mostrar el texto

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
    
    // Cambia el texto según el botón seleccionado
    if (buttonId === 'button1') {
      setDisplayText('Creados');
    } else if (buttonId === 'button2') {
      setDisplayText('Favoritos');
    }
  };

  return (
    <>
      <div className="profile-container">
        <div className="logo">
          <img 
            src="/zave.jpg" 
            alt="Avatar" 
            width="40" 
            height="40" 
            style={{ borderRadius: '50%' }} 
          /> 
        </div>
        <div className="username">ZAVEREYES</div>
        <div className="buttons-container">
          <button 
            className={`button ${activeButton === 'button1' ? 'active' : ''}`} 
            onClick={() => handleButtonClick('button1')}
          >
            &lt;&gt;
          </button>
          <button 
            className={`button ${activeButton === 'button2' ? 'active' : ''}`} 
            onClick={() => handleButtonClick('button2')}
          >
            +
          </button>
        </div>
        {/* Se muestra el texto debajo si hay uno seleccionado */}
        <div className="text-display">{displayText}</div>
      </div>
    </>
  );
};

export default PerfilHeader;
