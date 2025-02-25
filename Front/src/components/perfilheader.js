import React, { useState } from 'react';
import './perfilheader.css';

const PerfilHeader = () => {
  // Estado para manejar el botón activo
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonId) => {
    // Cambiar el botón activo según el id
    setActiveButton(buttonId);
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
      </div>
    </>
  );
};

export default PerfilHeader;
