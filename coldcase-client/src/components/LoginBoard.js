import React, { useState, useEffect } from 'react';

const LoginBoard = ({ onUnlock }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  // Expanded gallery combining authentic historical composites, mugshots, and dark evidence scenes
  // Local high-speed cinematic images
  const slideshowImages = [
    '/images/s1.jpg', 
    '/images/s2.jpg', 
    '/images/s3.jpg', 
    '/images/s4.jpg', 
    '/images/s5.jpg', 
    '/images/s6.jpg'
  ];

  // Rotate images every 3 seconds for a rapid, unsettling montage
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slideshowImages.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim().length > 1 && password.trim().length > 2) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#050505', color: '#fff', fontFamily: '"Courier New", Courier, monospace' }}>
      
      {/* 1. Left Side: Active Sliding Cinematic Case Board (60% Width) */}
      <div style={{ position: 'relative', width: '60%', height: '100%', borderRight: '2px solid #330000', overflow: 'hidden', backgroundColor: '#020202' }}>
        
        {/* Pre-rendered Image Tags (Fixes the blanking/loading issue) */}
        {slideshowImages.map((imgUrl, index) => (
          <img 
            key={index}
            src={imgUrl}
            alt="Archival Evidence"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 20%',
              opacity: index === bgIndex ? 0.5 : 0,
              transform: index === bgIndex ? 'scale(1.05)' : 'scale(1.0)',
              transition: 'opacity 1.5s ease-in-out, transform 4s ease-out',
              pointerEvents: 'none'
            }}
          />
        ))}

        {/* Cinematic Crime Collage: Permanent Dark Vignette Overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(139,0,0,0.1) 0%, rgba(0,0,0,0.9) 100%)', zIndex: 1, pointerEvents: 'none' }} />
        
        {/* Foreground Eerie HUD Graphic Elements */}
        <div style={{ position: 'absolute', top: '30px', left: '30px', color: '#ff1a1a', letterSpacing: '2px', fontSize: '11px', textTransform: 'uppercase', opacity: 0.8, zIndex: 2 }}>
          [ SYSTEM_STATUS: SECURE_VAULT_FEED_ONLINE // IDLE_ ]
        </div>
        
        <div style={{ position: 'absolute', bottom: '30px', left: '30px', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 2 }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff1a1a', textShadow: '0 0 5px rgba(255, 26, 26, 0.4)' }}>CASE EXAMPLES INDEXED // CLASSIFIED</span>
          <span style={{ fontSize: '10px', color: '#888' }}> Dahmer (C-005) • Zodiac (C-001) • Golden State Killer (C-004) </span>
        </div>

      </div>

      {/* 2. Right Side: Heavy Crimson Access Portal Form (40% Width) */}
      <div style={{ width: '40%', height: '100%', backgroundColor: '#030303', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', boxSizing: 'border-box', borderLeft: '1px solid #1a0202', zIndex: 3 }}>
        
        <div style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }}>
          
          <div style={{ display: 'inline-block', backgroundColor: '#5c0000', color: 'white', padding: '3px 8px', fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '15px' }}>
            CLASSIFIED
          </div>
          
          <h1 style={{ fontSize: '26px', color: '#ff1a1a', fontWeight: 'bold', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '3px', textShadow: '0 0 8px rgba(255, 26, 26, 0.3)' }}>
            {isLoginMode ? 'RESTRICTED ACCESS' : 'AGENT REGISTRATION'}
          </h1>
          <p style={{ color: '#666', fontSize: '11px', margin: '0 0 45px 0', letterSpacing: '1px' }}>
            COLD CASE INVESTIGATION VAULT // ARCHIVAL SYSTEM
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '10px', color: '#ff1a1a', letterSpacing: '2px' }}>USERNAME</label>
              <input 
                type="text" 
                placeholder="ENTER USERNAME" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ padding: '15px', backgroundColor: '#070707', border: '1px solid #450a0a', color: '#ff1a1a', outline: 'none', letterSpacing: '2px', fontSize: '12px' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '10px', color: '#ff1a1a', letterSpacing: '2px' }}>PASSWORD</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '15px', backgroundColor: '#070707', border: '1px solid #450a0a', color: '#ff1a1a', outline: 'none', letterSpacing: '2px', fontSize: '12px' }}
              />
            </div>
            
            <button 
              type="submit" 
              style={{ padding: '16px', marginTop: '10px', backgroundColor: '#450a0a', color: '#fff', border: '1px solid #8b0000', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.6)' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#8b0000'; e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 26, 26, 0.45)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#450a0a'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.6)'; }}
            >
              {isLoginMode ? 'Breach Vault →' : 'Initialize Agent ID'}
            </button>
          </form>

          {error && (
            <p style={{ color: '#ff1a1a', marginTop: '20px', fontSize: '10px', animation: 'blink 0.5s step-end infinite', textTransform: 'uppercase', letterSpacing: '1px' }}>
              [ ERR: AUTHR_FAILED / VERIFY DATA ]
            </p>
          )}

          <div style={{ marginTop: '40px', borderTop: '1px solid #220000', paddingTop: '20px', textAlign: 'center' }}>
            <span 
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError(false);
                setUsername('');
                setPassword('');
              }}
              style={{ color: '#444', fontSize: '11px', cursor: 'pointer', letterSpacing: '1px', textDecoration: 'underline', transition: 'color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#ff1a1a'}
              onMouseOut={(e) => e.currentTarget.style.color = '#444'}
            >
              {isLoginMode ? 'Request access level?' : 'Already on archive roster? Login'}
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default LoginBoard;