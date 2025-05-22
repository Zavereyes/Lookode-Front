import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [idUsuario, setIdUsuario] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await axios.post('https://lookode-back.vercel.app/login', {
                correo: email,
                contraseña: password
            });
            
            if (response.data.message === 'Login exitoso') {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
                
                alert('Inicio de sesión exitoso');
                navigate('/');
            } else if (response.data.message === 'Usuario desactivado') {
                // Mostrar modal de reactivación
                setIdUsuario(response.data.idUsuario);
                setShowModal(true);
            } else {
                setError('Correo o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error de login:', error);
            setError('Hubo un error al iniciar sesión');
        }
    };

    const handleReactivarCuenta = async () => {
        try {
            const response = await axios.post('https://lookode-back.vercel.app/reactivar-cuenta', {
                idUsuario: idUsuario
            });
            
            if (response.data.message === "Cuenta reactivada exitosamente") {
                setShowModal(false);
                alert('Cuenta reactivada exitosamente. Por favor, inicie sesión nuevamente.');
                // Opcional: Limpiar los campos
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            console.error('Error al reactivar cuenta:', error);
            setError('Error al reactivar cuenta');
        }
    };

    const Modal = () => {
        if (!showModal) return null;
        
        return (
            <div className="modal-overlay">
                <div className="modal-container">
                    <h2>Cuenta desactivada</h2>
                    <p>Esta cuenta ha sido desactivada, ¿desea reactivarla?</p>
                    <div className="modal-buttons">
                        <button onClick={handleReactivarCuenta} className="btn-accept">Aceptar</button>
                        <button onClick={() => setShowModal(false)} className="btn-cancel">Cancelar</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="login-container">
                <div className="logo">
                    <img 
                        className="logoimg"
                        src="img_simbolos/logo_lookode.png" 
                        alt="Avatar" 
                        width="40" 
                        height="25" 
                    />
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
                <Link to="/registro" className="signup-link">Todavía no soy Lookoder</Link>
            </div>
            <Modal />
        </>
    );
}

export default Login;