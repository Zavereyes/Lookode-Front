import React from 'react';
import Formulariodatos from '../components/formulariodatos.js';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
import PerfilHeader from '../components/perfilheader.js';

function Registro() {
    return (
        <>
            <Header  showSearch = {false} showfotoperfil = {false}/>
            <div className="background-pattern"></div>
            <div className="container">
            

                <Formulariodatos   showGuardarButton ={false}/>

            </div>
            <Footer />
        </>
    );
}

export default Registro;
