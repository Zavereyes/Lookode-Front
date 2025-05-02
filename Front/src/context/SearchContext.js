import React, { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('all');

  const handleSearch = (query) => {
    setSearchQuery(query);
    setViewMode('search');
  };

  const handleClearSearch = () => {
    setViewMode('all');
    setSearchQuery('');
  };

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      viewMode, 
      handleSearch, 
      handleClearSearch 
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);

export default SearchContext;