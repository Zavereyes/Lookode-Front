import React from 'react';
import Header from '../components/header.js';
import Formularioprcyt from '../components/formulariopryct.js';

function EditarPryct() {
    return (
        <>
            <Header />
            <Formularioprcyt 
                showContinuarButton={false} 
                showEditarButton={true} 
                showEliminarButton={true}
                isEditMode={true} // Indicamos que estamos en modo edición
            />
        </>
    );
}

export default EditarPryct;