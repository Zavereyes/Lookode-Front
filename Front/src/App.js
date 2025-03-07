// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard.js';
//import Header from './header.js'; // si deseas usar el Header en todas las páginas
import Login from './pages/login.js'; 
import Perfil from './pages/perfil.js';
import Editarpryct from './pages/editarpryct.js';
import Crearpryct from './pages/crearpryct.js';
import Registro from './pages/registro.js';
import EditarPerfil from './pages/editarperfil.js';
import Addcontentpryct from './pages/addcontentpryct.js';
import Viewproyecto from './pages/viewproyecto.js';




function App() {
  return (
<>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/editarpryct" element={<Editarpryct />} />
        <Route path="/crearpryct" element={<Crearpryct />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/editarperfil" element={<EditarPerfil />} />
        <Route path="/addcontentpryct" element={<Addcontentpryct />} />
        <Route path="/viewproyecto" element={<Viewproyecto />} />
      </Routes>
</>
  );
}

export default App;
