import React from 'react';
import Formulariodatos from '../components/formulariodatos.js';
import Header from '../components/header.js';
import PerfilHeader from '../components/perfilheader.js';

function Registro() {
    return (
        <>
            <Header />
            
            <PerfilHeader showViewsButton = {false} />

            <div className="background-pattern"></div>
                <div className="container">
                  
                    <Formulariodatos  showRegistrarButton ={false}  showLookodeLogo = {false} showLinkLookoder= {false} />

                </div>

        </>
    );
}

export default Registro;
