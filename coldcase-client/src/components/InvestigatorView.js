import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ForceGraph2D from 'react-force-graph-2d';
import './InvestigatorView.css';

const InvestigatorView = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [dimensions, setDimensions] = useState({ width: window.innerWidth - 300, height: window.innerHeight - 100 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoverNode, setHoverNode] = useState(null);
  const [query, setQuery] = useState('');
  const [interrogationQuery, setInterrogationQuery] = useState('');
  const [vaultResponse, setVaultResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const graphRef = useRef();

  // Handle window resizing to keep the graph filling the container
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth - 300, // Account for the 300px left sidebar
        height: window.innerHeight - 100 // Account for the top navbar
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch graph data from your Node backend
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch('https://cold-case-vault-a-true-crime-database.onrender.com/api/graph'); 
        const data = await response.json();
        setGraphData(data);
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    };
    fetchGraphData();
  }, []);

  const handleInterrogation = async (e) => {
    e.preventDefault();
    const activeQuery = interrogationQuery || query;
    if (!activeQuery) return;
    
    setIsThinking(true);
    setVaultResponse('');
    
    try {
      const res = await fetch('https://cold-case-vault-a-true-crime-database.onrender.com/api/interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: activeQuery })
      });
      const data = await res.json();
      setVaultResponse(data.answer || data.error);
    } catch (err) {
      setVaultResponse("Connection to AI Core severed.");
    }
    setIsThinking(false);
  };

  return (
    <div className="investigator-view" style={{ display: 'flex', height: 'calc(100vh - 80px)', backgroundColor: '#12151a' }}>
      
      {/* LEFT SIDEBAR: Lead Interrogation */}
      <div className="sidebar" style={{ width: '300px', padding: '20px', borderRight: '1px solid #2d3748', backgroundColor: '#1a202c', overflowY: 'auto' }}>
        <div style={{ padding: '20px', backgroundColor: '#1a202c', borderRadius: '8px', border: '1px solid #2d3748' }}>
          <h2 style={{ color: 'white', marginTop: 0 }}>Lead Interrogation</h2>
          <p style={{ color: '#a0aec0', fontSize: '14px', marginBottom: '20px' }}>Query evidence networks using GraphRAG.</p>
          
          <textarea 
            value={interrogationQuery || query}
            onChange={(e) => {
              setInterrogationQuery(e.target.value);
              setQuery(e.target.value);
            }}
            placeholder="e.g., who was the milwaukee cannibal"
            style={{ width: '100%', height: '80px', backgroundColor: '#12151a', color: '#e2e8f0', border: '1px solid #4a5568', borderRadius: '4px', padding: '10px', marginBottom: '15px', resize: 'none' }}
          />
          
          <button 
            onClick={handleInterrogation}
            disabled={isThinking}
            style={{ width: '100%', padding: '10px', backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isThinking ? 'Accessing Vault...' : 'Interrogate Vault'}
          </button>

          {vaultResponse && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#2d3748', borderRadius: '6px', color: '#e2e8f0', fontSize: '14px', borderLeft: '4px solid #c0392b', overflowX: 'auto' }}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Styles the main table wrapper
                  table: ({node, ...props}) => <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0', border: '1px solid #450a0a', boxShadow: '0 0 15px rgba(139, 0, 0, 0.1)' }} {...props} />,
                  // Styles the table headers (Field / Data)
                  th: ({node, ...props}) => <th style={{ backgroundColor: '#2a0000', color: '#ff1a1a', padding: '12px', border: '1px solid #450a0a', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px' }} {...props} />,
                  // Styles the table rows
                  td: ({node, ...props}) => <td style={{ padding: '12px', border: '1px solid #220000', color: '#d1d5db', backgroundColor: '#050505', fontSize: '13px', lineHeight: '1.6' }} {...props} />,
                  // Styles the ### headers
                  h3: ({node, ...props}) => <h3 style={{ color: '#ff1a1a', borderBottom: '1px solid #450a0a', paddingBottom: '8px', marginTop: '30px', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '16px' }} {...props} />,
                  // Styles the > blockquotes
                  blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: '4px solid #8b0000', margin: '20px 0', padding: '15px 20px', color: '#888', fontStyle: 'italic', backgroundColor: '#0a0a0a' }} {...props} />,
                  // Styles the **bold** text to pop in crimson
                  strong: ({node, ...props}) => <strong style={{ color: '#ff4d4d', fontWeight: 'bold' }} {...props} />
                }}
              >
                {vaultResponse}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT: Investigation String-Board */}
      <div className="graph-container" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        
        <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, border: '1px solid #4a5568', padding: '4px 12px', borderRadius: '4px', color: '#a0aec0', fontSize: '12px', letterSpacing: '1px' }}>
          EVIDENCE STRING-BOARD
        </div>

        <ForceGraph2D
          ref={graphRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeLabel="name"
          backgroundColor="#12151a"
          
          // Interactions & Relationship Highlighting
          onNodeClick={(node) => setSelectedNode(node)}
          onNodeHover={(node) => setHoverNode(node)}
          onBackgroundClick={() => setSelectedNode(null)}
          linkColor={(link) => (hoverNode && (link.source === hoverNode || link.target === hoverNode)) ? '#e74c3c' : '#4a5568'}
          linkWidth={(link) => (hoverNode && (link.source === hoverNode || link.target === hoverNode)) ? 2 : 1}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          
          // Custom HTML5 Canvas Node Rendering
          nodeCanvasObject={(node, ctx, globalScale) => {
            const size = 16;
            
            // 1. Draw the background circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.label === 'CrimeCase' ? '#c0392b' : 
                            node.label === 'Person' ? '#2980b9' : 
                            node.label === 'Evidence' ? '#f39c12' : '#8e44ad';
            ctx.fill();

            // 2. Draw the image if it exists
            if (node.img || node.image_url || node.cover_image) {
              const imgUrl = node.img || node.image_url || node.cover_image;
              const img = new Image();
              img.src = imgUrl;
              
              ctx.save();
              ctx.beginPath();
              ctx.arc(node.x, node.y, size / 2 - 1, 0, Math.PI * 2, true);
              ctx.closePath();
              ctx.clip();
              
              try {
                ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size);
              } catch (e) {
                // Silently fallback if image is still loading
              }
              ctx.restore();
            }

            // 3. Draw the text label (Only when zoomed in to prevent clutter)
            if (globalScale >= 1.5) {
              const label = node.title || node.name || node.description || 
                            (node.first_name ? `${node.first_name} ${node.last_name}` : 'Unknown');
              const fontSize = 14 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'top';
              ctx.fillStyle = '#d1d5db';
              ctx.fillText(label, node.x, node.y + size / 2 + 4);
            }
          }}
        />

        {/* FLOATING OVERLAY: Detailed Dossier Card */}
        {selectedNode && (
          <div style={{
            position: 'absolute', top: '20px', right: '20px', width: '260px',
            backgroundColor: '#1a202c', border: '1px solid #2d3748', 
            padding: '15px', borderRadius: '8px', color: 'white', zIndex: 10,
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}>
            <button 
              onClick={() => setSelectedNode(null)} 
              style={{ float: 'right', background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', fontSize: '16px' }}
            >
              ✖
            </button>
            
            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>
              {selectedNode.title || selectedNode.name || selectedNode.description || 
               (selectedNode.first_name ? `${selectedNode.first_name} ${selectedNode.last_name}` : 'Unknown Entity')}
            </h3>
            <span style={{ display: 'inline-block', backgroundColor: '#4a5568', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', marginBottom: '15px', textTransform: 'uppercase' }}>
              {selectedNode.label || 'Node'}
            </span>
            
            {(selectedNode.img || selectedNode.image_url || selectedNode.cover_image) && (
              <img 
                src={selectedNode.img || selectedNode.image_url || selectedNode.cover_image} 
                alt="Entity Profile" 
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px', marginBottom: '15px', border: '1px solid #2d3748' }} 
              />
            )}
            
            <button 
              onClick={() => {
                const vaultId = selectedNode.case_id || 
                                selectedNode.person_id || 
                                selectedNode.evidence_id || 
                                selectedNode.media_id || 
                                selectedNode.lead_id || 
                                selectedNode.id;
                window.location.href = `/wiki/${vaultId}`;
              }}
              style={{ width: '100%', padding: '10px', backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Access Vault File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestigatorView;