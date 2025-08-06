import React from 'react';
import AppProviders from './src/providers/AppProviders';
import AppInitializer from './src/components/AppInitializer';

const App = () => {
  return (
    <AppProviders>
      <AppInitializer />
    </AppProviders>
  );
};

export default App;
