import { NextResponse } from "next/server"
import { findMatches } from "@/lib/match-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Extract search parameters
    const gender = searchParams.get("gender")
    const minAge = searchParams.get("minAge")
    const maxAge = searchParams.get("maxAge")
    const religion = searchParams.get("religion")
    const hasKids = searchParams.get("hasKids")
    const ethnicity = searchParams.get("ethnicity")

    // Build search criteria
    const criteria: any = {}

    if (gender) criteria.gender = gender
    if (minAge) criteria.minAge = minAge
    if (maxAge) criteria.maxAge = maxAge
    if (religion) criteria.religion = religion
    if (hasKids) criteria.hasKids = hasKids
    if (ethnicity) criteria.ethnicity = ethnicity

    // Find matches based on criteria
    const matches = await findMatches(criteria)

    return NextResponse.json({ matches })
  } catch (error) {
    console.error("Error in matches API:", error)
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.userId || !body.criteria) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find matches based on criteria
    const matches = await findMatches(body.criteria)

    return NextResponse.json({ matches })
  } catch (error) {
    console.error("Error in matches API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
