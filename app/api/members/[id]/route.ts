import { NextResponse } from "next/server"
import { getMemberFromDatabase, mapDatabaseMemberToUser } from "@/lib/data-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 })
    }

    const member = await getMemberFromDatabase(id)

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Map database member to user profile
    const user = await mapDatabaseMemberToUser(member)

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching member:", error)
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 })
  }
}
