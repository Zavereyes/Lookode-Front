import React from 'react';
import Header from '../components/header.js';
import Formularioprcyt from '../components/formulariopryct.js';



function editarpryct(){
    return(
                <>
                <Header />
                
                    <Formularioprcyt showContinuarButton ={false} />
                
                
                </>


    );


}
export default editarpryct;