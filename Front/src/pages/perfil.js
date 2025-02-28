import React from 'react';
import Footer from '../components/footer.js';
import Header from '../components/header.js';
import PerfilHeader from '../components/perfilheader.js';
import Grid from '../components/grid.js';

function perfil(){
    return(
        <>
        <Header />
        <PerfilHeader />

        <br></br>        <br></br>        <br></br>        <br></br>
         <Grid showEditButton={true} />
        <Footer />
  
        </>
    );
}
export default perfil;
