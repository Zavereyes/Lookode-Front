import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
        <div className="social-icons">
            <a href="#" className="social-icon">✕</a>
            <a href="#" className="social-icon">◎</a>
        </div>
        <div className="logo">
            <span>&lt;/&gt;</span>
            <span className="logo-text">LOOKODE</span>
        </div>
        <div className="copyright">
            Copyright LOOKODE 2025
        </div>
    </footer>
  );
};

export default Footer;