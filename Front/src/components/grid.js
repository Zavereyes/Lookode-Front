import React from 'react';
import './grid.css';
import { Link } from 'react-router-dom';

const images = [
  "img_grid/asd.png", "img_grid/hgf.png", "img_grid/image 1.png", "img_grid/image 2.png",
  "img_grid/image 3.png", "img_grid/image 4.png", "img_grid/image 5.png", "img_grid/image 6.png",
  "img_grid/image 7.png", "img_grid/image 8.png", "img_grid/image 9.png", "img_grid/image 10.png", "img_grid/image 333.png",
  "img_grid/image 10.png","img_grid/image 5.png","img_grid/image 3.png","img_grid/asd.png",
];

function Grid({ showEditButton = false }) {
  return (
    <div className="grid-container">
      {images.map((src, index) => (
        <Link to="/viewproyecto">
        <div key={index} className="grid-item">
          <img src={src} alt="Proyecto" />
          <Link to="/editarpryct"> {showEditButton && <button className="edit-button">             &lt;&gt;
            </button>}</Link>
        </div> 
        </Link>
      ))}
    </div>
  );
}

export default Grid;