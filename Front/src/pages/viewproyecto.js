import React from 'react';
import './viewproyecto.css';
import { Link } from 'react-router-dom';
import Header from '../components/header.js';
import Footer from '../components/footer.js';

const Viewproyecto = () => {
  return (
    <div className="page-container">
    <Header/>
      {/* Contenido Principal */}
      <main className="main-content">
        <section className="project-view">


        <div className="main-image">
            <img src="/img_grid/asd.png" alt="Project" />
          <div className="text-card">
            Este es un código de prueba para esta página llamada Lookode
          </div>
          <div className="image-grid">
            <img src="/img_grid/image 1.png" alt="Project 1" />
            <img src="/img_grid/image 2.png" alt="Project 2" />
          </div>
          <div className="text-card">
            Este es un mensaje de prueba para esta página llamada Lookode
          </div>
          </div>


        <aside className="project-details">
            <div className="avatar-large">
              <img src="/zave.jpg" alt="Avatar" />
            </div>
            <h2>ZAVEREYES</h2>
            <h3>[Nombre Proyecto]</h3>
            <button className="btn save-btn">GUARDAR</button>
            <div className="tags">
              <span>software</span>
              <span>softwareVideo</span>
              <span>softwareC++</span>
              <span>Js</span>
              <span>JavaScript</span>
              <span>softwareApp</span>
            </div>
            <div className="circles">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
        </aside>

        </section>
      </main>
      <Footer/>
    </div>
  );
};

export default Viewproyecto;
