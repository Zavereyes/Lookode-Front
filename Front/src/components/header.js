import React from 'react';
import './header.css';

const Header = () => {
  return (
    <header className="header">
      <a href="#" className="logo">&lt;/&gt;</a>
      <div className="search-container">
        <input type="text" className="search-bar" placeholder="Search..." />
      </div>
      <div className="right-section">
        <span className="star-icon">★</span>
        <div className="avatar">
          <img 
            src="/zave.jpg" 
            alt="Avatar" 
            width="40" 
            height="40" 
            style={{ borderRadius: '50%' }} 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
