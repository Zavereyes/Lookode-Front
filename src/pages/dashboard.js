// dashboard.js - modificación
import React from 'react';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
import Grid from '../components/grid.js';
import './dashboard.css';
import { useSearch } from '../context/SearchContext';

function Dashboard() {
  const { searchQuery, viewMode, handleClearSearch } = useSearch();
  
  return (
    <>
      <Header showSearch={true} />
      {viewMode === 'search' && searchQuery && (
        <>
          <div className="search-results-header">
            <h2>Resultados para: "{searchQuery}"</h2>
          
          </div>
          <div style={{ height: '0px' }}></div> {/* Espaciador */}
        </>
      )}

      <Grid viewMode={viewMode} showEditButton={false} searchQuery={searchQuery} />
      <Footer />
    </>
  );
}

export default Dashboard;