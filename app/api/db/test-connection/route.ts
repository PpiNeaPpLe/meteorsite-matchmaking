import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import { updateConfig } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Extract connection details from the request
    const { host, port, user, password, database } = body;
    
    // Validate required fields
    if (!host || !user) {
      return NextResponse.json(
        { error: "Missing required connection parameters" },
        { status: 400 }
      );
    }
    
    // Connection config
    const config = {
      host,
      port: port || 3306,
      user,
      password,
      database
    };
    
    // Try to establish a connection
    const connection = await mysql.createConnection(config);
    
    // Test the connection with a simple query
    await connection.query("SELECT 1");
    
    // Close the connection
    await connection.end();
    
    // When successful, update the current config for future use
    // This way testing and applying happen in one step
    updateConfig(config);
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      message: "Connection successful and configuration updated" 
    });
    
  } catch (error) {
    console.error("MySQL connection error:", error);
    
    // Return a friendly error message
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : "Failed to connect to MySQL database" 
      },
      { status: 500 }
    );
  }
} 