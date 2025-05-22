// header.js - modificación
import React, { useState, useEffect, useRef } from 'react';
import './header.css';
import { IoSearchSharp } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { FaRegUser } from "react-icons/fa";
import { HiOutlineAdjustments } from "react-icons/hi";
import { IoIosLogOut } from "react-icons/io";
import { useSearch } from '../context/SearchContext';
import { SlMagicWand } from "react-icons/sl";

const Header = ({ showSearch = true, showfotoperfil = true, onSearch, onClearSearch  }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const usuario = authService.getCurrentUser();
  const navigate = useNavigate();
  const { handleSearch, handleClearSearch } = useSearch();

  useEffect(() => {
    // Código existente para cargar el avatar...
    
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

    // Cerrar dropdown al hacer clic fuera
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Limpieza
    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [usuario]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    setDropdownVisible(false);
    authService.logout();
    
    setTimeout(() => {
      navigate('/login');
    }, 0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Primero realizamos la búsqueda usando el contexto
      handleSearch(searchTerm);
      
      // Luego redirigimos al dashboard si no estamos ya ahí
      if (window.location.pathname !== '/') {
        navigate('/');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault();
      handleSearch(searchTerm);
      
      // Redirigir al dashboard si no estamos ya ahí
      if (window.location.pathname !== '/') {
        navigate('/');
      }
    }
  };
  
  const handleLogoClick = () => {
    handleClearSearch();
  };
  return (
    <header className="header">
      <Link to="/" className="Headerlogo" onClick={handleLogoClick}>
  <img
    src="/img_simbolos/LOGO_SIMBOLO.png"
    alt="Avatar"
    width="40"
    height="25"
  />
</Link>

      {showSearch && (
        <div className="search-container">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          <button className="search-button" onClick={handleSearchSubmit}>
          <SlMagicWand  className="icono-busqueda" />
          </button>
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
          <div className="avatar-container" ref={dropdownRef}>
            <div className="avatar" onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
              <img
                src={avatarUrl || "img_simbolos/default-avatar.png"}
                alt="Avatar"
                width="40"
                height="40"
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
              {dropdownVisible && (
                <div className="avatar-status online"></div>
              )}
            </div>
            {dropdownVisible && (
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="user-avatar">
                    <img
                      src={avatarUrl || "img_simbolos/default-avatar.png"}
                      alt="Usuario"
                    />
                  </div>
                  <div className="user-details">
                    <p className="user-name">{usuario?.nickname || "Usuario"}</p>
                    <p className="user-email">{usuario?.email || ""}</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-menu">
                  <Link to="/perfil" className="dropdown-item">
                    <span className="dropdown-icon"><FaRegUser /></span>
                    <span>Mi Perfil</span>
                  </Link>
                  <Link to="/ajustes" className="dropdown-item">
                    <span className="dropdown-icon"><HiOutlineAdjustments /></span>
                    <span>Ajustes</span>
                  </Link>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <span className="dropdown-icon"><IoIosLogOut /></span>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;