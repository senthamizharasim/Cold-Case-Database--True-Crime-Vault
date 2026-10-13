# 🕵️‍♂️ ColdCase Vault

**ColdCase Vault** is an investigative intelligence platform and true-crime case archive. Designed to store, cross-examine, and deduce relational links between complex cold case entities, this application utilizes a modern React client alongside a **GraphRAG** (Graph Retrieval-Augmented Generation) pipeline powered by Neo4j and high-throughput LLM inference.

---

## 🏗️ Architecture Stack

* **Frontend UI:** React 18 (Hosted on Vercel Edge Network)
* **Backend API:** Node.js / Express.js (Hosted on Render Web Services)
* **Database Engine:** Neo4j AuraDB (Enterprise Cloud Graph Database)
* **AI Inference Engine:** Groq Cloud API (`openai/gpt-oss-120b`)

## ✨ Key Features

* **Secure Investigator Gateway:** A thematic authentication portal restricting access to the core database.
* **Centralized Case Archives:** A dynamic dashboard fetching real-time, deduplicated unsolved crime files.
* **Entity-Relationship Dossiers:** Clickable, deep-dive profiles on suspects, physical evidence, timelines, and locations.
* **GraphRAG Interrogation Engine:** An interactive AI interface that allows users to ask complex, multi-hop questions (e.g., *"Which suspects have alibis that conflict with the phone records found at the secondary crime scene?"*). 

## 🧠 How the GraphRAG Pipeline Works

Unlike standard Naive RAG (which relies on flat vector similarity and risks AI hallucinations), ColdCase Vault grounds its AI in explicit graph topology. 

1. **Extraction:** When a user interrogates the system, the Node backend queries Neo4j via a secure (`neo4j+s://`) parameterized Cypher transaction.
2. **Multi-Hop Traversal:** Neo4j uses *Index-Free Adjacency* to instantly fetch connected entities (Suspects ➔ Alibis ➔ Phone Records).
3. **Deterministic Context Assembly:** This exact subgraph is converted into a structured payload.
4. **Grounded Inference:** The Groq API processes this strict factual context, returning deductions that are 100% traceable to the database edges, preventing AI hallucinations.

## 🚀 Local Setup & Installation

### Prerequisites
* Node.js (v16+)
* A Neo4j AuraDB instance
* A Groq Cloud API Key

### Environment Variables
Create a `.env` file in your root backend directory with the following:
```env
PORT=5000
NEO4J_URI=neo4j+s://<your-db-id>.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=<your-database-password>
GROQ_API_KEY=<your-groq-api-key>
```

### 1. Start the Backend Server
```bash
# Install dependencies
npm install

# Start the Express server
npm start
```

### 2. Start the Frontend Client
```bash
cd coldcase-client

# Install frontend dependencies
npm install

# Start the React app
npm start
```

## 🌍 Cloud Deployment
* **Frontend:** Deployed via Vercel with a Custom Build Command Override (`CI=false npm run build`) to ensure continuous integration without strict linter blocking.
* **Backend:** Deployed via Render as a Web Service.

---
*Built as a comprehensive demonstration of Graph Database architecture and zero-hallucination AI inference.*