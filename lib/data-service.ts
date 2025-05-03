import type { User, Match, MembersFree } from "./types"

export async function getUserProfile(userId = "user-1"): Promise<User> {
  // In a real app, this would fetch from the database
  return {
    id: userId,
    name: "Alex Morgan",
    age: 32,
    location: "San Francisco, CA",
    profilePhoto: "/placeholder.svg?height=400&width=400",
    bio: "Passionate about travel, photography, and trying new cuisines. Looking for someone who shares my sense of adventure and appreciation for the little things in life.",
    religion: "Spiritual",
    orientation: "Straight",
    ethnicity: "Caucasian",
    hasKids: false,
    preferences: {
      ageMin: "28",
      ageMax: "40",
      height: "5'6\" and up",
      bodyType: "Any",
      education: "College degree",
      religion: "Open to all",
      hasKids: "No preference",
      ethnicity: "Open to all",
      distance: "50 miles",
    },
    details: {
      height: "5'10\"",
      bodyType: "Athletic",
      education: "Master's Degree",
      occupation: "Software Engineer",
      pets: "Dog lover",
      drinking: "Social drinker",
      smoking: "Non-smoker",
      exercise: "Regular",
    },
  }
}

export async function getMatchRecommendations(userId: string): Promise<Match[]> {
  // In a real app, this would query the database based on user preferences
  try {
    // This would be a database query in a real app
    // const members = await db.query(`
    //   SELECT * FROM members_free
    //   WHERE gender != ? AND age BETWEEN ? AND ?
    //   LIMIT 10
    // `, [userGender, minAge, maxAge])

    // For demo purposes, return mock data
    return [
      {
        id: "match-1",
        name: "Jamie Lee",
        age: 30,
        location: "Oakland, CA",
        profilePhoto: "/placeholder.svg?height=400&width=300",
        matchScore: 92,
        orientation: "Straight",
        ethnicity: "Asian",
        religion: "Spiritual",
        hasKids: false,
        isNew: true,
        bio: "Travel enthusiast, foodie, and amateur photographer. I love exploring new places and capturing moments through my lens.",
        reasoningPoints: [
          "Within your preferred age range (28-35)",
          "Shares your spiritual beliefs",
          "Also doesn't have children",
          "Common interests in travel and photography",
          "Compatible communication styles",
        ],
        aiExplanation:
          "Jamie's profile shows strong alignment with your preferences. You both value spirituality without strict religious adherence, enjoy travel, and have similar life goals regarding family planning. Your communication patterns also suggest high compatibility.",
        compatibilityScores: [
          { category: "Values", percentage: 95 },
          { category: "Lifestyle", percentage: 88 },
          { category: "Interests", percentage: 92 },
          { category: "Communication", percentage: 90 },
        ],
      },
      {
        id: "match-2",
        name: "Taylor Smith",
        age: 34,
        location: "San Francisco, CA",
        profilePhoto: "/placeholder.svg?height=400&width=300",
        matchScore: 87,
        orientation: "Straight",
        ethnicity: "Caucasian",
        religion: "Agnostic",
        hasKids: false,
        bio: "Ambitious professional who loves the outdoors. Hiking, camping, and kayaking are my weekend escapes from the corporate world.",
        reasoningPoints: [
          "Within your preferred age range (28-35)",
          "Similar views on religion (Spiritual/Agnostic)",
          "Mutual interest in outdoor activities",
          "Both prioritize career and personal growth",
          "No children but open to them in future",
        ],
        aiExplanation:
          "Taylor's profile indicates strong compatibility in lifestyle and future goals. While their religious views are slightly different (Agnostic vs. Spiritual), your shared emphasis on personal growth and similar approaches to life's big questions suggest a meaningful connection.",
        compatibilityScores: [
          { category: "Values", percentage: 85 },
          { category: "Lifestyle", percentage: 90 },
          { category: "Interests", percentage: 82 },
          { category: "Communication", percentage: 88 },
        ],
      },
      {
        id: "match-3",
        name: "Jordan Rivera",
        age: 29,
        location: "San Jose, CA",
        profilePhoto: "/placeholder.svg?height=400&width=300",
        matchScore: 85,
        orientation: "Straight",
        ethnicity: "Hispanic",
        religion: "Spiritual",
        hasKids: false,
        isNew: true,
        bio: "Culinary school graduate and food blogger. I believe food brings people together and tells stories about cultures and traditions.",
        reasoningPoints: [
          "Exact match on spiritual beliefs",
          "Shared passion for cuisine and cooking",
          "Compatible communication style",
          "Similar travel experiences",
          "Both enjoy cultural activities",
        ],
        aiExplanation:
          "Jordan's interests in cuisine and cultural experiences align perfectly with your love for trying new foods and travel. You both identify as spiritual and have similar approaches to life philosophy, suggesting meaningful conversations and shared values.",
        compatibilityScores: [
          { category: "Values", percentage: 88 },
          { category: "Lifestyle", percentage: 82 },
          { category: "Interests", percentage: 95 },
          { category: "Communication", percentage: 84 },
        ],
      },
      {
        id: "match-4",
        name: "Casey Johnson",
        age: 31,
        location: "Berkeley, CA",
        profilePhoto: "/placeholder.svg?height=400&width=300",
        matchScore: 82,
        orientation: "Straight",
        ethnicity: "African American",
        religion: "Christian",
        hasKids: true,
        bio: "Professional photographer and parent to an amazing 5-year-old. Looking for someone who appreciates art, family, and quiet evenings at home.",
        reasoningPoints: [
          "Within your preferred age range",
          "Complementary personality traits",
          "Shared interest in photography",
          "Similar education background",
          "Compatible life goals",
        ],
        aiExplanation:
          "While Casey's religious background differs from yours (Christian vs. Spiritual), your shared interests in photography and similar education create a strong foundation. Your personality assessments show complementary traits that often lead to balanced relationships.",
        compatibilityScores: [
          { category: "Values", percentage: 78 },
          { category: "Lifestyle", percentage: 75 },
          { category: "Interests", percentage: 92 },
          { category: "Communication", percentage: 85 },
        ],
      },
      {
        id: "match-5",
        name: "Riley Thompson",
        age: 33,
        location: "Palo Alto, CA",
        profilePhoto: "/placeholder.svg?height=400&width=300",
        matchScore: 79,
        orientation: "Straight",
        ethnicity: "Mixed",
        religion: "Buddhist",
        hasKids: false,
        isNew: true,
        bio: "Tech entrepreneur with a passion for mindfulness and meditation. I believe in balancing ambition with inner peace and personal growth.",
        reasoningPoints: [
          "Philosophical compatibility (Spiritual/Buddhist)",
          "Both enjoy mindfulness practices",
          "Shared love for international travel",
          "Similar career ambitions",
          "Compatible communication patterns",
        ],
        aiExplanation:
          "Riley's Buddhist practices align well with your spiritual outlook, suggesting shared values around mindfulness and personal growth. Your mutual love for international travel and similar career trajectories indicate compatible lifestyles and goals.",
        compatibilityScores: [
          { category: "Values", percentage: 86 },
          { category: "Lifestyle", percentage: 80 },
          { category: "Interests", percentage: 75 },
          { category: "Communication", percentage: 82 },
        ],
      },
    ]
  } catch (error) {
    console.error("Error fetching match recommendations:", error)
    return []
  }
}

export async function getMemberFromDatabase(memberId: number): Promise<MembersFree | null> {
  try {
    // In a real app, this would query the database
    // const member = await db.query(`
    //   SELECT * FROM members_free WHERE free_ID = ?
    // `, [memberId])

    // For demo purposes, return null
    return null
  } catch (error) {
    console.error("Error fetching member from database:", error)
    return null
  }
}

export async function mapDatabaseMemberToUser(member: MembersFree): Promise<User> {
  // Map the database schema to our application User type
  return {
    id: `db-${member.free_ID}`,
    name: `${member.first_name || "Unknown"} ${member.last_name || ""}`.trim(),
    age: member.age ? Number.parseInt(member.age) : 0,
    location: member.city && member.state ? `${member.city}, ${member.state}` : "Unknown",
    profilePhoto: "/placeholder.svg?height=400&width=400",
    bio: member.about_you || "",
    religion: member.religion || "Not specified",
    orientation: member.orientation || "Not specified",
    ethnicity: member.ethnicity || "Not specified",
    hasKids: member.have_kids === "Yes",
    preferences: {
      ageMin: member.age_range_min || "",
      ageMax: member.age_range_max || "",
      religion: member.religious_preference || "",
      hasKids: member.kids_preference || "",
      ethnicity: member.ethnicity_preference || "",
      distance: member.two_hours === "Yes" ? "120 miles" : "50 miles",
    },
    details: {
      height: member.height || "",
      bodyType: member.body || "",
      education: member.education || "",
      occupation: member.occupation || "",
      pets: member.pets === "Yes" ? member.pet_type || "Has pets" : "No pets",
      smoking: member.vices?.includes("smoking") ? "Smoker" : "Non-smoker",
      drinking: member.vices?.includes("drinking") ? "Drinks" : "Non-drinker",
    },
  }
}
