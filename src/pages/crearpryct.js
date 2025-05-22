import React from 'react';
import Header from '../components/header.js';
import FormularioPryct from '../components/formulariopryct.js';

function crearpryct(){
    return(
        <>
        <Header />
        <FormularioPryct  showEditarButton = {false} showEliminarButton = {false} />
        
        </>
    );
}
export default crearpryct;

