import React from 'react';
import Footer from '../components/footer.js';
import './login.css';

function login(){
    return (
        <>
         
         <div className="login-container">
                <div className="logo">
                    <span className="logo-icon">&lt;&gt;</span>
                    LOOKODE
                </div>
                <form>
                    <div className="form-group">
                        <label for="email">correo electronico*</label>
                        <input type="email" id="email" required/>
                    </div>
                    <div className="form-group">
                        <label for="password">contraseña*</label>
                        <input type="password" id="password" required/>
                    </div>
                    <button type="submit" className="btn-enter">ENTRAR</button>
                </form>
                <a href="#" className="signup-link">Todavía no soy Lookoder</a>
            </div>



        </>
          
      );
}
export default login;