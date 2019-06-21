import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Navigator from './components/Navigator';

// import Search from './components/Search';
import HomePage from './components/pages/HomePage';

function App() {
  return (
    <div className="page">
      
      {/* Nav */}
      <Navigator />

      {/* HomePage */}
      <HomePage />

      {/* About Page */}
      
      {/* SearchPage */}
      
      {/* CollectionPage */}


    </div>
  );
}

export default App;
