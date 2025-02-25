import React from 'react';
import './header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <a href="#" className="logo">&lt;/&gt;</a>
      <div className="search-container">
        <input type="text" className="search-bar" placeholder="Search..." />
      </div>
      <div className="right-section">
      <Link to="/login" className="btn login-btn">Iniciar sesión</Link>
      <Link to="/register" className="btn register-btn">Registrarse</Link>
        <span className="star-icon">★</span>
        <div className="avatar">
          <img 
            src="/zave.jpg" 
            alt="Avatar" 
            width="40" 
            height="40" 
            style={{ borderRadius: '50%' }} 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
