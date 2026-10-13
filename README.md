# 🕵️‍♂️ ColdCase Vault

**ColdCase Vault** is an investigative intelligence platform and true-crime case archive. Designed to store, cross-examine, and deduce relational links between complex cold case entities, this application utilizes a modern React client alongside a **GraphRAG** (Graph Retrieval-Augmented Generation) pipeline powered by Neo4j and high-throughput LLM inference.

---
## Initial Raw Neo-4j Aura DB implementation
<img width="485" height="317" alt="Screenshot 2026-10-13 153453" src="https://github.com/user-attachments/assets/e18fd339-5752-414e-bf08-8571011cb775" />
<img width="490" height="334" alt="Screenshot 2026-10-13 153517" src="https://github.com/user-attachments/assets/96457ec1-ef95-446e-a77d-be454d49d79e" />
<img width="406" height="188" alt="Screenshot 2026-10-13 153543" src="https://github.com/user-attachments/assets/64bee4a3-c761-4597-a7b6-da5246a780ee" />


## ✨ Features & Interface Walkthrough

*(Note: Replace the image paths below with the actual paths to your screenshots, e.g., `images/login.png`)*

### 1. Secure Investigator Gateway
The entry point to the application features a thematic "RESTRICTED ACCESS" login interface, setting the immersive tone of a classified police database while securing the platform's endpoints.

<img width="928" height="425" alt="Screenshot 2026-10-13 153729" src="https://github.com/user-attachments/assets/3cdf75f5-428f-43cb-9fa3-43289dd595f2" />


### 2. Centralized Case Archives Dashboard
A high-level directory where investigators can browse the master list of unsolved crimes. It fetches real-time case lists, deduplicates files, and displays critical metadata (occurrence dates, statuses) for easy navigation.

<img width="946" height="438" alt="Screenshot 2026-10-13 155059" src="https://github.com/user-attachments/assets/b3b8c8ea-e254-49ac-82a9-80e2439be882" />


### 3. Entity-Relationship Dossiers
An encyclopedia-style subsystem that breaks down the granular elements of a crime. Click into specific entities to view detailed suspect profiles (aliases, alibis) and physical evidence logs directly linked to crime scenes.

<img width="690" height="386" alt="Screenshot 2026-10-13 154049" src="https://github.com/user-attachments/assets/d80544f9-d877-46c9-8a8e-8efecefa9fb1" />


### 4. GraphRAG AI Interrogation Engine
The crown jewel of the platform. An interactive chat interface that allows users to actively "interrogate" the case files using natural language. It handles multi-hop reasoning (e.g., cross-referencing alibis with phone records) and grounds every response in strict factual data to prevent AI hallucinations.

<img width="229" height="359" alt="Screenshot 2026-10-13 155155" src="https://github.com/user-attachments/assets/204d483c-69a7-4f5d-8ab0-9cf0799f62f6" />
<img width="926" height="397" alt="Screenshot 2026-10-13 154706" src="https://github.com/user-attachments/assets/5e580445-14bc-4797-a89a-b333ebac97fe" />

Used embedded links for documentary trailers that redirects you to the official YouTube trailer release. 
<img width="893" height="417" alt="Screenshot 2026-10-13 154722" src="https://github.com/user-attachments/assets/7b26c0be-1f9d-4ba9-b216-233c9824bd6f" />
<img width="649" height="428" alt="Screenshot 2026-10-13 154829" src="https://github.com/user-attachments/assets/d621c52b-a25f-486f-858d-225129084df3" />



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
  <img width="748" height="417" alt="Screenshot 2026-10-13 153629" src="https://github.com/user-attachments/assets/f219200c-7043-42e2-ad9d-0ab479b4bf33" />

* **Backend:** Deployed via Render Web Services.
  <img width="947" height="476" alt="Screenshot 2026-10-13 153613" src="https://github.com/user-attachments/assets/9cb7ed05-596e-4cd2-a4c8-cfe70fde41cb" />


*Built as a comprehensive demonstration of Graph Database architecture and zero-hallucination AI inference.*
