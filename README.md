# 🕵️‍♂️ ColdCase Vault

**ColdCase Vault** is an investigative intelligence platform and true-crime case archive. Designed to store, cross-examine, and deduce relational links between complex cold case entities, this application utilizes a modern React client alongside a **GraphRAG** (Graph Retrieval-Augmented Generation) pipeline powered by Neo4j and high-throughput LLM inference.

---

## ✨ Features & Interface Walkthrough

*(Note: Replace the image paths below with the actual paths to your screenshots, e.g., `images/login.png`)*

### 1. Secure Investigator Gateway
The entry point to the application features a thematic "RESTRICTED ACCESS" login interface, setting the immersive tone of a classified police database while securing the platform's endpoints.

![Investigator Gateway Screenshot](path/to/your/login-screenshot.png)

### 2. Centralized Case Archives Dashboard
A high-level directory where investigators can browse the master list of unsolved crimes. It fetches real-time case lists, deduplicates files, and displays critical metadata (occurrence dates, statuses) for easy navigation.

![Case Archives Screenshot](path/to/your/archives-screenshot.png)

### 3. Entity-Relationship Dossiers
An encyclopedia-style subsystem that breaks down the granular elements of a crime. Click into specific entities to view detailed suspect profiles (aliases, alibis) and physical evidence logs directly linked to crime scenes.

![Entity Dossier Screenshot](path/to/your/wiki-detail-screenshot.png)

### 4. GraphRAG AI Interrogation Engine
The crown jewel of the platform. An interactive chat interface that allows users to actively "interrogate" the case files using natural language. It handles multi-hop reasoning (e.g., cross-referencing alibis with phone records) and grounds every response in strict factual data to prevent AI hallucinations.

![Interrogation Engine Screenshot](path/to/your/interrogation-screenshot.png)

---

## 🏗️ Architecture Stack

* **Frontend UI:** React 18 (Hosted on Vercel Edge Network)
* **Backend API:** Node.js / Express.js (Hosted on Render Web Services)
* **Database Engine:** Neo4j AuraDB (Enterprise Cloud Graph Database)
* **AI Inference Engine:** Groq Cloud API (`openai/gpt-oss-120b`)

## 🧠 How the GraphRAG Pipeline Works

Unlike standard Naive RAG (which relies on flat vector similarity and risks AI hallucinations), ColdCase Vault grounds its AI in explicit graph topology.

1. **Extraction:** When a user interrogates the system, the Node backend queries Neo4j via a secure (`neo4j+s://`) parameterized Cypher transaction.
2. **Multi-Hop Traversal:** Neo4j uses *Index-Free Adjacency* to instantly fetch connected entities (Suspects ➔ Alibis ➔ Phone Records).
3. **Deterministic Context Assembly:** This exact subgraph is converted into a structured payload.
4. **Grounded Inference:** The Groq API processes this strict factual context, returning deductions that are 100% traceable to the database edges.

## 🚀 Local Setup & Installation

### Prerequisites
* Node.js (v16+)
* A Neo4j AuraDB instance
* A Groq Cloud API Key

### Environment Variables
Create a `.env` file in your root backend directory:
```env
PORT=5000
NEO4J_URI=neo4j+s://<your-db-id>.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=<your-database-password>
GROQ_API_KEY=<your-groq-api-key>
```

### 1. Start the Backend Server
```bash
npm install
npm start
```

### 2. Start the Frontend Client
```bash
cd coldcase-client
npm install
npm start
```

## 🌍 Cloud Deployment Status

* **Frontend:** Deployed via Vercel Edge Network.
* **Backend:** Deployed via Render Web Services.

*Built as a comprehensive demonstration of Graph Database architecture and zero-hallucination AI inference.*