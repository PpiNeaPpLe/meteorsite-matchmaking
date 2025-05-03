"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { getRecentActivity } from "@/lib/match-service"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HeartIcon, BookmarkIcon, EyeIcon } from "lucide-react"

interface Activity {
  id: string
  type: "like" | "save" | "view"
  matchName: string
  matchPhoto: string
  timestamp: string
}

interface RecentActivityProps {
  userId: string
}

export default function RecentActivity({ userId }: RecentActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadActivities() {
      try {
        const data = await getRecentActivity(userId)
        setActivities(data)
      } catch (error) {
        console.error("Error loading recent activities:", error)
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [userId])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "like":
        return <HeartIcon className="h-4 w-4 text-red-500" />
      case "save":
        return <BookmarkIcon className="h-4 w-4 text-purple-500" />
      case "view":
        return <EyeIcon className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getActivityText = (type: string, name: string) => {
    switch (type) {
      case "like":
        return `You liked ${name}`
      case "save":
        return `You saved ${name}`
      case "view":
        return `You viewed ${name}`
      default:
        return ""
    }
  }

  return (
    <Card className="col-span-1 shadow-md border-0 bg-card/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.matchPhoto || "/placeholder.svg"} alt={activity.matchName} />
                  <AvatarFallback>{activity.matchName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{getActivityText(activity.type, activity.matchName)}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
                <div>{getActivityIcon(activity.type)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">No recent activity</div>
        )}
      </CardContent>
    </Card>
  )
}
