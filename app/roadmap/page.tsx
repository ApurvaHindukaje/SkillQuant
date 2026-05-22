"use client";

import { Route, Search, ZoomIn, ZoomOut, Download } from 'lucide-react';
import Mermaid from '@/modules/core/components/Mermaid';

export default function RoadmapPage() {
  
  // The full learning roadmap for the SkillQuant ecosystem
  const roadmapGraph = `
graph TD
    %% Main Categories Styling
    classDef foundation fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff
    classDef backend fill:#1e293b,stroke:#8b5cf6,stroke-width:2px,color:#fff
    classDef frontend fill:#1e293b,stroke:#ec4899,stroke-width:2px,color:#fff
    classDef aiml fill:#1e293b,stroke:#10b981,stroke-width:2px,color:#fff
    classDef devops fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fff
    classDef db fill:#1e293b,stroke:#06b6d4,stroke-width:2px,color:#fff
    
    %% Foundations
    subgraph Foundation ["Core Fundamentals"]
        Git["Git & Version Control"]:::foundation
        Linux["Linux Basics & CLI"]:::foundation
        DS["Data Structures & Algorithms"]:::foundation
    end
    
    Git --> Linux
    Linux --> DS
    
    %% Frontend Path
    subgraph Frontend ["Frontend Engineering"]
        HTML["HTML / CSS / JS"]:::frontend
        React["React"]:::frontend
        TS["TypeScript"]:::frontend
        Tailwind["TailwindCSS"]:::frontend
        NextJS["Next.js"]:::frontend
        ThreeJS["Three.js / WebGL"]:::frontend
    end
    
    DS --> HTML
    HTML --> React
    HTML --> Tailwind
    React --> TS
    TS --> NextJS
    React --> ThreeJS
    
    %% Backend Path
    subgraph Backend ["Backend Engineering"]
        Python["Python"]:::backend
        Node["Node.js / Express"]:::backend
        Java["Java / Spring"]:::backend
        Go["Go"]:::backend
        Rust["Rust"]:::backend
        FastAPI["FastAPI"]:::backend
        GraphQL["GraphQL / gRPC"]:::backend
    end
    
    DS --> Python
    DS --> Node
    DS --> Java
    Python --> FastAPI
    Node --> GraphQL
    Java --> Go
    Go --> Rust
    
    %% Database Path
    subgraph Databases ["Data & Scaling"]
        SQL["SQL (PostgreSQL / MySQL)"]:::db
        NoSQL["NoSQL (MongoDB / Redis)"]:::db
        Cache["Caching Strategies"]:::db
        Kafka["Kafka / Event Streaming"]:::db
    end
    
    Backend --> SQL
    SQL --> NoSQL
    NoSQL --> Cache
    Cache --> Kafka
    
    %% DevOps Path
    subgraph DevOps ["Infrastructure & DevOps"]
        Docker["Docker"]:::devops
        CICD["CI/CD (GitHub Actions)"]:::devops
        K8s["Kubernetes"]:::devops
        AWS["AWS / Cloud Provider"]:::devops
        Terraform["Terraform"]:::devops
    end
    
    Linux --> Docker
    Docker --> CICD
    CICD --> AWS
    AWS --> K8s
    AWS --> Terraform
    
    %% AI / ML Path
    subgraph AIML ["Artificial Intelligence & ML"]
        Pandas["Pandas / NumPy"]:::aiml
        Scikit["Scikit-learn"]:::aiml
        PyTorch["PyTorch / TensorFlow"]:::aiml
        LLMs["GenAI / LLMs"]:::aiml
        MLOps["MLOps"]:::aiml
    end
    
    Python --> Pandas
    Pandas --> Scikit
    Scikit --> PyTorch
    PyTorch --> LLMs
    LLMs --> MLOps
    K8s --> MLOps
    
    %% Connections across paths
    NextJS --> Backend
    FastAPI --> SQL
    Kafka --> DevOps
  `;

  return (
    <div className="space-y-8">
      <header className="pb-4 border-b border-[#30363d] flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Route className="mr-2 text-indigo-500" /> Technology Learning Roadmap
          </h1>
          <p className="text-gray-400 text-sm mt-1">A comprehensive visual guide from foundational skills to advanced specializations.</p>
        </div>
      </header>

      {/* Visual Roadmap Graph */}
      <div className="glass-panel p-2 md:p-8 rounded-3xl min-h-[600px] flex flex-col items-center">
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center text-sm font-medium">
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span><span className="text-gray-300">Foundation</span></div>
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-pink-500"></span><span className="text-gray-300">Frontend</span></div>
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-purple-500"></span><span className="text-gray-300">Backend</span></div>
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-cyan-500"></span><span className="text-gray-300">Database</span></div>
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span><span className="text-gray-300">DevOps</span></div>
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-gray-300">AI / ML</span></div>
        </div>

        {/* Mermaid Render */}
        <div className="w-full overflow-x-auto overflow-y-hidden pb-4">
          <div className="min-w-[800px]">
             <Mermaid chart={roadmapGraph} />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold mb-3">About this roadmap</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          This graph represents the optimal path for acquiring highly valued skills based on our market intelligence. 
          Start with the foundations (Git, Linux, Data Structures) before branching into a specialization. 
          Notice how Python serves as a gateway to both Backend Engineering and AI/ML paths, making it one of the highest ROI starting points.
        </p>
      </div>
    </div>
  );
}
