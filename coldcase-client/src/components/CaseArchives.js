import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CaseArchives = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch('https://cold-case-vault-a-true-crime-database.onrender.com/api/archives');
        const data = await response.json();
        
        // Deduplicate cases based on case_id
        const uniqueCases = data.filter((c, index, self) => 
          index === self.findIndex((t) => t.case_id === c.case_id)
        );

        setCases(uniqueCases);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch archives:", error);
        setLoading(false);
      }
    };
    fetchArchives();
  }, []);

  if (loading) return <div style={{ color: '#a0aec0', padding: '50px', textAlign: 'center' }}>Loading Archives...</div>;

  return (
    <div style={{ padding: '40px', backgroundColor: '#12151a', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '10px', letterSpacing: '-0.5px' }}>ColdCase Archives</h1>
      <p style={{ color: '#a0aec0', marginBottom: '40px' }}>Master directory of all indexed investigations.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
        {cases.map((c, idx) => {
          // Format the Neo4j Date object
          let formattedDate = 'Unknown Date';
          if (c.date_opened && c.date_opened.year) {
            const y = c.date_opened.year.low ?? c.date_opened.year;
            const m = c.date_opened.month.low ?? c.date_opened.month;
            const d = c.date_opened.day.low ?? c.date_opened.day;
            formattedDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          }

          return (
            <div 
              key={idx}
              onClick={() => navigate(`/wiki/${c.case_id}`)}
              style={{ 
                backgroundColor: '#1a202c', 
                border: '1px solid #2d3748', 
                borderRadius: '10px', 
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.4)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {c.cover_image ? (
                <div style={{ width: '100%', height: '200px', backgroundColor: '#000', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={c.cover_image} 
                    alt={c.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} 
                  />
                </div>
              ) : (
                <div style={{ width: '100%', height: '200px', backgroundColor: '#2d3748', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0' }}>NO IMAGE</div>
              )}
              
              <div style={{ padding: '20px' }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#e2e8f0' }}>{c.title}</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ color: '#a0aec0', fontSize: '14px' }}>{formattedDate}</span>
                  <span style={{ 
                    backgroundColor: c.status === 'Closed' ? '#27ae60' : '#c0392b', 
                    padding: '4px 10px', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    fontWeight: 'bold',
                    textTransform: 'uppercase' 
                  }}>
                    {c.status}
                  </span>
                </div>
                <button 
                  style={{ width: '100%', padding: '10px', backgroundColor: '#2d3748', color: 'white', border: '1px solid #4a5568', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Explore Dossier →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaseArchives;