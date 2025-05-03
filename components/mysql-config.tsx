"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";

// Define the MySQL config interface
interface MySQLConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

// Default config values
const defaultConfig: MySQLConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: ""
};

export function MySQLConfigComponent() {
  const [config, setConfig] = useState<MySQLConfig>(() => {
    // Try to load from localStorage on client side
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mysqlConfig");
      return saved ? JSON.parse(saved) : defaultConfig;
    }
    return defaultConfig;
  });
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [needsRestart, setNeedsRestart] = useState(false);
  
  // Save to localStorage whenever config changes
  useEffect(() => {
    localStorage.setItem("mysqlConfig", JSON.stringify(config));
  }, [config]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev: MySQLConfig) => ({
      ...prev,
      [name]: name === "port" ? parseInt(value) || 3306 : value
    }));
  };
  
  const testConnection = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch("/api/db/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(config)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Connection successful!");
      } else {
        toast.error(`Connection failed: ${data.error}`);
      }
    } catch (error) {
      toast.error(`Connection error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const saveConfig = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/db/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(config)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Configuration saved successfully!");
      } else {
        toast.error(`Save failed: ${data.error}`);
      }
    } catch (error) {
      toast.error(`Save error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {needsRestart && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Server restart required</AlertTitle>
          <AlertDescription>
            The server needs to be restarted to apply the new database configuration.
            Please restart your Next.js server.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>MySQL Configuration</CardTitle>
          <CardDescription>
            Enter your MySQL server connection details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="host">Host</Label>
            <Input 
              id="host" 
              name="host" 
              value={config.host} 
              onChange={handleChange} 
              placeholder="localhost" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input 
              id="port" 
              name="port" 
              type="number" 
              value={config.port} 
              onChange={handleChange} 
              placeholder="3306" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="user">Username</Label>
            <Input 
              id="user" 
              name="user" 
              value={config.user} 
              onChange={handleChange} 
              placeholder="root" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              value={config.password} 
              onChange={handleChange} 
              placeholder="Password" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="database">Database</Label>
            <Input 
              id="database" 
              name="database" 
              value={config.database} 
              onChange={handleChange} 
              placeholder="database_name" 
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={testConnection} 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : "Test Connection"}
          </Button>
          
          <Button 
            onClick={saveConfig} 
            disabled={isSaving}
            variant="outline"
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : "Save to Server"}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-medium mb-2">Connection Instructions</h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Database connections can only be made from the server-side API routes, not directly from the browser.
          </p>
          <p>
            After saving your configuration:
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Navigate to the /members page to test database queries</li>
            <li>Changes are applied immediately to all new database connections</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 