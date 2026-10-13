import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InvestigatorView from './components/InvestigatorView';
import CaseArchives from './components/CaseArchives';
import WikiDetail from './components/WikiDetail';
import LoginBoard from './components/LoginBoard'; // Import the new board

function App() {
  const [isAuthorized, setIsAuthorized] = useState(localStorage.getItem('vault_unlocked') === 'true');

  const handleUnlock = () => {
    localStorage.setItem('vault_unlocked', 'true');
    setIsAuthorized(true);
  };

  // New function to clear memory and return to login
  const handleLock = () => {
    localStorage.removeItem('vault_unlocked');
    setIsAuthorized(false);
  };

  if (!isAuthorized) {
    return <LoginBoard onUnlock={handleUnlock} />;
  }

  return (
    <Router>
      <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'sans-serif' }}>
        
        <header style={{ backgroundColor: '#0a0a0a', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #450a0a', boxShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ backgroundColor: '#8b0000', color: 'white', padding: '4px 8px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px' }}>CLASSIFIED</span>
            {/* Removed "AI" from the title */}
            <h1 style={{ margin: 0, fontSize: '24px', color: '#fff', letterSpacing: '-0.5px' }}>
              ColdCase <span style={{ color: '#ff1a1a' }}>Vault</span>
            </h1>
          </div>
          
          <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#ff1a1a'} onMouseOut={e => e.currentTarget.style.color = '#888'}>
              Investigation Board
            </Link>
            <Link to="/archives" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#ff1a1a'} onMouseOut={e => e.currentTarget.style.color = '#888'}>
              Case Archives
            </Link>
            {/* New Logout / Lock Vault Button */}
            <button 
              onClick={handleLock} 
              style={{ background: 'none', border: '1px solid #450a0a', padding: '6px 12px', color: '#ff1a1a', cursor: 'pointer', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = '#450a0a'; e.currentTarget.style.color = '#fff'; }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ff1a1a'; }}
            >
              Lock Vault
            </button>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<InvestigatorView />} />
            <Route path="/archives" element={<CaseArchives />} />
            <Route path="/wiki/:id" element={<WikiDetail />} />
          </Routes>
        </main>
        
      </div>
    </Router>
  );
}

export default App;