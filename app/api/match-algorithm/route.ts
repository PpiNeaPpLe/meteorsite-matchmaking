import { NextResponse } from "next/server"
import { getMatchingAlgorithm } from "@/lib/match-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.userId || !body.matchId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get matching algorithm results
    const result = await getMatchingAlgorithm(body.userId, body.matchId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in matching algorithm:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
