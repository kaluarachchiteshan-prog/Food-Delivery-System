import React from 'react';
import Auth from './components/Auth';

function App() {
  return (
    <div>
      <header style={{ textAlign: 'center', padding: '20px', background: '#ff4757', color: 'white', fontFamily: 'Arial' }}>
        <h1>Food Delivery System</h1>
      </header>
      <Auth />
    </div>
  );
}

export default App;