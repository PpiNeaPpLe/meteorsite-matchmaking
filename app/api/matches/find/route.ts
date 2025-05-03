import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import { getConfig } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const strictness = searchParams.get('strictness') || 'normal'; // strict, normal, relaxed
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Get filter configurations
    const filterAge = searchParams.get('filter_age') !== 'false';
    const filterLocation = searchParams.get('filter_location') !== 'false';
    const filterReligion = searchParams.get('filter_religion') !== 'false';
    const filterEducation = searchParams.get('filter_education') !== 'false'; 
    const filterKids = searchParams.get('filter_kids') !== 'false';
    const filterOrientation = searchParams.get('filter_orientation') !== 'false';
    
    if (!memberId) {
      return NextResponse.json({ 
        error: "Missing member ID", 
        success: false 
      }, { status: 400 });
    }
    
    // Create database connection using dynamic config
    const connection = await mysql.createConnection(getConfig());
    
    try {
      // 1. First, get the target member's details
      const [targetMembers] = await connection.query(
        `SELECT * FROM members_free WHERE free_ID = ?`, 
        [memberId]
      );
      
      if (!Array.isArray(targetMembers) || targetMembers.length === 0) {
        return NextResponse.json({ 
          error: "Member not found", 
          success: false 
        }, { status: 404 });
      }
      
      const targetMember = targetMembers[0] as any;
      
      // Calculate query conditions based on strictness
      let genderOrientationCondition = '';
      let additionalConditions = [];
      
      // Always exclude self
      additionalConditions.push('m.free_ID != ?');
      
      // Gender and orientation filtering conditions
      if (filterOrientation) {
        // In strict mode, only match exact orientation matches
        if (strictness === 'strict') {
          genderOrientationCondition = `
            (
              -- If target is straight male, match with straight females
              (? = 'Male' AND ? = 'straight' AND m.gender = 'Female' AND m.orientation = 'straight')
              -- If target is straight female, match with straight males
              OR (? = 'Female' AND ? = 'straight' AND m.gender = 'Male' AND m.orientation = 'straight')
              -- If target is gay male, match with gay males
              OR (? = 'Male' AND ? = 'gay' AND m.gender = 'Male' AND (m.orientation = 'gay' OR m.orientation = 'bi-sexual'))
              -- If target is gay female, match with gay females
              OR (? = 'Female' AND ? = 'gay' AND m.gender = 'Female' AND (m.orientation = 'gay' OR m.orientation = 'bi-sexual'))
              -- If target is bi-sexual, match with bi-sexual of any gender
              OR (? = 'bi-sexual' AND m.orientation = 'bi-sexual')
            )
          `;
          additionalConditions.push(genderOrientationCondition);
        } 
        // In normal mode, more flexible but still respects basic orientation
        else if (strictness === 'normal') {
          // Straight matches
          if (targetMember.orientation === 'straight' && targetMember.gender === 'Male') {
            additionalConditions.push("m.gender = 'Female'"); 
          }
          else if (targetMember.orientation === 'straight' && targetMember.gender === 'Female') {
            additionalConditions.push("m.gender = 'Male'");
          }
          // Gay matches
          else if (targetMember.orientation === 'gay' && targetMember.gender === 'Male') {
            additionalConditions.push("m.gender = 'Male'");
          }
          else if (targetMember.orientation === 'gay' && targetMember.gender === 'Female') {
            additionalConditions.push("m.gender = 'Female'");
          }
          // For bi-sexual, no additional restrictions
        }
        // In relaxed mode, we'll use scoring instead of strict filtering for gender/orientation
      }
      
      // Age filtering
      if (filterAge && strictness !== 'relaxed') {
        // Add age filtering based on preferences
        const targetAge = parseInt(targetMember.age) || 30;
        const ageRangeMin = targetMember.age_range_min || (targetAge - 10);
        const ageRangeMax = targetMember.age_range_max || (targetAge + 10);
        
        if (strictness === 'strict') {
          // Strict: Must be in the exact age range preferences
          additionalConditions.push('(m.age_range_min IS NULL OR ? >= m.age_range_min)');
          additionalConditions.push('(m.age_range_max IS NULL OR ? <= m.age_range_max)');
          additionalConditions.push('(m.age BETWEEN ? AND ?)');
        } else if (strictness === 'normal') {
          // Normal: Within a wider age range
          const expandedMin = parseInt(ageRangeMin) - 5;
          const expandedMax = parseInt(ageRangeMax) + 5;
          additionalConditions.push(`(m.age BETWEEN ${expandedMin} AND ${expandedMax})`);
        }
      }
      
      // Build the WHERE clause from all conditions
      const whereClause = additionalConditions.length > 0 
        ? 'WHERE ' + additionalConditions.join(' AND ')
        : '';
      
      // 2. Build a complex SQL query with scoring for compatibility
      const matchQuery = `
        SELECT 
          m.free_ID as id,
          m.city,
          m.state,
          m.gender,
          m.gender_ident as genderIdentity,
          m.orientation,
          m.age,
          m.ethnicity,
          m.religion,
          m.height,
          m.have_kids as hasKids,
          m.occupation,
          m.education,
          m.hobbies,
          m.about_you as aboutYou,
          m.personality,
          CONCAT(m.city, ', ', m.state) as location,
          
          -- Calculate match score (higher is better)
          (
            -- Gender & orientation match (0-30 points)
            CASE 
              -- Exact gender/orientation match
              WHEN (? = 'Male' AND ? = 'straight' AND m.gender = 'Female' AND m.orientation = 'straight') OR
                   (? = 'Female' AND ? = 'straight' AND m.gender = 'Male' AND m.orientation = 'straight') OR
                   (? = 'Male' AND ? = 'gay' AND m.gender = 'Male' AND m.orientation = 'gay') OR
                   (? = 'Female' AND ? = 'gay' AND m.gender = 'Female' AND m.orientation = 'gay') OR
                   (? = 'bi-sexual' AND m.orientation = 'bi-sexual')
                THEN 30
              -- Compatible but not exact
              WHEN (? = 'Male' AND ? = 'straight' AND m.gender = 'Female') OR
                   (? = 'Female' AND ? = 'straight' AND m.gender = 'Male') OR
                   (? = 'Male' AND ? = 'gay' AND m.gender = 'Male') OR
                   (? = 'Female' AND ? = 'gay' AND m.gender = 'Female') OR
                   (? = 'bi-sexual') OR (m.orientation = 'bi-sexual')
                THEN 20
              ELSE 0
            END +
            
            -- Age match (0-20 points)
            CASE 
              WHEN m.age BETWEEN ? AND ? THEN 20
              WHEN ABS(m.age - ?) <= 5 THEN 15
              WHEN ABS(m.age - ?) <= 10 THEN 10
              WHEN ABS(m.age - ?) <= 15 THEN 5
              ELSE 0
            END +
            
            -- Location match (0-15 points)
            CASE 
              WHEN m.city = ? AND m.state = ? THEN 15
              WHEN m.state = ? THEN 10
              ELSE 0
            END +
            
            -- Religion match (0-10 points)
            CASE 
              WHEN m.religion = ? THEN 10
              ELSE 0
            END +
            
            -- Education match (0-10 points)
            CASE 
              WHEN m.education = ? THEN 10
              ELSE 0
            END +
            
            -- Kid preference match (0-5 points) 
            CASE
              WHEN (? = 'yes' AND m.have_kids = 'yes') OR 
                   (? = 'no' AND m.have_kids = 'no') THEN 5
              ELSE 0
            END
          ) as match_score
        FROM 
          members_free m
        ${whereClause}
          
        -- Order by match score (best matches first) and then newest members
        ORDER BY match_score DESC, m.date DESC
        LIMIT ?
      `;
      
      // Prepare parameters for the query
      const targetAge = parseInt(targetMember.age) || 30;
      const ageRangeMin = targetMember.age_range_min || (targetAge - 10);
      const ageRangeMax = targetMember.age_range_max || (targetAge + 10);
      
      // Build the parameters list based on the constructed query
      let params = [];
      
      // Always include the self-ID for exclusion
      params.push(targetMember.free_ID);
      
      // Gender & orientation parameters for strict filtering if needed
      if (filterOrientation && strictness === 'strict') {
        // Gender & orientation parameters (repeated for each condition)
        params = params.concat([
          targetMember.gender, targetMember.orientation,
          targetMember.gender, targetMember.orientation,
          targetMember.gender, targetMember.orientation,
          targetMember.gender, targetMember.orientation,
          targetMember.orientation
        ]);
      }
      
      // Age parameters for strict filtering if needed
      if (filterAge && strictness === 'strict') {
        params.push(targetAge, targetAge);
        params.push(ageRangeMin, ageRangeMax);
      }
      
      // Scoring parameters (used regardless of filter settings)
      // Gender & orientation scoring
      params = params.concat([
        // Exact matches
        targetMember.gender, targetMember.orientation,
        targetMember.gender, targetMember.orientation,
        targetMember.gender, targetMember.orientation,
        targetMember.gender, targetMember.orientation,
        targetMember.orientation,
        
        // Compatible matches
        targetMember.gender, targetMember.orientation,
        targetMember.gender, targetMember.orientation,
        targetMember.gender, targetMember.orientation,
        targetMember.gender, targetMember.orientation,
        targetMember.orientation
      ]);
      
      // Age scoring
      params = params.concat([
        ageRangeMin, ageRangeMax,
        targetAge, targetAge, targetAge
      ]);
      
      // Location scoring
      params = params.concat([
        targetMember.city, targetMember.state,
        targetMember.state
      ]);
      
      // Religion scoring
      params.push(targetMember.religion);
      
      // Education scoring
      params.push(targetMember.education);
      
      // Kids scoring
      params = params.concat([
        targetMember.have_kids, targetMember.have_kids
      ]);
      
      // Add the LIMIT parameter
      params.push(limit);
      
      // Execute match query
      const [matches] = await connection.query(matchQuery, params);
      
      // Generate compatibility explanation for each match
      const matchesWithReasons = (matches as any[]).map(match => {
        const reasons = [];
        
        // Gender/orientation compatibility
        if (match.gender && match.orientation) {
          if ((targetMember.gender === 'Male' && targetMember.orientation === 'straight' && 
               match.gender === 'Female' && match.orientation === 'straight') ||
              (targetMember.gender === 'Female' && targetMember.orientation === 'straight' && 
               match.gender === 'Male' && match.orientation === 'straight') ||
              (targetMember.gender === 'Male' && targetMember.orientation === 'gay' && 
               match.gender === 'Male' && match.orientation === 'gay') ||
              (targetMember.gender === 'Female' && targetMember.orientation === 'gay' && 
               match.gender === 'Female' && match.orientation === 'gay') ||
              (targetMember.orientation === 'bi-sexual' && match.orientation === 'bi-sexual')) {
            reasons.push(`Your gender and orientation preferences match perfectly`);
          } else if (match.orientation === 'bi-sexual' || targetMember.orientation === 'bi-sexual') {
            reasons.push(`You have compatible orientation preferences`);
          }
        }
        
        // Age compatibility
        if (match.age) {
          if (Math.abs(parseInt(match.age) - targetAge) <= 3) {
            reasons.push(`You're very close in age (${match.age} vs ${targetAge})`);
          } else if (parseInt(match.age) >= parseInt(ageRangeMin) && parseInt(match.age) <= parseInt(ageRangeMax)) {
            reasons.push(`${match.age} is within your preferred age range`);
          }
        }
        
        // Location compatibility
        if (match.city === targetMember.city && match.state === targetMember.state) {
          reasons.push(`You both live in ${match.city}, ${match.state}`);
        } else if (match.state === targetMember.state) {
          reasons.push(`You both live in ${match.state}`);
        }
        
        // Religion compatibility
        if (match.religion && match.religion === targetMember.religion) {
          reasons.push(`You share the same religion (${match.religion})`);
        }
        
        // Education compatibility
        if (match.education && match.education === targetMember.education) {
          reasons.push(`You have similar education backgrounds (${match.education})`);
        }
        
        // Kids compatibility
        if (match.hasKids === targetMember.have_kids) {
          if (match.hasKids === 'yes') {
            reasons.push('You both have children');
          } else {
            reasons.push('Neither of you have children');
          }
        }
        
        // Hobbies compatibility
        if (match.hobbies && targetMember.hobbies) {
          const matchHobbies = (match.hobbies as string).toLowerCase().split(',');
          const targetHobbies = (targetMember.hobbies as string).toLowerCase().split(',');
          
          const commonHobbies = matchHobbies.filter((hobby: string) => 
            targetHobbies.some((targetHobby: string) => targetHobby.trim().includes(hobby.trim()))
          );
          
          if (commonHobbies.length > 0) {
            reasons.push(`You share common hobbies and interests`);
          }
        }
        
        return {
          ...match,
          compatibility_reasons: reasons,
          compatibility_score: match.match_score
        };
      });
      
      return NextResponse.json({ 
        matches: matchesWithReasons,
        targetMember: {
          id: targetMember.free_ID,
          name: `Profile #${targetMember.free_ID}`,
          age: targetMember.age,
          gender: targetMember.gender,
          orientation: targetMember.orientation,
          location: `${targetMember.city}, ${targetMember.state}`
        },
        matchingMode: strictness,
        success: true
      });
    } finally {
      await connection.end();
    }
    
  } catch (error) {
    console.error("Error finding matches:", error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to find matches",
        success: false
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { preferences, minAge, maxAge } = body;
    
    if (!preferences) {
      return NextResponse.json(
        { error: "Missing required preferences data" },
        { status: 400 }
      );
    }
    
    // Create database connection using dynamic config
    const connection = await mysql.createConnection(getConfig());
    
    try {
      // Logic to find matches based on provided preferences
      // This is a simple example, you would expand this with actual matching logic
      
      let query = `
        SELECT 
          free_ID as id, 
          city, 
          state, 
          gender,
          gender_ident as genderIdentity,
          orientation,
          age,
          ethnicity,
          religion,
          height,
          have_kids as hasKids,
          CONCAT(city, ', ', state) as location
        FROM members_free 
        WHERE 1=1
      `;
      
      const params: any[] = [];
      
      // Add age range filter if provided
      if (minAge && maxAge) {
        query += " AND age BETWEEN ? AND ?";
        params.push(minAge, maxAge);
      }
      
      // Add limit
      query += " LIMIT 10";
      
      const [matches] = await connection.execute(query, params);
      
      return NextResponse.json({ 
        matches,
        success: true
      });
    } finally {
      await connection.end();
    }
    
  } catch (error) {
    console.error("Error finding matches:", error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to find matches",
        success: false
      },
      { status: 500 }
    );
  }
} 