import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
        <div className="social-icons">
            <a href="#" className="social-icon">
              <img 
                src="img_simbolos/X.png" 
                alt="Avatar" 
                width="15" 
                height="15" 
              />
          </a>
            <a href="#" className="social-icon">
              <img 
                src="img_simbolos/instagram.png" 
                alt="Avatar" 
                width="15" 
                height="15" 
              />
              </a>
        </div>
        <div className="logo">
          <img 
            src="img_simbolos/logo_lookode.png" 
            alt="Avatar" 
            width="150" 
            height="20" 
          />
        </div>
        <div className="copyright">
            Copyright LOOKODE 2025
        </div>
    </footer>
  );
};

export default Footer;