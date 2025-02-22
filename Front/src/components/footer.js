import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer class="footer">
        <div class="social-icons">
            <a href="#" class="social-icon">✕</a>
            <a href="#" class="social-icon">◎</a>
        </div>
        <div class="logo">
            <span>&lt;/&gt;</span>
            <span class="logo-text">LOOKODE</span>
        </div>
        <div class="copyright">
            Copyright LOOKODE 2025
        </div>
    </footer>
  );
};

export default Footer;