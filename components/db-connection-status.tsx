"use client";

import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Loader2 } from "lucide-react";

export function DatabaseConnectionStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState({ host: '', database: '' });

  useEffect(() => {
    // Test connection via API
    const checkConnection = async () => {
      try {
        setStatus('checking');
        setError(null);
        
        const response = await fetch('/api/db/status');
        const data = await response.json();
        
        if (response.ok && data.connected) {
          setStatus('connected');
          setConfig({
            host: data.config?.host || 'unknown',
            database: data.config?.database || 'unknown'
          });
        } else {
          throw new Error(data.error || 'Connection failed');
        }
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Failed to connect to database');
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Database:</span>
      
      {status === 'checking' && (
        <Badge variant="outline" className="gap-1 text-yellow-600">
          <Loader2 className="h-3 w-3 animate-spin" />
          Checking...
        </Badge>
      )}
      
      {status === 'connected' && (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Connected to {config.host}/{config.database}
        </Badge>
      )}
      
      {status === 'error' && (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200" title={error || undefined}>
          Connection Error
        </Badge>
      )}
    </div>
  );
} 