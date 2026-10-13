import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WikiDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNodeDetails = async () => {
      try {
        const response = await fetch(`https://cold-case-vault-a-true-crime-database.onrender.com/api/wiki/${id}`);
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dossier:", error);
        setLoading(false);
      }
    };
    fetchNodeDetails();
  }, [id]);

  if (loading) return <div style={{ color: '#a0aec0', padding: '50px', textAlign: 'center' }}>Accessing Vault Records...</div>;
  if (!data || !data.mainNode) return <div style={{ color: '#e74c3c', padding: '50px', textAlign: 'center' }}>File not found in the archive.</div>;

  const node = data.mainNode;
  const image = node.cover_image || node.image_url || node.img;
  const title = node.title || node.name || node.description || 
                (node.first_name ? `${node.first_name} ${node.last_name}` : 'Unknown Entity');

  // Group connected nodes by relationship type AND filter out duplicates
  const groupedConnections = data.connectedNodes.reduce((acc, curr) => {
    const rel = curr.relationship;
    if (!acc[rel]) acc[rel] = [];
    
    // 1. Identify the unique ID for the node we are currently looking at
    const currId = curr.node.case_id || curr.node.person_id || curr.node.evidence_id || 
                   curr.node.media_id || curr.node.lead_id;
    
    // 2. Check if a node with this exact ID is already in our array for this relationship
    const isDuplicate = acc[rel].some(existingNode => {
      const existingId = existingNode.case_id || existingNode.person_id || 
                         existingNode.evidence_id || existingNode.media_id || existingNode.lead_id;
      return existingId === currId;
    });

    // 3. Only push it to the screen if it's not a duplicate
    if (!isDuplicate) {
      acc[rel].push(curr.node);
    }
    
    return acc;
  }, {});

  return (
    <div style={{ padding: '40px', backgroundColor: '#12151a', minHeight: '100vh', color: 'white' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', marginBottom: '25px', fontSize: '16px', fontWeight: 'bold' }}>
        ← Return to String-Board
      </button>
      
      {/* Primary Entity Header */}
      <div style={{ display: 'flex', gap: '40px', backgroundColor: '#1a202c', padding: '40px', borderRadius: '12px', border: '1px solid #2d3748', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        {image && (
          <img src={image} alt={title} style={{ width: '280px', height: '380px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #4a5568' }} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '42px', letterSpacing: '-0.5px' }}>{title}</h1>
            <span style={{ backgroundColor: '#c0392b', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {data.label}
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {Object.entries(node).map(([key, value]) => {
              if (['cover_image', 'image_url', 'img', 'title', 'name', 'first_name', 'last_name', 'description', 'trailer_url', 'synopsis'].includes(key)) return null;
              
              let displayValue = value;
              if (typeof value === 'object' && value !== null) {
                if (value.year !== undefined && value.month !== undefined && value.day !== undefined) {
                  const y = value.year.low ?? value.year;
                  const m = value.month.low ?? value.month;
                  const d = value.day.low ?? value.day;
                  displayValue = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                } else if (value.low !== undefined && value.high !== undefined) {
                  displayValue = value.low;
                } else {
                  displayValue = JSON.stringify(value);
                }
              }

              return (
                <div key={key} style={{ backgroundColor: '#2d3748', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #718096' }}>
                  <strong style={{ color: '#a0aec0', textTransform: 'uppercase', display: 'block', fontSize: '11px', letterSpacing: '1px', marginBottom: '5px' }}>{key.replace('_', ' ')}</strong>
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>{displayValue}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Immersive Narrative Synopsis if available */}
      {node.synopsis && (
        <div style={{ marginTop: '30px', backgroundColor: '#1a202c', padding: '30px', borderRadius: '10px', border: '1px solid #2d3748', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <h2 style={{ color: '#e74c3c', fontSize: '20px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #2d3748', paddingBottom: '10px' }}>
            Dossier Synopsis
          </h2>
          <p style={{ color: '#e2e8f0', fontSize: '16px', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
            {node.synopsis}
          </p>
        </div>
      )}

      {/* Smart Video Thumbnail Player (Bypasses Embed Restrictions) */}
      {node.trailer_url && (
        <div style={{ marginTop: '30px', backgroundColor: '#1a202c', padding: '30px', borderRadius: '10px', border: '1px solid #2d3748', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <h2 style={{ color: '#e74c3c', fontSize: '20px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #2d3748', paddingBottom: '10px' }}>
            Archival Footage / Official Trailer
          </h2>
          
          {(() => {
             // Extract the unique 11-character YouTube Video ID from any URL format
             const ytMatch = node.trailer_url.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/);
             const videoId = ytMatch && ytMatch[1].length === 11 ? ytMatch[1] : null;
             
             if (videoId) {
               return (
                 <a 
                   href={`https://www.youtube.com/watch?v=${videoId}`}
                   target="_blank" 
                   rel="noopener noreferrer"
                   style={{ display: 'block', position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '2px solid #4a5568', cursor: 'pointer', backgroundColor: '#000' }}
                 >
                   {/* Fetch high-res thumbnail directly from YouTube */}
                   <img 
                     src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                     alt="Trailer Thumbnail" 
                     style={{ width: '100%', height: 'auto', display: 'block', opacity: '0.6', transition: 'opacity 0.2s' }} 
                     onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                     onMouseOut={e => e.currentTarget.style.opacity = '0.6'}
                   />
                   {/* Overlay Custom Play Button */}
                   <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#e50914', color: 'white', padding: '15px 30px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
                     <span>▶</span> PLAY TRAILER
                   </div>
                 </a>
               );
             }
             return null;
          })()}
        </div>
      )}

      {/* Grouped Intelligence Categories */}
      <h2 style={{ marginTop: '60px', borderBottom: '2px solid #2d3748', paddingBottom: '15px', fontSize: '24px', color: '#e2e8f0' }}>Cross-Referenced Intelligence</h2>
      
      {Object.keys(groupedConnections).length === 0 ? (
        <p style={{ color: '#a0aec0', fontStyle: 'italic' }}>No connections established in the database.</p>
      ) : (
        Object.entries(groupedConnections).map(([relationship, nodes]) => (
          <div key={relationship} style={{ marginTop: '40px' }}>
            <h3 style={{ color: '#e74c3c', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
              Relation: {relationship.replace('_', ' ')}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {nodes.map((n, idx) => {
                const connImg = n.cover_image || n.image_url || n.img;
                const connTitle = n.title || n.name || n.description || 
                                  (n.first_name ? `${n.first_name} ${n.last_name}` : 'Unknown Entity');
                const connId = n.case_id || n.person_id || n.evidence_id || n.media_id || n.lead_id;

                return (
                  <div 
                    key={idx} 
                    onClick={() => navigate(`/wiki/${connId}`)}
                    style={{ backgroundColor: '#1a202c', border: '1px solid #2d3748', borderRadius: '8px', padding: '15px', cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#4a5568'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#2d3748'; }}
                  >
                    {connImg ? (
                      <img src={connImg} alt={connTitle} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px' }} />
                    ) : (
                      <div style={{ width: '100%', height: '140px', backgroundColor: '#2d3748', borderRadius: '4px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0' }}>NO IMAGE</div>
                    )}
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#e2e8f0', textAlign: 'center' }}>{connTitle}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WikiDetail;