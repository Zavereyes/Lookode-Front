import React, { useState } from 'react';
import './formulariodatos.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Formulariodatos = ({ showRegistrarButton = true, showGuardarButton = true, showLookodeLogo = true }) => {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contra, setContra] = useState('');
    const [twitter, setTwitter] = useState('');
    const [ig, setIg] = useState('');

    const [fileImg, setFileImg] = useState(null); 
    const navigate = useNavigate(); 

    const enviarDatos = (e) => {
        e.preventDefault(); 

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("correo", correo);
        formData.append("contra", contra);
        formData.append("twitter", twitter);
        formData.append("ig", ig);

        if (fileImg) {
            formData.append("fileImg", fileImg);
        }

        axios.post("http://localhost:3001/registro", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            if (response.data.message  === "registrado") {
                alert("Usuario registrado con éxito");
                // Aquí puedes redirigir al usuario a otra página, por ejemplo al login
            } else {
               // alert("Error al registrar usuario");
               navigate ('/dashboard');

               
            }
        }).catch(error => {
            console.error(error);
            alert("Hubo un error al registrar");
        });
    };

    return (
        <div className="formulariodatos-wrapper">
            <div className="formulariodatos-background-pattern"></div>
            <div className="formulariodatos-container">
                {showLookodeLogo && <div className="formulariodatos-logo">
                    <span className="formulariodatos-logo-icon">&#10094;&#10095;</span>
                    LOOKODE
                </div>}

                <form className="formulariodatos-form" onSubmit={enviarDatos}>
                    <div className="formulariodatos-form-group">
                        <label className="formulariodatos-label" htmlFor="usuario">nickname*</label>
                        <input className="formulariodatos-input" type="text" id="usuario" required onChange={(e) => setNombre(e.target.value)} />
                    </div>

                    <div className="formulariodatos-form-group">
                        <label className="formulariodatos-label" htmlFor="email">correo electrónico*</label>
                        <input className="formulariodatos-input" type="email" id="email" required onChange={(e) => setCorreo(e.target.value)} />
                    </div>

                    <div className="formulariodatos-form-group">
                        <label className="formulariodatos-label" htmlFor="password">contraseña*</label>
                        <input className="formulariodatos-input" type="password" id="password" required onChange={(e) => setContra(e.target.value)} />
                    </div>

                    <div className="formulariodatos-form-group">
                        <label className="formulariodatos-label" htmlFor="ig">instagram</label>
                        <input className="formulariodatos-input" type="text" id="ig" onChange={(e) => setIg(e.target.value)} />
                    </div>

                    <div className="formulariodatos-form-group">
                        <label className="formulariodatos-label" htmlFor="twitter">x</label>
                        <input className="formulariodatos-input" type="text" id="twitter" onChange={(e) => setTwitter(e.target.value)} />
                    </div>

                    <div className="formulariodatos-form-group">
                        <label className="formulariodatos-label" htmlFor="fileImg">avatar</label>
                        <input className="formulariodatos-input" type="file" id="fileImg" onChange={(e) => setFileImg(e.target.files[0])} />
                    </div>

                    {showRegistrarButton && <button className="formulariodatos-button" type="submit">REGISTRAR</button>}
                    {showGuardarButton && <button className="formulariodatos-button" type="submit">Guardar</button>}
                </form>

                <Link to="/login" className="formulariodatos-login-link">Ya soy Lookoder</Link>
            </div>
        </div>
    );
};

export default Formulariodatos;
