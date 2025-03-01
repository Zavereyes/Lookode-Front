import React from 'react';
import Formulariodatos from '../components/formulariodatos.js';
import Header from '../components/header.js';

function Registro() {
    return (
        <>
            <div className="background-pattern"></div>
            <div className="container">
                <div className="reglogo">
                    <span className="reglogo-icon">&#10094;&#10095;</span>
                    LOOKODE
                </div>

                <div className="avatar">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16L7 11H10V7H14V11H17L12 16Z"/>
                        <path d="M17 18L19 20M7 18L5 20M7 6L5 4M17 6L19 4" stroke="#7b6cff" strokeWidth="1"/>
                        <path d="M12 3L12 3.01M3 12L3.01 12M21 12L21.01 12M12 21L12 21.01" stroke="#7b6cff" strokeWidth="2"/>
                    </svg>
                </div>


            </div>
        </>
    );
}

export default Registro;
