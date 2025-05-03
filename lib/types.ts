export interface User {
  id: string
  name: string
  age: number
  location: string
  profilePhoto: string
  bio: string
  religion: string
  orientation: string
  ethnicity: string
  hasKids: boolean
  preferences?: {
    ageMin?: string
    ageMax?: string
    height?: string
    bodyType?: string
    education?: string
    religion?: string
    hasKids?: string
    ethnicity?: string
    distance?: string
  }
  details?: {
    height?: string
    bodyType?: string
    education?: string
    occupation?: string
    pets?: string
    drinking?: string
    smoking?: string
    exercise?: string
  }
}

export interface Match {
  id: string
  name: string
  age: number
  location: string
  profilePhoto: string
  matchScore: number
  orientation: string
  ethnicity: string
  religion: string
  hasKids?: boolean
  isNew?: boolean
  bio?: string
  reasoningPoints: string[]
  aiExplanation: string
  compatibilityScores?: {
    category: string
    percentage: number
  }[]
}

export interface MembersFree {
  free_ID: number
  city: string | null
  state: string | null
  zip: string | null
  gender: string | null
  gender_ident: string | null
  orientation: string | null
  age: string | null
  dob: Date | null
  ethnicity: string | null
  religion: string | null
  weight: string | null
  height: string | null
  have_kids: string | null
  kids_info: string | null
  want_kids: string | null
  occupation: string | null
  education: string | null
  income: string | null
  marital_status: string | null
  politics: string | null
  criminal_record: string | null
  criminal_details: string | null
  age_range_min: string | null
  age_range_max: string | null
  ethnicity_preference: string | null
  body_preference: string | null
  religious_preference: string | null
  kids_preference: string | null
  get_alerts: string | null
  hear_about_us: string | null
  paid_services: string | null
  love_coached: string | null
  love_coached_details: string | null
  date: Date | null
  hair: string | null
  eye: string | null
  body: string | null
  hobbies: string | null
  vices: string | null
  personality: string | null
  sensitive1: string | null
  guidelines: string | null
  president: string | null
  favorites: string | null
  music: string | null
  food: string | null
  pets: string | null
  pet_type: string | null
  about_you: string | null
  celebs: string | null
  last_relationship: string | null
  ex_relationship: string | null
  describe_ex: string | null
  must_haves: string | null
  deal_breakers: string | null
  about_your_mate: string | null
  mates_career: string | null
  mates_education: string | null
  mates_personality: string | null
  mates_income: string | null
  mates_height_min: string | null
  mates_height_max: string | null
  mates_location: string | null
  two_hours: string | null
  relocate: string | null
  dating_sites: string | null
  service: string | null
  why_us: string | null
  facebook: string | null
  other_social: string | null
  anything_else: string | null
  initials: string | null
  client_type: number | null
  archived: number
  is_dupe: number
  user_ip: string | null
  sent_first_email: number
  uid: string | null
  ethnicity_info: string | null
  orientation_info: string | null
  religion_info: string | null
  education_info: string | null
  medical: string | null
  medical_info: string | null
  medical_date: string | null
  medical_date_info: string | null
  politics_info: string | null
  search_term: string | null
  pronouns: string | null
  pronouns_info: string | null
  source_form: string | null
  president_info: string | null
}
