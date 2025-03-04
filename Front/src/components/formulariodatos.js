import React from 'react';
import './formulariodatos.css';
import { Link } from 'react-router-dom';

const Formulariodatos = ({showRegistrarButton = true, showGuardarButton = true, showLookodeLogo = true }) => {
    return (
        <div className="formulariodatos-wrapper">
            <div className="formulariodatos-background-pattern"></div>
            <div className="formulariodatos-container">
               {showLookodeLogo && <div className="formulariodatos-logo">
                    <span className="formulariodatos-logo-icon">&#10094;&#10095;</span>
                    LOOKODE
                </div>
                }
                <div className="formulariodatos-avatar">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16L7 11H10V7H14V11H17L12 16Z"/>
                        <path d="M17 18L19 20M7 18L5 20M7 6L5 4M17 6L19 4" stroke="#7b6cff" strokeWidth="1"/>
                        <path d="M12 3L12 3.01M3 12L3.01 12M21 12L21.01 12M12 21L12 21.01" stroke="#7b6cff" strokeWidth="2"/>
                    </svg>
                </div>

                <form className="formulariodatos-form">
                    <div className="formulariodatos-form-group">
                        <label className="formulariodatos-label" htmlFor="usuario">Usuario*</label>
                        <input className="formulariodatos-input" type="text" id="usuario" required />
                    </div>

                    <div className="formulariodatos-form-group">
                        <label className="formulariodatos-label" htmlFor="email">Correo electrónico*</label>
                        <input className="formulariodatos-input" type="email" id="email" required />
                    </div>

                    <div className="formulariodatos-form-group">
                        <label className="formulariodatos-label" htmlFor="password">Contraseña*</label>
                        <input className="formulariodatos-input" type="password" id="password" required />
                    </div>

                    <div className="formulariodatos-form-group">
                        <label className="formulariodatos-label" htmlFor="confirm"> X</label>
                        <input className="formulariodatos-input" type="password" id="confirm" />
                    </div>

                    <div className="formulariodatos-form-group">
                        <label className="formulariodatos-label" htmlFor="instagram">Instagram</label>
                        <input className="formulariodatos-input" type="text" id="instagram" />
                    </div>

                    {showRegistrarButton && <button className="formulariodatos-button" type="submit">REGISTRAR</button>}
                    {showGuardarButton && <button className="formulariodatos-button" type="submit">Guardar</button>}

                </form>

                <Link to="/login" className="formulariodatos-login-link">Ya soy Lookoder</Link>
            </div>
        </div>
    );
}

export default Formulariodatos;
