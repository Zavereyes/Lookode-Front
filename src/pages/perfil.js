import React, { useState } from 'react';
import Footer from '../components/footer.js';
import Header from '../components/header.js';
import PerfilHeader from '../components/perfilheader.js';
import Grid from '../components/grid.js';
import BotonCrear from '../components/botoncrear.js';
import { Link } from 'react-router-dom';

function Perfil() {
    // Estado para controlar el modo de visualización (all o favorites)
    const [viewMode, setViewMode] = useState('created');

    // Manejar el cambio de modo de visualización
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    return(
        <>
        <Header />
        <PerfilHeader onViewModeChange={handleViewModeChange} />

        <br></br>
        <br></br>
        <br></br>
        <br></br>
        
        {/* Pasar el modo de visualización al componente Grid */}
        <Grid 
            showEditButton={viewMode === 'created'} 
            viewMode={viewMode} 
        />
        
        <Footer />
        
        {/* Solo mostrar el botón de crear si estamos en modo 'all' */}
        {viewMode === 'created' && (
            <Link to="/crearpryct">
                <BotonCrear />
            </Link>
        )}
        </>
    );
}

export default Perfil;