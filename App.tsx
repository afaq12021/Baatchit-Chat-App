import React from 'react';
import AppNavigation from './src/navigations/AppNavigation';
import AppProviders from './src/providers/AppProviders';

const App = () => {
  return (
    <AppProviders>
      <AppNavigation />
    </AppProviders>
  );
};

export default App;
