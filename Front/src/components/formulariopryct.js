import React from 'react';
import './formulariopryct.css';
import { Link } from 'react-router-dom';


const Formularioprcyt = ({ showContinuarButton = true ,  showEditarButton = true , showEliminarButton = true }) => {
    return(
        <div className="main-content">
        <div className="container">
            <div className="upload-area">
                <button className="btn btn-upload">Cargar</button>
            </div>
            
            <div className="form-area">
                <div className="form-group">
                    <label className="form-label">Titulo<span>*</span></label>
                    <input type="text" className="form-input" required/>
                </div>
                
                <div className="form-group">
                    <label className="form-label">Tag<span>*</span></label>
                    <input type="text" className="form-input" required/>
                </div>
                
                <div className="button-container">
                <Link to ="/perfil"> <button className="btn btn-exit">Salir</button></Link>
                <Link to="/addcontentpryct">
                {showContinuarButton && <button className="btn btn-continue">Continuar</button>}
                </Link>
                    {showEliminarButton && <button className="btn btn-eliminar">Eliminar</button>}
                    {showEditarButton && <button className="btn btn-editar">Editar</button>}
                </div>
            </div>
        </div>
        </div>
    );
}

export default Formularioprcyt;
