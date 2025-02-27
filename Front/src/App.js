// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard.js';
//import Header from './header.js'; // si deseas usar el Header en todas las páginas
import Login from './pages/login.js'; 
import Perfil from './pages/perfil.js';

function App() {
  return (
<>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />

        
      </Routes>
</>
  );
}

export default App;
