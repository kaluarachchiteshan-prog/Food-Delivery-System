

import { useState } from 'react';
import Auth from './components/Auth';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  // Function to handle logout
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
          <div>
            <h2>Welcome back, {user?.name || 'Food Lover'}! 🎉</h2>
            <p>You are now logged into the Food Delivery System dashboard.</p>
            {/* You can add your restaurant list, food items, or shopping cart components here later! */}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;