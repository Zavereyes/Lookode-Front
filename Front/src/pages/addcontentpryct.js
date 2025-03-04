import React from 'react';
import Header from '../components/header.js';
import './addcontentpryct.css'; 
import { Link } from 'react-router-dom';

function AddContentPryct() {
    return (
        <>
            <Header />

            <div className="addcontentpryct-main-content">
                <div className="addcontentpryct-image-container">
                    <img src="/14.jfif" alt="Designer Marvan DESI" className="addcontentpryct-main-image" />
                </div>
            </div>

            <div className="addcontentpryct-main-content">
                <div className="addcontentpryct-image-container">
                    <img src="/16.jfif" alt="Designer Marvan DESI" className="addcontentpryct-main-image" />
                </div>
            </div>

            <div className="addcontentpryct-main-content">
                <div className="addcontentpryct-image-container">
                    <img src="/11.jfif" alt="Designer Marvan DESI" className="addcontentpryct-main-image" />
                </div>
            </div>

            <div className="addcontentpryct-navbar">
            <Link to ="/perfil">  <button className="addcontentpryct-btn addcontentpryct-btn-salir">SALIR</button></Link>

                <div className="addcontentpryct-buttons-group">
                    <button className="addcontentpryct-btn addcontentpryct-btn-icon">^</button>
                    <button className="addcontentpryct-btn addcontentpryct-btn-icon">T</button>
                    <button className="addcontentpryct-btn addcontentpryct-btn-icon">&lt;&gt;</button>
                    <button className="addcontentpryct-btn addcontentpryct-btn-icon">▶</button>
                </div>

                <button className="addcontentpryct-btn addcontentpryct-btn-publicar">PUBLICAR</button>
            </div>
        </>
    );
}

export default AddContentPryct;
