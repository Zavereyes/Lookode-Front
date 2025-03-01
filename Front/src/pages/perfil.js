import React from 'react';
import Footer from '../components/footer.js';
import Header from '../components/header.js';
import PerfilHeader from '../components/perfilheader.js';
import Grid from '../components/grid.js';
import BotonCrear from '../components/botoncrear.js';
import { Link } from 'react-router-dom';



function perfil(){
    return(
        <>
        <Header />
        <PerfilHeader />

        <br></br>        <br></br>        <br></br>        <br></br>
         <Grid showEditButton={true} />
        <Footer />
        <Link  to = "/crearpryct"> <BotonCrear /></Link>
        </>
    );
}
export default perfil;
