"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatabaseConnectionStatus } from "@/components/db-connection-status";
import { Loader2, User, MapPin, Book, Briefcase, Heart, ThumbsUp, Filter, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Member interface
interface Member {
  id: number;
  city?: string;
  state?: string;
  gender?: string;
  genderIdentity?: string;
  orientation?: string;
  age?: string;
  ethnicity?: string;
  religion?: string;
  height?: string;
  hasKids?: string;
  occupation?: string;
  education?: string;
  hobbies?: string;
  aboutYou?: string;
  personality?: string;
  location?: string;
  compatibility_score?: number;
  compatibility_reasons?: string[];
}

interface TargetMember {
  id: number;
  name: string;
  age: string;
  gender: string;
  orientation: string;
  location: string;
}

interface MatchFilters {
  strictness: 'strict' | 'normal' | 'relaxed';
  filter_age: boolean;
  filter_location: boolean;
  filter_religion: boolean;
  filter_education: boolean;
  filter_kids: boolean;
  filter_orientation: boolean;
  limit: number;
}

export default function MatchmakingPage() {
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Member[]>([]);
  const [targetMember, setTargetMember] = useState<TargetMember | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<MatchFilters>({
    strictness: 'normal',
    filter_age: true,
    filter_location: true,
    filter_religion: true,
    filter_education: true,
    filter_kids: true,
    filter_orientation: true,
    limit: 20
  });
  
  // Function to find matches for a specific member
  const findMatches = async () => {
    if (!memberId) {
      setError("Please enter a member ID");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Build query params from filters
      const queryParams = new URLSearchParams();
      queryParams.append('memberId', memberId);
      queryParams.append('strictness', filters.strictness);
      queryParams.append('limit', filters.limit.toString());
      
      // Add filter parameters
      queryParams.append('filter_age', filters.filter_age.toString());
      queryParams.append('filter_location', filters.filter_location.toString());
      queryParams.append('filter_religion', filters.filter_religion.toString());
      queryParams.append('filter_education', filters.filter_education.toString());
      queryParams.append('filter_kids', filters.filter_kids.toString());
      queryParams.append('filter_orientation', filters.filter_orientation.toString());
      
      const response = await fetch(`/api/matches/find?${queryParams.toString()}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMatches(data.matches || []);
        setTargetMember(data.targetMember);
      } else {
        throw new Error(data.error || "Failed to find matches");
      }
    } catch (err) {
      console.error("Error finding matches:", err);
      setError(err instanceof Error ? err.message : "Failed to find matches");
      setMatches([]);
      setTargetMember(null);
    } finally {
      setLoading(false);
    }
  };
  
  // Format compatibility score as percentage
  const formatCompatibilityScore = (score?: number) => {
    if (score === undefined) return "0%";
    // Maximum possible score is 90 (sum of all point categories)
    return `${Math.min(100, Math.round((score / 90) * 100))}%`;
  };

  // Handler for changing filter values
  const handleFilterChange = (key: keyof MatchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Matchmaking</h1>
        <DatabaseConnectionStatus />
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Find Compatible Matches</CardTitle>
          <CardDescription>
            Enter a member ID to find their most compatible matches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <Label htmlFor="memberId">Member ID</Label>
                <Input 
                  id="memberId" 
                  value={memberId} 
                  onChange={(e) => setMemberId(e.target.value)}
                  placeholder="Enter a member ID" 
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={findMatches} 
                  disabled={loading || !memberId}
                  className="w-full"
                >
                  {loading ? 
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finding...</> : 
                    "Find Matches"}
                </Button>
              </div>
            </div>
            
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen} className="border rounded-md p-2">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex w-full justify-between items-center px-4 py-2">
                  <div className="flex items-center">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    <span>Matching Preferences</span>
                  </div>
                  <Badge variant="outline">
                    {filters.strictness} mode
                  </Badge>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4">
                <div className="space-y-6">
                  <div>
                    <Label className="text-base">Match Strictness</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Choose how strict the matching algorithm should be
                    </p>
                    <RadioGroup
                      value={filters.strictness}
                      onValueChange={(value) => handleFilterChange('strictness', value)}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="strict" id="strict" />
                        <Label htmlFor="strict" className="cursor-pointer">Strict - Only exact matches</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="normal" />
                        <Label htmlFor="normal" className="cursor-pointer">Normal - Balanced matching</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="relaxed" id="relaxed" />
                        <Label htmlFor="relaxed" className="cursor-pointer">Relaxed - Show more potential matches</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label className="text-base">Filter Criteria</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select which factors to consider when finding matches
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter_orientation"
                          checked={filters.filter_orientation}
                          onCheckedChange={(checked) => 
                            handleFilterChange('filter_orientation', checked === true)
                          }
                        />
                        <Label htmlFor="filter_orientation" className="cursor-pointer">
                          Gender & Orientation
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter_age"
                          checked={filters.filter_age}
                          onCheckedChange={(checked) => 
                            handleFilterChange('filter_age', checked === true)
                          }
                        />
                        <Label htmlFor="filter_age" className="cursor-pointer">
                          Age Preferences
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter_location"
                          checked={filters.filter_location}
                          onCheckedChange={(checked) => 
                            handleFilterChange('filter_location', checked === true)
                          }
                        />
                        <Label htmlFor="filter_location" className="cursor-pointer">
                          Location
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter_religion"
                          checked={filters.filter_religion}
                          onCheckedChange={(checked) => 
                            handleFilterChange('filter_religion', checked === true)
                          }
                        />
                        <Label htmlFor="filter_religion" className="cursor-pointer">
                          Religion
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter_education"
                          checked={filters.filter_education}
                          onCheckedChange={(checked) => 
                            handleFilterChange('filter_education', checked === true)
                          }
                        />
                        <Label htmlFor="filter_education" className="cursor-pointer">
                          Education
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter_kids"
                          checked={filters.filter_kids}
                          onCheckedChange={(checked) => 
                            handleFilterChange('filter_kids', checked === true)
                          }
                        />
                        <Label htmlFor="filter_kids" className="cursor-pointer">
                          Children Status
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label htmlFor="limit">Number of matches to show</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="limit"
                        type="number"
                        value={filters.limit}
                        onChange={(e) => handleFilterChange('limit', parseInt(e.target.value) || 10)}
                        min={5}
                        max={50}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">results</span>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
                {error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {targetMember && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between">
              <span>{targetMember.name}</span>
              <Badge className="ml-2">
                {targetMember.age} years
              </Badge>
            </CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4" />
                <span>{targetMember.gender}, {targetMember.orientation}</span>
                <span className="mx-2">•</span>
                <MapPin className="h-4 w-4" />
                <span>{targetMember.location}</span>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      )}
      
      {matches.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-green-600" />
              <span>Compatible Matches</span>
              <Badge variant="outline" className="ml-2">{matches.length} found</Badge>
            </h2>
            <Badge variant="outline" className="capitalize">{filters.strictness} matching</Badge>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <Card key={`match-${match.id}`} className="h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Profile #{match.id}</CardTitle>
                    <Badge variant="outline" className="font-normal">
                      {match.age} years
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5 text-pink-500" />
                    <span className="font-medium text-pink-600">
                      {formatCompatibilityScore(match.compatibility_score)} compatible
                    </span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 flex-grow">
                  <Progress 
                    value={match.compatibility_score ? (match.compatibility_score / 90) * 100 : 0} 
                    className="h-2 bg-gray-100" 
                  />
                  
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">
                      {match.gender}, {match.genderIdentity || 'Not specified'}
                    </span>
                  </div>
                  
                  {match.orientation && (
                    <div className="flex items-center text-sm">
                      <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{match.orientation}</span>
                    </div>
                  )}
                  
                  {match.location && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{match.location}</span>
                    </div>
                  )}
                  
                  {match.education && (
                    <div className="flex items-center text-sm">
                      <Book className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{match.education}</span>
                    </div>
                  )}
                  
                  {match.occupation && (
                    <div className="flex items-center text-sm">
                      <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{match.occupation}</span>
                    </div>
                  )}
                  
                  {match.aboutYou && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-1">About</h4>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {match.aboutYou}
                      </p>
                    </div>
                  )}
                  
                  {match.hobbies && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium mb-1">Hobbies</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {match.hobbies}
                      </p>
                    </div>
                  )}
                  
                  {match.compatibility_reasons && match.compatibility_reasons.length > 0 && (
                    <div className="mt-3">
                      <Separator className="my-2" />
                      <h4 className="text-sm font-medium mb-2">Why you match</h4>
                      <ul className="space-y-1">
                        {match.compatibility_reasons.map((reason, index) => (
                          <li key={index} className="text-xs flex items-start">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2 flex-shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    View Full Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : targetMember && !loading ? (
        <Card className="p-8 text-center text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <span className="text-lg">No matches found</span>
            <p className="max-w-md mx-auto text-sm">
              Try adjusting your filters or switching to a more relaxed matching mode
              to see more potential matches.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                handleFilterChange('strictness', 'relaxed');
                findMatches();
              }}
            >
              Try Relaxed Matching
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
} 