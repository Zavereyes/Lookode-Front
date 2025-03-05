import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import { useNavigate } from 'react-router-dom';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 


    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const response = await axios.post('http://localhost:3001/login', {
                correo: email,
                contraseña: password
            });

            if (response.data.message === 'Login exitoso') {
                // Redirigir al usuario a la página principal o a donde lo necesites
                alert('Inicio de sesión exitoso');

                navigate ('/dashboard');
            } else {
                setError('Correo o contraseña incorrectos');
                
            }
        } catch (error) {
            console.error('Error al iniciar sesión', error);
            if (error.response) {
                // La respuesta del servidor con el error
                console.error('Respuesta del servidor:', error.response.data);
                console.error('Estado del error:', error.response.status);
            } else if (error.request) {
                // La solicitud fue realizada, pero no hubo respuesta
                console.error('No se recibió respuesta del servidor:', error.request);
            } else {
                // Algo pasó al configurar la solicitud
                console.error('Error al configurar la solicitud:', error.message);
            }
            setError('Hubo un error al iniciar sesión');
        }
        
    };

    return (
        <>
            <div className="login-container">
                <div className="logo">
                    <span className="logo-icon">&lt;&gt;</span>
                    LOOKODE
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico*</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña*</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-enter">ENTRAR</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
                <a href="#" className="signup-link">Todavía no soy Lookoder</a>
            </div>
        </>
    );
}

export default Login;
