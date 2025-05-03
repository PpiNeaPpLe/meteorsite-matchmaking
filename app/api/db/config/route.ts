import { NextResponse } from "next/server";
import { updateConfig } from "@/lib/db";

export async function POST(request: Request) {
  try {
    // In production, you would want to secure this endpoint
    // This is just for local development
    
    const body = await request.json();
    const { host, port, user, password, database } = body;
    
    // Validate required fields
    if (!host || !user || !database) {
      return NextResponse.json(
        { error: "Missing required connection parameters" },
        { status: 400 }
      );
    }
    
    // Update the in-memory configuration
    updateConfig({
      host,
      port: port || 3306,
      user,
      password: password || '',
      database
    });
    
    return NextResponse.json({ 
      success: true,
      message: "Database configuration updated. Changes are applied immediately." 
    });
    
  } catch (error) {
    console.error("Error updating database config:", error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : "Failed to update database configuration" 
      },
      { status: 500 }
    );
  }
} 