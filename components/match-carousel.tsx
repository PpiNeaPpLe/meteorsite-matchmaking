"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Match } from "@/lib/types"
import MatchCard from "@/components/match-card"
import AIReasoningModal from "@/components/ai-reasoning-modal"
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { saveMatch, excludeMatch } from "@/lib/match-service"

interface MatchCarouselProps {
  matches: Match[]
}

export default function MatchCarousel({ matches }: MatchCarouselProps) {
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [visibleMatches, setVisibleMatches] = useState<Match[]>(matches)
  const [filters, setFilters] = useState({
    religion: false,
    hasKids: false,
    minAge: false,
  })
  const carouselRef = useRef<HTMLDivElement>(null)

  const handleOpenModal = (match: Match) => {
    setCurrentMatch(match)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSaveMatch = async (matchId: string) => {
    try {
      await saveMatch(matchId)
      // Show success notification or update UI
    } catch (error) {
      console.error("Error saving match:", error)
    }
  }

  const handleExcludeMatch = async (matchId: string) => {
    try {
      await excludeMatch(matchId)
      setVisibleMatches(visibleMatches.filter((match) => match.id !== matchId))
    } catch (error) {
      console.error("Error excluding match:", error)
    }
  }

  const applyFilters = () => {
    let filtered = [...matches]

    if (filters.religion) {
      filtered = filtered.filter((match) => match.religion === "Spiritual")
    }

    if (filters.hasKids) {
      filtered = filtered.filter((match) => !match.hasKids)
    }

    if (filters.minAge) {
      filtered = filtered.filter((match) => match.age >= 30)
    }

    setVisibleMatches(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [filters])

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: "smooth" })
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">Showing {visibleMatches.length} potential matches</p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Matches</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.religion}
              onCheckedChange={(checked) => setFilters({ ...filters, religion: checked })}
            >
              Spiritual Only
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.hasKids}
              onCheckedChange={(checked) => setFilters({ ...filters, hasKids: checked })}
            >
              No Kids
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.minAge}
              onCheckedChange={(checked) => setFilters({ ...filters, minAge: checked })}
            >
              30+ Years Old
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <div ref={carouselRef} className="flex overflow-x-auto gap-4 pb-6 pt-2 snap-x snap-mandatory hide-scrollbar">
        <AnimatePresence>
          <motion.div className="flex gap-4" variants={container} initial="hidden" animate="show">
            {visibleMatches.length > 0 ? (
              visibleMatches.map((match) => (
                <div key={match.id} className="snap-start">
                  <MatchCard
                    match={match}
                    onViewReasoning={() => handleOpenModal(match)}
                    onSave={() => handleSaveMatch(match.id)}
                    onExclude={() => handleExcludeMatch(match.id)}
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center w-full min-h-[300px]">
                <p className="text-muted-foreground">No matches found with current filters</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background"
          onClick={scrollRight}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <AIReasoningModal match={currentMatch} isOpen={isModalOpen} onClose={handleCloseModal} />

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
