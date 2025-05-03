import type { User, Match } from "./types"

export const userProfile: User = {
  id: "user-1",
  name: "Alex Morgan",
  age: 32,
  location: "San Francisco, CA",
  profilePhoto: "/placeholder.svg?height=400&width=400",
  bio: "Passionate about travel, photography, and trying new cuisines. Looking for someone who shares my sense of adventure and appreciation for the little things in life.",
  religion: "Spiritual",
  orientation: "Straight",
  ethnicity: "Caucasian",
  hasKids: false,
}

export const matchRecommendations: Match[] = [
  {
    id: "match-1",
    name: "Jamie Lee",
    age: 30,
    profilePhoto: "/placeholder.svg?height=400&width=300",
    matchScore: 92,
    orientation: "Straight",
    ethnicity: "Asian",
    religion: "Spiritual",
    reasoningPoints: [
      "Within your preferred age range (28-35)",
      "Shares your spiritual beliefs",
      "Also doesn't have children",
      "Common interests in travel and photography",
      "Compatible communication styles",
    ],
    aiExplanation:
      "Jamie's profile shows strong alignment with your preferences. You both value spirituality without strict religious adherence, enjoy travel, and have similar life goals regarding family planning. Your communication patterns also suggest high compatibility.",
  },
  {
    id: "match-2",
    name: "Taylor Smith",
    age: 34,
    profilePhoto: "/placeholder.svg?height=400&width=300",
    matchScore: 87,
    orientation: "Straight",
    ethnicity: "Caucasian",
    religion: "Agnostic",
    reasoningPoints: [
      "Within your preferred age range (28-35)",
      "Similar views on religion (Spiritual/Agnostic)",
      "Mutual interest in outdoor activities",
      "Both prioritize career and personal growth",
      "No children but open to them in future",
    ],
    aiExplanation:
      "Taylor's profile indicates strong compatibility in lifestyle and future goals. While their religious views are slightly different (Agnostic vs. Spiritual), your shared emphasis on personal growth and similar approaches to life's big questions suggest a meaningful connection.",
  },
  {
    id: "match-3",
    name: "Jordan Rivera",
    age: 29,
    profilePhoto: "/placeholder.svg?height=400&width=300",
    matchScore: 85,
    orientation: "Straight",
    ethnicity: "Hispanic",
    religion: "Spiritual",
    reasoningPoints: [
      "Exact match on spiritual beliefs",
      "Shared passion for cuisine and cooking",
      "Compatible communication style",
      "Similar travel experiences",
      "Both enjoy cultural activities",
    ],
    aiExplanation:
      "Jordan's interests in cuisine and cultural experiences align perfectly with your love for trying new foods and travel. You both identify as spiritual and have similar approaches to life philosophy, suggesting meaningful conversations and shared values.",
  },
  {
    id: "match-4",
    name: "Casey Johnson",
    age: 31,
    profilePhoto: "/placeholder.svg?height=400&width=300",
    matchScore: 82,
    orientation: "Straight",
    ethnicity: "African American",
    religion: "Christian",
    reasoningPoints: [
      "Within your preferred age range",
      "Complementary personality traits",
      "Shared interest in photography",
      "Similar education background",
      "Compatible life goals",
    ],
    aiExplanation:
      "While Casey's religious background differs from yours (Christian vs. Spiritual), your shared interests in photography and similar education create a strong foundation. Your personality assessments show complementary traits that often lead to balanced relationships.",
  },
  {
    id: "match-5",
    name: "Riley Thompson",
    age: 33,
    profilePhoto: "/placeholder.svg?height=400&width=300",
    matchScore: 79,
    orientation: "Straight",
    ethnicity: "Mixed",
    religion: "Buddhist",
    reasoningPoints: [
      "Philosophical compatibility (Spiritual/Buddhist)",
      "Both enjoy mindfulness practices",
      "Shared love for international travel",
      "Similar career ambitions",
      "Compatible communication patterns",
    ],
    aiExplanation:
      "Riley's Buddhist practices align well with your spiritual outlook, suggesting shared values around mindfulness and personal growth. Your mutual love for international travel and similar career trajectories indicate compatible lifestyles and goals.",
  },
]
