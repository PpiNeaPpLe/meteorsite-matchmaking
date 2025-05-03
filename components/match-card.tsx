"use client"

import type { Match } from "@/lib/types"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { BookmarkIcon, XIcon, HelpCircleIcon, HeartIcon, MessageSquareIcon } from "lucide-react"
import { useState } from "react"

interface MatchCardProps {
  match: Match
  onViewReasoning: () => void
  onSave: () => void
  onExclude: () => void
}

export default function MatchCard({ match, onViewReasoning, onSave, onExclude }: MatchCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(!isSaved)
    onSave()
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={item} whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="h-full">
      <Card className="w-[300px] shadow-lg border-0 bg-card/90 backdrop-blur-sm overflow-hidden h-full flex flex-col">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
          <img
            src={match.profilePhoto || "/placeholder.svg"}
            alt={match.name}
            className="w-full h-[240px] object-cover"
          />
          <div className="absolute bottom-3 left-3 z-20 text-white">
            <h3 className="text-xl font-semibold">
              {match.name}, {match.age}
            </h3>
            <p className="text-sm text-white/80">{match.location}</p>
          </div>
          <div className="absolute top-3 right-3 z-20">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0">
              {match.matchScore}% Match
            </Badge>
          </div>
          <div className="absolute top-3 left-3 z-20">
            {match.isNew && (
              <Badge variant="outline" className="bg-background/30 backdrop-blur-sm text-white border-0">
                New
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4 flex-grow">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="text-xs">
              {match.orientation}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {match.ethnicity}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {match.religion}
            </Badge>
            {match.hasKids && (
              <Badge variant="outline" className="text-xs">
                Has Kids
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{match.bio}</p>

          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm" className="flex-1 gap-1 h-8" onClick={() => {}}>
              <HeartIcon className="h-3.5 w-3.5" />
              Like
            </Button>
            <Button variant="outline" size="sm" className="flex-1 gap-1 h-8" onClick={() => {}}>
              <MessageSquareIcon className="h-3.5 w-3.5" />
              Chat
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full flex items-center gap-2 text-sm"
            onClick={onViewReasoning}
          >
            <HelpCircleIcon className="h-4 w-4" />
            Why this match?
          </Button>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            variant={isSaved ? "default" : "outline"}
            size="sm"
            className={`flex-1 ${isSaved ? "bg-purple-500 hover:bg-purple-600" : ""}`}
            onClick={handleSave}
          >
            <BookmarkIcon className="h-4 w-4 mr-1" />
            {isSaved ? "Saved" : "Save"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={onExclude}
          >
            <XIcon className="h-4 w-4 mr-1" />
            Exclude
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
