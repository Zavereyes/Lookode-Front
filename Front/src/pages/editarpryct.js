import React from 'react';
import Footer from '../components/footer.js';
import Header from '../components/header.js';
import Formularioprcyt from '../components/formulariopryct.js';
import Grid from '../components/grid.js';



function editarpryct(){
    return(
                <>
                <Header />
                    <Formularioprcyt showContinuarButton ={false} />
                
                
                </>


    );


}
export default editarpryct;