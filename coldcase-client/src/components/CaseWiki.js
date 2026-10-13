import React, { useEffect, useState } from 'react';
import './CaseWiki.css';

function CaseWiki() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://cold-case-vault-a-true-crime-database.onrender.com/api/cases')
      .then(res => res.json())
      .then(data => {
        setCases(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load wiki records:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="status-screen">Accessing case archives...</div>;
  }

  return (
    <div className="wiki-wrapper">
      <div className="wiki-header">
        <h2>Case Records & Dossiers</h2>
        <p>Classified incident files, physical evidence, and suspect profiles.</p>
      </div>

      <div className="wiki-grid">
        {cases.map(item => (
          <article 
            key={item.id} 
            className="case-card"
            onClick={() => setSelectedCase(item)}
          >
            <div className="card-thumb">
              <img src={item.image} alt={item.title} />
              <span className={`status-tag ${item.status.toLowerCase()}`}>
                {item.status}
              </span>
            </div>
            <div className="card-body">
              <span className="case-id">{item.id}</span>
              <h3>{item.title}</h3>
              <p className="snippet">{item.story.substring(0, 110)}...</p>
            </div>
          </article>
        ))}
      </div>

      {selectedCase && (
        <div className="modal-backdrop" onClick={() => setSelectedCase(null)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedCase(null)}>×</button>
            <div className="modal-content">
              <img src={selectedCase.image} alt={selectedCase.title} className="modal-img" />
              <div className="modal-details">
                <span className="modal-id">{selectedCase.id}</span>
                <h2>{selectedCase.title}</h2>
                <div className={`status-tag ${selectedCase.status.toLowerCase()}`}>
                  {selectedCase.status}
                </div>
                <h4>Overview & Chain of Events</h4>
                <p>{selectedCase.story}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseWiki;