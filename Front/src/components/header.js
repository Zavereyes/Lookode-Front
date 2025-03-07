import React from 'react';
import './header.css';
import { Link } from 'react-router-dom';

const Header = ({showSearch = true, showfotoperfil = true}) => {
  return (
    <header className="header">
     <Link to="/"  className="Headerlogo"><img 
            src="img_simbolos/LOGO_SIMBOLO.png" 
            alt="Avatar" 
            width="40" 
            height="25" 
          />
          </Link>
          {showSearch && <div className="search-container">
        <input type="text" className="search-bar" placeholder="Search..." />
      </div>}
      <div className="right-section">
      <Link to="/login" style={{ textDecoration: "none" }} className="btn login-btn">Iniciar sesión</Link>
      <Link to="/registro" style={{ textDecoration: "none" }} className="btn register-btn">Registrarse</Link>
        {showfotoperfil && <Link to="/perfil">
        <div className="avatar" style={{ cursor: "pointer" }}>
          <img 
            src="/zave.jpg" 
            alt="Avatar" 
            width="40" 
            height="40" 
            style={{ borderRadius: '50%' }} 
          />
        </div>
      </Link>}
      </div>
    </header>
  );
};

export default Header;
