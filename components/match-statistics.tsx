"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { getMatchStatistics } from "@/lib/match-service"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface MatchStatisticsProps {
  userId: string
}

export default function MatchStatistics({ userId }: MatchStatisticsProps) {
  const [stats, setStats] = useState({
    totalMatches: 0,
    newMatches: 0,
    savedMatches: 0,
    viewedMatches: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getMatchStatistics(userId)
        setStats(data)
      } catch (error) {
        console.error("Error loading match statistics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [userId])

  const data = [
    { name: "New", value: stats.newMatches, color: "#8b5cf6" },
    { name: "Saved", value: stats.savedMatches, color: "#ec4899" },
    { name: "Viewed", value: stats.viewedMatches, color: "#6366f1" },
  ]

  return (
    <Card className="col-span-1 md:col-span-2 shadow-md border-0 bg-card/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Match Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 mt-4 md:mt-0">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Matches</p>
                <p className="text-2xl font-bold">{stats.totalMatches}</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">New</p>
                <p className="text-2xl font-bold text-purple-500">{stats.newMatches}</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Saved</p>
                <p className="text-2xl font-bold text-pink-500">{stats.savedMatches}</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Viewed</p>
                <p className="text-2xl font-bold text-indigo-500">{stats.viewedMatches}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
