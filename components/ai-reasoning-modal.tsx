"use client"

import type { Match } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AIReasoningModalProps {
  match: Match | null
  isOpen: boolean
  onClose: () => void
}

export default function AIReasoningModal({ match, isOpen, onClose }: AIReasoningModalProps) {
  if (!match) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-purple-500 to-pink-500">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/70 to-transparent">
                <DialogTitle className="text-xl text-white">Match Insights</DialogTitle>
                <DialogDescription className="text-white/80">
                  Why we think {match.name} might be a good match for you
                </DialogDescription>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-100">
                  <img
                    src={match.profilePhoto || "/placeholder.svg"}
                    alt={match.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {match.name}, {match.age}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 border-0">
                      {match.matchScore}% Match
                    </Badge>
                    <p className="text-sm text-muted-foreground">{match.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3 text-purple-600">Key Compatibility Factors:</h4>
                  <ul className="space-y-3 text-sm">
                    {match.reasoningPoints.map((point, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-md bg-muted/50"
                      >
                        <span className="text-purple-500 font-bold mt-0.5">•</span>
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-purple-600">AI Explanation:</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md">{match.aiExplanation}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-purple-600">Compatibility Score Breakdown:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {match.compatibilityScores?.map((score, index) => (
                      <div key={index} className="bg-muted/50 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium">{score.category}</span>
                          <span className="text-xs font-bold">{score.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
                            style={{ width: `${score.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-6 pt-0">
              <Button onClick={onClose}>Close</Button>
              <Button variant="outline" onClick={() => window.open(`/profile/${match.id}`, "_blank")}>
                View Full Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
