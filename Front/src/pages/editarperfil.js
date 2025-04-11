import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Formulariodatos from '../components/formulariodatos.js';
import Header from '../components/header.js';
import authService from '../services/authService';

function Editarperfil() {
    const navigate = useNavigate();
    
    // Verificar si el usuario está autenticado
    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/login');
        }
    }, [navigate]);
    return (
        <>
            <Header />
            

            <div className="background-pattern"></div>
                <div className="container">
                  
                    <Formulariodatos modo="editar" showRegistrarButton ={false}  showLookodeLogo = {false} showLinkLookoder= {false} />

                </div>

        </>
    );
}

export default Editarperfil;
