import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import { getConfig } from "@/lib/db";

export async function GET() {
  try {
    const config = getConfig();
    
    // Create database connection
    const connection = await mysql.createConnection(config);
    
    try {
      // Test the connection with a simple query
      await connection.query("SELECT 1");
      
      // Return success with sanitized config (no password)
      return NextResponse.json({ 
        connected: true,
        config: {
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user
        }
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    
    return NextResponse.json({ 
      connected: false, 
      error: error instanceof Error ? error.message : "Failed to connect to database" 
    });
  }
} 