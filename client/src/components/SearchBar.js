// SearchBar.js
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', query);
    // Implement search logic here
  };

  return (
    <Box display="flex" alignItems="center" mt={4}>
      <TextField 
        label="Search Stock" 
        variant="outlined" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        style={{ marginRight: 8 }} 
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>
    </Box>
  );
}

export default SearchBar;
