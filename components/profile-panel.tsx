import type { User } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckIcon, XIcon, EditIcon, HeartIcon, MessageSquareIcon } from "lucide-react"
import ProfileAttributes from "@/components/profile-attributes"

interface ProfilePanelProps {
  user: User
}

export default function ProfilePanel({ user }: ProfilePanelProps) {
  return (
    <Card className="w-full overflow-hidden shadow-lg border-0 bg-card/90 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/3 h-80 md:h-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 md:hidden" />
            <img src={user.profilePhoto || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-4 right-4 z-20 md:hidden">
              <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                <EditIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 md:p-8 w-full md:w-2/3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="md:hidden w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img
                    src={user.profilePhoto || "/placeholder.svg"}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {user.name}, {user.age}
                    </h2>
                    <div className="hidden md:flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <EditIcon className="h-4 w-4" /> Edit
                      </Button>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{user.location}</p>
                </div>
              </div>

              <Tabs defaultValue="about" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="mt-4">
                  <p className="text-muted-foreground mb-4">{user.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="px-3 py-1">
                      {user.religion}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      {user.orientation}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      {user.ethnicity}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 flex items-center gap-1">
                      Has Kids
                      {user.hasKids ? (
                        <CheckIcon className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <XIcon className="h-3.5 w-3.5 text-red-500" />
                      )}
                    </Badge>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileAttributes
                      attributes={[
                        {
                          label: "Age Range",
                          value: `${user.preferences?.ageMin || "25"}-${user.preferences?.ageMax || "40"}`,
                        },
                        { label: "Height", value: user.preferences?.height || "Any" },
                        { label: "Body Type", value: user.preferences?.bodyType || "Any" },
                        { label: "Education", value: user.preferences?.education || "Any" },
                      ]}
                    />
                    <ProfileAttributes
                      attributes={[
                        { label: "Religion", value: user.preferences?.religion || "Any" },
                        { label: "Has Kids", value: user.preferences?.hasKids || "No Preference" },
                        { label: "Ethnicity", value: user.preferences?.ethnicity || "Any" },
                        { label: "Distance", value: user.preferences?.distance || "50 miles" },
                      ]}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileAttributes
                      attributes={[
                        { label: "Height", value: user.details?.height || "5'10\"" },
                        { label: "Body Type", value: user.details?.bodyType || "Athletic" },
                        { label: "Education", value: user.details?.education || "Bachelor's" },
                        { label: "Occupation", value: user.details?.occupation || "Software Engineer" },
                      ]}
                    />
                    <ProfileAttributes
                      attributes={[
                        { label: "Pets", value: user.details?.pets || "Dog lover" },
                        { label: "Drinking", value: user.details?.drinking || "Social drinker" },
                        { label: "Smoking", value: user.details?.smoking || "Non-smoker" },
                        { label: "Exercise", value: user.details?.exercise || "Regular" },
                      ]}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex gap-3 mt-6">
              <Button className="flex-1 gap-2">
                <HeartIcon className="h-4 w-4" /> Find Matches
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <MessageSquareIcon className="h-4 w-4" /> Messages
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
