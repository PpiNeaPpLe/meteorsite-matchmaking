import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import { getConfig } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Create database connection using dynamic config
    const connection = await mysql.createConnection(getConfig());
    
    try {
      // Get members from members_free table with specific fields
      const [members] = await connection.query(
        `SELECT 
          free_ID as id, 
          city, 
          state, 
          zip,
          gender,
          gender_ident as genderIdentity,
          orientation,
          age,
          dob as dateOfBirth,
          ethnicity,
          religion,
          height,
          have_kids as hasKids,
          occupation,
          education,
          personality,
          hobbies,
          CONCAT(city, ', ', state) as location
        FROM members_free 
        LIMIT ${limit}`
      );
      
      // Get total count
      const [countResult] = await connection.query(
        "SELECT COUNT(*) as total FROM members_free"
      );
      
      const total = (countResult as any)[0]?.total || 0;
      
      return NextResponse.json({ 
        members,
        total,
        success: true
      });
    } finally {
      await connection.end();
    }
    
  } catch (error) {
    console.error("Error fetching members:", error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to fetch members",
        success: false
      },
      { status: 500 }
    );
  }
} 