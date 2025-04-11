import React, { useState, useEffect } from 'react';
import './header.css';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Header = ({ showSearch = true, showfotoperfil = true }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const usuario = authService.getCurrentUser();
  const navigate = useNavigate();

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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    // First close the dropdown
    setDropdownVisible(false);
    
    // Then handle logout
    authService.logout();
    
    // Use a small timeout to ensure state updates complete before navigation
    // This helps prevent the concurrent rendering error
    setTimeout(() => {
      navigate('/login');
    }, 0);
  };

  return (
    <header className="header">
      <Link to="/" className="Headerlogo">
        <img
          src="img_simbolos/LOGO_SIMBOLO.png"
          alt="Avatar"
          width="40"
          height="25"
        />
      </Link>
      {showSearch && (
        <div className="search-container">
          <input type="text" className="search-bar" placeholder="Search..." />
        </div>
      )}
      <div className="right-section">
        {!usuario && (
          <>
            <Link to="/login" style={{ textDecoration: 'none' }} className="btn login-btn">
              Iniciar sesión
            </Link>
            <Link to="/registro" style={{ textDecoration: 'none' }} className="btn register-btn">
              Registrarse
            </Link>
          </>
        )}
        {showfotoperfil && usuario && (
          <div className="avatar-container" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
            <Link to="/perfil">
              <div className="avatar" style={{ cursor: 'pointer' }}>
                <img
                  src={avatarUrl || "img_simbolos/default-avatar.png"} // Usa una imagen por defecto si no hay avatar
                  alt="Avatar"
                  width="40"
                  height="40"
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
            </Link>
            {dropdownVisible && (
              <div className="dropdown">
                <button className="dropdown-btn" onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
            
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;