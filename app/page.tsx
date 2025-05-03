import { Suspense } from "react"
import ProfilePanel from "@/components/profile-panel"
import MatchCarousel from "@/components/match-carousel"
import MatchStatistics from "@/components/match-statistics"
import RecentActivity from "@/components/recent-activity"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserProfile, getMatchRecommendations } from "@/lib/data-service"

export default async function MatchmakingPage() {
  const userProfile = await getUserProfile()
  const matchRecommendations = await getMatchRecommendations(userProfile.id)

  return (
    <main className="min-h-screen bg-gradient-to-b from-muted to-muted/50 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
          Your Perfect Match
        </h1>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <span className="text-sm text-muted-foreground">Last updated: Today at 2:45 PM</span>
        </div>
      </div>

      <Suspense fallback={<div className="h-64 w-full bg-muted/50 animate-pulse rounded-xl"></div>}>
        <ProfilePanel user={userProfile} />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 mb-10">
        <MatchStatistics userId={userProfile.id} />
        <RecentActivity userId={userProfile.id} />
      </div>

      <Tabs defaultValue="recommended" className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Discover Matches</h2>
          <TabsList className="grid grid-cols-3 w-[300px]">
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="recommended" className="mt-0">
          <Suspense fallback={<div className="h-80 w-full bg-muted/50 animate-pulse rounded-xl"></div>}>
            <MatchCarousel matches={matchRecommendations} />
          </Suspense>
        </TabsContent>

        <TabsContent value="new" className="mt-0">
          <Suspense fallback={<div className="h-80 w-full bg-muted/50 animate-pulse rounded-xl"></div>}>
            <MatchCarousel matches={matchRecommendations.slice(2, 5)} />
          </Suspense>
        </TabsContent>

        <TabsContent value="saved" className="mt-0">
          <Suspense fallback={<div className="h-80 w-full bg-muted/50 animate-pulse rounded-xl"></div>}>
            <MatchCarousel matches={matchRecommendations.slice(0, 2)} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </main>
  )
}
