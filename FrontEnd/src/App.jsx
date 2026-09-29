

import { useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#2e8b57', color: 'white', fontFamily: 'Arial' }}>
        <h1>Food Delivery System</h1>
        {token && (
          <button 
            onClick={handleLogout} 
            style={{ background: 'white', color: '#2e8b57', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Logout
          </button>
        )}
      </header>

      <main style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
        {!token ? (
          <Auth onLoginSuccess={(newToken, newUser) => {
            setToken(newToken);
            setUser(newUser);
          }} />
        ) : (
          <Dashboard user={user} />
        )}
      </main>
    </div>
  );
}

export default App;