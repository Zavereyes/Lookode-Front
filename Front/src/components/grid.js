import React from 'react';
import './grid.css';
import { Link } from 'react-router-dom';

const images = [
  "/1.jfif", "/2.jfif", "/3.jfif", "/9.jfif",
  "/5.jfif", "/8.jfif", "/4.jfif", "/10.jfif",
  "/11.jfif", "/12.jfif", "/13.jfif", "/6.jfif", "/7.jfif",
];

function Grid({ showEditButton = false }) {
  return (
    <div className="grid-container">
      {images.map((src, index) => (
        <div key={index} className="grid-item">
          <img src={src} alt="Proyecto" />
          <Link to="/editarpryct"> {showEditButton && <button className="edit-button">             &lt;&gt;
            </button>}</Link>
        </div>
        
      ))}
    </div>
  );
}

export default Grid;