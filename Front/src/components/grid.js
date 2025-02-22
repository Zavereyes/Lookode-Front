import React from 'react';
import './grid.css';

const images = [
  "/1.jfif",
  "/2.jfif",
  "/3.jfif",
  "/4.jfif",
  "/5.jfif",
  "/8.jfif",
  "/9.jfif",
  "/10.jfif",
  "/11.jfif",
  "/12.jfif",
  "/13.jfif",
  "/6.jfif",
  "/7.jfif",

];

function Grid() {
  return (
    <div className="grid-container">
      {images.map((src, index) => (
        <div key={index} className="grid-item">
          <img src={src} alt="Random" />
        </div>
      ))}
    </div>
  );
}

export default Grid;
