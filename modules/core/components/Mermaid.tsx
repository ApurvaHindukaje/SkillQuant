"use client";

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Loader2 } from 'lucide-react';

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        background: 'transparent',
        primaryColor: '#1e293b',
        primaryTextColor: '#e6edf3',
        primaryBorderColor: '#30363d',
        lineColor: '#6366f1',
        secondaryColor: '#0d1117',
        tertiaryColor: '#161b22',
        fontFamily: 'Inter, sans-serif'
      },
      securityLevel: 'loose',
    });

    const renderChart = async () => {
      if (!containerRef.current) return;
      setLoading(true);
      setError(null);
      
      try {
        // Create a unique ID for the mermaid render
        const id = `mermaid-chart-${Math.random().toString(36).substring(7)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvgContent(svg);
      } catch (err: any) {
        console.error("Mermaid rendering failed", err);
        setError("Failed to render diagram. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div className="flex justify-center items-center w-full min-h-[300px] bg-[#0d1117] rounded-xl p-4 overflow-auto relative border border-[#30363d]/50">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0d1117]/80 z-10">
          <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
        </div>
      )}
      
      {error && (
        <div className="text-red-400 p-4 border border-red-500/50 rounded-lg bg-red-500/10 text-center">
          {error}
        </div>
      )}
      
      {!error && (
        <div 
          ref={containerRef} 
          className="w-full flex justify-center mermaid-container"
          dangerouslySetInnerHTML={{ __html: svgContent }} 
        />
      )}
    </div>
  );
}
