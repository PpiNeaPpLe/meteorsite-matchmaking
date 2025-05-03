"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatabaseConnectionStatus } from "@/components/db-connection-status";
import { Loader2, User, MapPin, Book, Briefcase, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Member interface based on our SQL query
interface Member {
  id: number;
  city?: string;
  state?: string;
  zip?: string;
  gender?: string;
  genderIdentity?: string;
  orientation?: string;
  age?: string;
  dateOfBirth?: string;
  ethnicity?: string;
  religion?: string;
  height?: string;
  hasKids?: string;
  occupation?: string;
  education?: string;
  personality?: string;
  hobbies?: string;
  location?: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // Function to load members from the API
  const loadMembers = async (limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use API endpoint instead of direct database access
      const response = await fetch(`/api/members?limit=${limit}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMembers(data.members || []);
        setTotalCount(data.total || 0);
      } else {
        throw new Error(data.error || "Failed to load members");
      }
    } catch (err) {
      console.error("Error loading members:", err);
      setError(err instanceof Error ? err.message : "Failed to load members");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to view the raw SQL being executed (now shown for reference only)
  const showQuery = () => {
    const sql = "SELECT * FROM members_free LIMIT 10";
    const sqlCount = "SELECT COUNT(*) as total FROM members_free";
    
    alert(`
These queries are executed on the server:

Query 1: ${sql}
Query 2: ${sqlCount}

These queries execute against the database configured in your server environment (.env.local).
    `);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Members</h1>
        <DatabaseConnectionStatus />
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Database Query Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              This example demonstrates how to query your MySQL database via the API.
              Click the button below to fetch members from your database.
            </p>
            
            <div className="flex gap-2">
              <Button onClick={() => loadMembers(10)}>
                {loading ? 
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</> : 
                  "Load 10 Members"}
              </Button>
              
              <Button variant="outline" onClick={showQuery}>
                View SQL Query
              </Button>
              
              <Button variant="outline" onClick={() => window.location.href = "/settings/database"}>
                Database Settings
              </Button>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
                {error}
              </div>
            )}
            
            {totalCount !== null && members.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Showing {members.length} of {totalCount} total members
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {members.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <Card key={`member-${member.id || index}`} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Profile #{member.id || index + 1}</CardTitle>
                  <Badge variant="outline" className="font-normal">
                    {member.age} years
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">
                    {member.gender}, {member.genderIdentity || 'Not specified'}
                  </span>
                </div>
                
                {member.orientation && (
                  <div className="flex items-center text-sm">
                    <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{member.orientation}</span>
                  </div>
                )}
                
                {member.location && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{member.location}</span>
                  </div>
                )}
                
                {member.education && (
                  <div className="flex items-center text-sm">
                    <Book className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{member.education}</span>
                  </div>
                )}
                
                {member.occupation && (
                  <div className="flex items-center text-sm">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{member.occupation}</span>
                  </div>
                )}
                
                {member.personality && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Personality</h4>
                    <p className="text-xs text-muted-foreground">{member.personality}</p>
                  </div>
                )}
                
                {member.hobbies && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Hobbies</h4>
                    <p className="text-xs text-muted-foreground">{member.hobbies}</p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {member.ethnicity && <Badge variant="secondary" className="text-xs">{member.ethnicity}</Badge>}
                  {member.religion && <Badge variant="secondary" className="text-xs">{member.religion}</Badge>}
                  {member.hasKids === 'yes' && <Badge variant="secondary" className="text-xs">Has Kids</Badge>}
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View Full Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 