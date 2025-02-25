import React from 'react';
import Footer from '../components/footer.js';
import './login.css';

function login(){
    return (
        <>
         
         <div class="login-container">
                <div class="logo">
                    <span class="logo-icon">&lt;&gt;</span>
                    LOOKODE
                </div>
                <form>
                    <div class="form-group">
                        <label for="email">correo electronico*</label>
                        <input type="email" id="email" required/>
                    </div>
                    <div class="form-group">
                        <label for="password">contraseña*</label>
                        <input type="password" id="password" required/>
                    </div>
                    <button type="submit" class="btn-enter">ENTRAR</button>
                </form>
                <a href="#" class="signup-link">Todavía no soy Lookoder</a>
            </div>



        </>
          
      );
}
export default login;