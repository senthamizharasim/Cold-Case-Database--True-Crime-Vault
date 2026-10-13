require('dotenv').config();
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const express = require('express');
const cors = require('cors');
app.use(cors()); // Allows incoming requests from your deployed frontend
const neo4j = require('neo4j-driver');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Initialize Neo4j Connection (Use your AuraDB credentials)
const driver = neo4j.driver(
  process.env.NEO4J_URI || 'neo4j+s://b3100196.databases.neo4j.io',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j', 
    process.env.NEO4J_PASSWORD || 'Y-inDjKsyNJN-YICoOmQtpW9eOSXX6gePe1K_HL-OC4'
  )
);

// 2. Route for the Main Investigation String-Board
app.get('/api/graph', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (n)
      OPTIONAL MATCH (n)-[r]->(m)
      RETURN n, r, m
    `);
    
    const nodes = [];
    const links = [];
    const nodeMap = new Set();

    // Map Neo4j's new elementId for frontend rendering
    result.records.forEach(record => {
      const n = record.get('n');
      const r = record.get('r');
      const m = record.get('m');

      if (n && !nodeMap.has(n.elementId)) {
        nodes.push({ id: n.elementId, label: n.labels[0], ...n.properties });
        nodeMap.add(n.elementId);
      }
      if (m && !nodeMap.has(m.elementId)) {
        nodes.push({ id: m.elementId, label: m.labels[0], ...m.properties });
        nodeMap.add(m.elementId);
      }
      if (r) {
        links.push({
          source: r.startNodeElementId,
          target: r.endNodeElementId,
          type: r.type,
          ...r.properties
        });
      }
    });

    res.json({ nodes, links });
  } catch (error) {
    console.error('Graph fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch graph network' });
  } finally {
    await session.close();
  }
});

// 3. Route for Dynamic Wiki Dossiers
app.get('/api/wiki/:id', async (req, res) => {
  const { id } = req.params;
  const session = driver.session();
  try {
    // Safely checks custom schema IDs OR the modern elementId
    const result = await session.run(
      `MATCH (n) 
       WHERE n.case_id = $id 
          OR n.person_id = $id 
          OR n.evidence_id = $id 
          OR n.media_id = $id 
          OR n.lead_id = $id 
          OR elementId(n) = $id
          OR id(n) = toInteger($id)
       OPTIONAL MATCH (n)-[r]-(connected)
       RETURN labels(n)[0] AS label, properties(n) AS mainNode, 
              collect({relationship: type(r), node: properties(connected)}) AS connectedNodes`,
      { id }
    );

    if (result.records.length === 0) {
      return res.status(404).json({ error: 'Vault record not found' });
    }

    const record = result.records[0];
    res.json({
      label: record.get('label'),
      mainNode: record.get('mainNode'),
      // Remove empty connections if the node is isolated
      connectedNodes: record.get('connectedNodes').filter(c => c.node !== null) 
    });
  } catch (error) {
    console.error('Wiki fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve dossier' });
  } finally {
    await session.close();
  }
});

// 4. Route for the Case Archives Index
app.get('/api/archives', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (c:CrimeCase) 
       RETURN DISTINCT properties(c) AS caseNode 
       ORDER BY caseNode.date_opened DESC`
    );

    const cases = result.records.map(record => record.get('caseNode'));
    res.json(cases);
  } catch (error) {
    console.error('Archive fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve case archives' });
  } finally {
    await session.close();
  }
});

// 5. GraphRAG Lead Interrogation Route (Updated for Groq)
app.post('/api/interrogate', async (req, res) => {
  const { query } = req.body;
  const session = driver.session();

  try {
    // Phase 1: Groq AI generates the exact database query
    const cypherResponse = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are an expert Neo4j database architect. Convert the user's cold case inquiry into a valid, read-only Cypher query. Return ONLY the raw query without any markdown tags, backticks, or explanations." 
        },
        { 
          role: "user", 
          content: `Schema: Nodes: CrimeCase, Person, Evidence, Media, Lead | Properties: title, first_name, last_name, synopsis, status, description\n\nInquiry: ${query}` 
        }
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.1
    });

    let cypherQuery = cypherResponse.choices[0].message.content.trim();
    // Strip any accidental markdown blocks Groq might output
    cypherQuery = cypherQuery.replace(/```cypher|```/g, '').trim();

    console.log(`🧠 AI Generated Cypher: \n${cypherQuery}`);

    // Phase 2: Execute the query against Neo4j
    const result = await session.run(cypherQuery);
    const records = result.records.map(record => record.toObject());
    
    console.log(`🗄️ Database Found: ${records.length} records`);

    // Phase 3: Groq synthesizes the final dossier
    const synthesisResponse = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a seasoned, gritty cold case detective looking at a restricted database terminal. Synthesize the provided database records into a dark, classified intelligence dossier answering the user's inquiry. Use serial-killer documentary aesthetics and keep the tone clinical but chilling." 
        },
        { 
          role: "user", 
          content: `Inquiry: ${query}\n\nDatabase Evidence: ${JSON.stringify(records, null, 2)}` 
        }
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.6
    });

    const finalDossier = synthesisResponse.choices[0].message.content;
    
    res.json({ 
      answer: finalDossier,
      cypherUsed: cypherQuery 
    });

  } catch (error) {
    console.error('🔥 Interrogation Pipeline Error:', error);
    res.status(500).json({ error: "Vault AI offline." });
  } finally {
    await session.close();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ColdCase Vault Backend online on port ${PORT}`);
});