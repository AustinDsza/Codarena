"use client"

import { useState, useEffect } from "react"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard } from "@/components/ui/material-card"
import { MaterialBadge } from "@/components/ui/material-badge"
import {
  Code2,
  Trophy,
  Timer,
  Target,
  User,
  Users,
  Clock,
  ArrowLeft,
  Play,
  Share2,
  BookOpen,
  Copy,
  CheckCircle,
  Crown,
  Medal,
  Award,
  Star,
  Gift,
  Wallet,
  AlertCircle,
  Brain,
  Zap,
  Paintbrush,
  FileText,
  Music,
  Palette,
  HelpCircle,
  Lightbulb,
  Shield,
  Camera,
  Monitor,
  Mic,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWallet } from "@/lib/wallet-context"

// Mock contest data - in real app, this would come from API
const getContestById = (id: string) => {
  const contests = {
    "live-dsa-urgent": {
      id: "live-dsa-urgent",
      title: "🔥 Lightning DSA Challenge",
      description: "Quick-fire coding challenge starting any moment! Perfect for testing your speed and accuracy.",
      type: "dsa",
      category: "small-league",
      creator: "Speed Coders",
      participants: 21,
      maxParticipants: 25,
      prizePool: 1900,
      totalCollected: 2000,
      platformFee: 100,
      entryFee: 80,
      prizeType: "cash",
      difficulty: "intermediate",
      duration: "45 minutes",
      startTime: new Date(Date.now() + 1.5 * 60 * 1000), // 1.5 minutes from now
      tags: ["Lightning Round", "Quick", "High Stakes"],
      featured: true,
      isLive: true,
      showTimer: true,
      prizeDistribution: [
        { position: "1st", percentage: 50, amount: 950, count: 1 },
        { position: "2nd", percentage: 30, amount: 570, count: 1 },
        { position: "3rd", percentage: 20, amount: 380, count: 1 },
      ],
      problems: [
        { id: 1, title: "Array Manipulation", difficulty: "Medium", points: 200 },
        { id: 2, title: "String Algorithms", difficulty: "Medium", points: 250 },
        { id: 3, title: "Graph Traversal", difficulty: "Hard", points: 300 },
      ],
      rules: [
        "Contest duration is 45 minutes",
        "3 problems to solve in order of difficulty",
        "Partial scoring available for incomplete solutions",
        "No external resources allowed",
        "Plagiarism will result in disqualification",
      ],
      inviteCode: "LIGHTNING2024",
    },
    "practice-dsa-1": {
      id: "practice-dsa-1",
      title: "🎯 DSA Practice Arena",
      description: "Perfect for beginners! Practice algorithmic problems with zero pressure and instant feedback.",
      type: "dsa",
      category: "practice",
      creator: "Codarena Team",
      participants: 234,
      maxParticipants: 500,
      entryFee: 0,
      prizeType: "free",
      difficulty: "beginner",
      duration: "1 hour",
      startTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      tags: ["Practice", "Free", "Beginner Friendly"],
      featured: true,
      showTimer: true,
      completionRate: 85,
      averageScore: 72,
      learningBenefits: ["Skill Assessment", "Progress Tracking", "Performance Analytics"],
      problems: [
        { id: 1, title: "Two Sum", difficulty: "Easy", points: 100, type: "coding" },
        { id: 2, title: "Valid Parentheses", difficulty: "Easy", points: 100, type: "coding" },
        { id: 3, title: "Merge Two Sorted Lists", difficulty: "Easy", points: 150, type: "coding" },
      ],
      rules: [
        "Practice mode with unlimited time",
        "3 beginner-friendly problems",
        "Hints and solutions available",
        "No time pressure or penalties",
        "Focus on learning and improvement",
      ],
      inviteCode: "PRACTICE2024",
    },
    "practice-logic-1": {
      id: "practice-logic-1",
      title: "🧠 Logic Warm-up Challenge",
      description: "Sharpen your logical thinking with this free practice quiz. No stakes, just pure learning!",
      type: "logic",
      category: "practice",
      creator: "Logic Masters",
      participants: 189,
      maxParticipants: 300,
      entryFee: 0,
      prizeType: "free",
      difficulty: "beginner",
      duration: "30 minutes",
      tags: ["Practice", "Logic", "Quick"],
      featured: true,
      completionRate: 92,
      averageScore: 78,
      learningBenefits: ["Skill Assessment", "Progress Tracking", "Performance Analytics"],
      problems: [
        { id: 1, title: "Pattern Recognition", difficulty: "Easy", points: 100, type: "mcq", options: 4 },
        { id: 2, title: "Logical Sequences", difficulty: "Easy", points: 100, type: "mcq", options: 4 },
        { id: 3, title: "Analytical Reasoning", difficulty: "Easy", points: 150, type: "puzzle" },
      ],
      rules: [
        "30-minute logic challenge",
        "3 pattern recognition problems",
        "Multiple choice and puzzle-based questions",
        "Immediate feedback on answers",
        "Practice mode with learning focus",
      ],
      inviteCode: "LOGIC2024",
    },
    "practice-uiux-1": {
      id: "practice-uiux-1",
      title: "🎨 UI/UX Design Fundamentals",
      description: "Learn design principles through hands-on practice. Perfect for aspiring designers!",
      type: "ui-ux",
      category: "practice",
      creator: "Design Academy",
      participants: 156,
      maxParticipants: 250,
      entryFee: 0,
      prizeType: "free",
      difficulty: "beginner",
      duration: "45 minutes",
      tags: ["Practice", "Design", "Creative"],
      featured: true,
      completionRate: 88,
      averageScore: 75,
      learningBenefits: ["Design Skills", "Portfolio Building", "Creative Thinking"],
      problems: [
        {
          id: 1,
          title: "Color Theory Basics",
          difficulty: "Easy",
          points: 100,
          type: "design",
          deliverable: "Color palette",
        },
        {
          id: 2,
          title: "Typography Principles",
          difficulty: "Easy",
          points: 100,
          type: "design",
          deliverable: "Font selection",
        },
        {
          id: 3,
          title: "Layout Design",
          difficulty: "Easy",
          points: 150,
          type: "design",
          deliverable: "Wireframe mockup",
        },
      ],
      rules: [
        "45-minute design challenge",
        "3 design principle tasks",
        "Visual design and theory questions",
        "Portfolio-building exercises",
        "Creative problem-solving focus",
      ],
      inviteCode: "DESIGN2024",
    },
    "practice-vibe-1": {
      id: "practice-vibe-1",
      title: "🎵 Rhythm Coding Jam",
      description: "Code to the beat! Creative coding challenge with live music. Join anytime!",
      type: "vibe-coding",
      category: "practice",
      creator: "Vibe Collective",
      participants: 47,
      maxParticipants: 50,
      entryFee: 0,
      prizeType: "free",
      difficulty: "beginner",
      duration: "1 hour",
      tags: ["Vibe Coding", "Music", "Creative"],
      featured: true,
      completionRate: 92,
      averageScore: 85,
      learningBenefits: ["Creative Thinking", "Music Integration", "Fun Learning"],
      problems: [
        {
          id: 1,
          title: "Rhythm Pattern Generator",
          difficulty: "Easy",
          points: 100,
          type: "creative",
          theme: "Music visualization",
        },
        {
          id: 2,
          title: "Music Visualizer",
          difficulty: "Easy",
          points: 150,
          type: "creative",
          theme: "Audio processing",
        },
        {
          id: 3,
          title: "Beat Matching Algorithm",
          difficulty: "Medium",
          points: 200,
          type: "creative",
          theme: "Rhythm analysis",
        },
      ],
      rules: [
        "1-hour creative coding session",
        "Music-themed programming challenges",
        "Creative expression encouraged",
        "Collaborative coding environment",
        "Fun and experimental approach",
      ],
      inviteCode: "VIBE2024",
    },
    // Adding missing contest definitions
    "beginner-dsa-1": {
      id: "beginner-dsa-1",
      title: "🌟 First Steps Coding Contest",
      description: "Your first paid contest! Beginner-friendly problems with encouraging rewards and low entry fee.",
      type: "dsa",
      category: "beginner-special",
      creator: "Beginner's Hub",
      participants: 67,
      maxParticipants: 100,
      prizePool: 1425,
      totalCollected: 1500,
      platformFee: 75,
      entryFee: 15,
      prizeType: "cash",
      difficulty: "beginner",
      duration: "1.5 hours",
      tags: ["Beginner Special", "Low Entry", "Encouraging"],
      featured: true,
      prizeDistribution: [
        { position: "1st", percentage: 40, amount: 570, count: 1 },
        { position: "2nd", percentage: 25, amount: 356, count: 1 },
        { position: "3rd", percentage: 20, amount: 285, count: 1 },
        { position: "4th-10th", percentage: 15, amount: 30, count: 7 },
      ],
      problems: [
        { id: 1, title: "Array Sum", difficulty: "Easy", points: 100, type: "coding" },
        { id: 2, title: "String Reverse", difficulty: "Easy", points: 100, type: "coding" },
        { id: 3, title: "Find Maximum", difficulty: "Easy", points: 150, type: "coding" },
        { id: 4, title: "Count Vowels", difficulty: "Easy", points: 150, type: "coding" },
      ],
      rules: [
        "1.5-hour beginner-friendly contest",
        "4 easy-level problems",
        "Step-by-step problem progression",
        "Encouraging environment for newcomers",
        "Low entry fee with good rewards",
      ],
      inviteCode: "BEGINNER2024",
    },
    "beginner-logic-1": {
      id: "beginner-logic-1",
      title: "🎓 Logic Builder Challenge",
      description: "Build your logical thinking skills with this beginner-friendly contest. Great for newcomers!",
      type: "logic",
      category: "beginner-special",
      creator: "Logic Academy",
      participants: 43,
      maxParticipants: 60,
      prizePool: 570,
      totalCollected: 600,
      platformFee: 30,
      entryFee: 10,
      prizeType: "cash",
      difficulty: "beginner",
      duration: "45 minutes",
      tags: ["Beginner Special", "Logic", "Affordable"],
      featured: true,
      prizeDistribution: [
        { position: "1st", percentage: 40, amount: 228, count: 1 },
        { position: "2nd-3rd", percentage: 35, amount: 99, count: 2 },
        { position: "4th-8th", percentage: 25, amount: 28, count: 5 },
      ],
      problems: [
        { id: 1, title: "Number Patterns", difficulty: "Easy", points: 100, type: "mcq", options: 4 },
        { id: 2, title: "Logic Puzzles", difficulty: "Easy", points: 120, type: "mcq", options: 4 },
        { id: 3, title: "Reasoning Questions", difficulty: "Easy", points: 150, type: "puzzle" },
      ],
      rules: [
        "45-minute logic building contest",
        "3 reasoning and pattern problems",
        "Beginner-friendly difficulty",
        "Affordable entry with fair rewards",
        "Focus on logical thinking development",
      ],
      inviteCode: "LOGICBUILD2024",
    },
    "beginner-vibe-1": {
      id: "beginner-vibe-1",
      title: "🎵 Vibe Coding Jam Session",
      description: "Code to the rhythm! A unique coding experience with music and creative challenges.",
      type: "vibe-coding",
      category: "beginner-special",
      creator: "Vibe Coders",
      participants: 45,
      maxParticipants: 80,
      prizePool: 760,
      totalCollected: 800,
      platformFee: 40,
      entryFee: 10,
      prizeType: "cash",
      difficulty: "beginner",
      duration: "2 hours",
      tags: ["Vibe Coding", "Creative", "Music"],
      featured: true,
      prizeDistribution: [
        { position: "1st", percentage: 35, amount: 266, count: 1 },
        { position: "2nd-5th", percentage: 40, amount: 76, count: 4 },
        { position: "6th-10th", percentage: 25, amount: 38, count: 5 },
      ],
      problems: [
        {
          id: 1,
          title: "Rhythm Pattern Generator",
          difficulty: "Easy",
          points: 100,
          type: "creative",
          theme: "Music visualization",
        },
        {
          id: 2,
          title: "Music Visualizer",
          difficulty: "Easy",
          points: 150,
          type: "creative",
          theme: "Audio processing",
        },
        {
          id: 3,
          title: "Beat Matching Algorithm",
          difficulty: "Medium",
          points: 200,
          type: "creative",
          theme: "Rhythm analysis",
        },
      ],
      rules: [
        "2-hour creative coding jam",
        "Music-themed programming challenges",
        "Beginner-friendly with creative focus",
        "Collaborative and fun environment",
        "Unique vibe coding experience",
      ],
      inviteCode: "VIBEJAM2024",
    },
    "small-league-dsa-1": {
      id: "small-league-dsa-1",
      title: "⚔️ Elite Coders Circle",
      description: "Exclusive small group competition! Only 25 spots available for this intense coding battle.",
      type: "dsa",
      category: "small-league",
      creator: "Elite Coding Club",
      participants: 23,
      maxParticipants: 25,
      prizePool: 2375,
      totalCollected: 2500,
      platformFee: 125,
      entryFee: 100,
      prizeType: "cash",
      difficulty: "intermediate",
      duration: "2 hours",
      tags: ["Small League", "Exclusive", "Elite"],
      featured: true,
      prizeDistribution: [
        { position: "1st", percentage: 50, amount: 1187, count: 1 },
        { position: "2nd", percentage: 30, amount: 712, count: 1 },
        { position: "3rd", percentage: 20, amount: 475, count: 1 },
      ],
      problems: [
        { id: 1, title: "Advanced Graph Algorithms", difficulty: "Medium", points: 200, type: "coding" },
        { id: 2, title: "Dynamic Programming Challenge", difficulty: "Medium", points: 250, type: "coding" },
        { id: 3, title: "Tree Traversal Optimization", difficulty: "Hard", points: 300, type: "coding" },
      ],
      rules: [
        "2-hour elite coding competition",
        "3 intermediate to advanced problems",
        "Limited to 25 participants only",
        "High-quality problem set",
        "Exclusive small group experience",
      ],
      inviteCode: "ELITE2024",
    },
    "small-league-logic-1": {
      id: "small-league-logic-1",
      title: "🏆 Logic Masters League",
      description: "Special small league for logic enthusiasts. Intimate competition with high-quality questions.",
      type: "logic",
      category: "small-league",
      creator: "Logic League Pro",
      participants: 18,
      maxParticipants: 20,
      prizePool: 1425,
      totalCollected: 1500,
      platformFee: 75,
      entryFee: 75,
      prizeType: "cash",
      difficulty: "intermediate",
      duration: "45 minutes",
      tags: ["Small League", "Logic Focus", "Premium"],
      featured: true,
      prizeDistribution: [
        { position: "1st", percentage: 45, amount: 641, count: 1 },
        { position: "2nd", percentage: 30, amount: 427, count: 1 },
        { position: "3rd", percentage: 25, amount: 356, count: 1 },
      ],
      problems: [
        { id: 1, title: "Advanced Logic Puzzles", difficulty: "Medium", points: 200, type: "mcq", options: 4 },
        { id: 2, title: "Mathematical Reasoning", difficulty: "Medium", points: 250, type: "mcq", options: 4 },
        { id: 3, title: "Abstract Problem Solving", difficulty: "Hard", points: 300, type: "puzzle" },
      ],
      rules: [
        "45-minute logic masters competition",
        "3 advanced reasoning problems",
        "Limited to 20 participants",
        "Premium logic challenge experience",
        "High-quality problem curation",
      ],
      inviteCode: "LOGICMASTERS2024",
    },
    "small-league-uiux-1": {
      id: "small-league-uiux-1",
      title: "🎨 Designer's Elite Challenge",
      description: "Premium design contest for creative professionals. Limited spots, high-quality judging.",
      type: "ui-ux",
      category: "small-league",
      creator: "Design Elite Pro",
      participants: 15,
      maxParticipants: 20,
      prizePool: 1900,
      totalCollected: 2000,
      platformFee: 100,
      entryFee: 100,
      prizeType: "cash",
      difficulty: "intermediate",
      duration: "3 hours",
      tags: ["Small League", "Design", "Premium"],
      featured: true,
      prizeDistribution: [
        { position: "1st", percentage: 50, amount: 950, count: 1 },
        { position: "2nd", percentage: 30, amount: 570, count: 1 },
        { position: "3rd", percentage: 20, amount: 380, count: 1 },
      ],
      problems: [
        {
          id: 1,
          title: "Mobile App Redesign",
          difficulty: "Medium",
          points: 200,
          type: "design",
          deliverable: "App mockup",
        },
        {
          id: 2,
          title: "User Experience Flow",
          difficulty: "Medium",
          points: 250,
          type: "design",
          deliverable: "UX wireframes",
        },
        {
          id: 3,
          title: "Design System Creation",
          difficulty: "Hard",
          points: 300,
          type: "design",
          deliverable: "Design system",
        },
      ],
      rules: [
        "3-hour premium design challenge",
        "3 professional design tasks",
        "Limited to 20 creative professionals",
        "High-quality judging criteria",
        "Portfolio-worthy design challenges",
      ],
      inviteCode: "DESIGNELITE2024",
    },
    "mega-contest-1": {
      id: "mega-contest-1",
      title: "🚀 Grand Championship Arena",
      description:
        "The ultimate coding championship! Massive prize pool with hundreds of participants competing for glory.",
      type: "dsa",
      category: "mega-contest",
      creator: "Codarena Championship",
      participants: 487,
      maxParticipants: 500,
      prizePool: 47500,
      totalCollected: 50000,
      platformFee: 2500,
      entryFee: 100,
      prizeType: "cash",
      difficulty: "advanced",
      duration: "4 hours",
      tags: ["Mega Contest", "Championship", "Massive Prize"],
      featured: true,
      prizeDistribution: [
        { position: "1st", percentage: 20, amount: 9500, count: 1 },
        { position: "2nd", percentage: 15, amount: 7125, count: 1 },
        { position: "3rd", percentage: 10, amount: 4750, count: 1 },
        { position: "4th-10th", percentage: 25, amount: 1785, count: 7 },
        { position: "11th-50th", percentage: 30, amount: 356, count: 40 },
      ],
      problems: [
        { id: 1, title: "Advanced Algorithm Design", difficulty: "Hard", points: 300, type: "coding" },
        { id: 2, title: "System Design Challenge", difficulty: "Hard", points: 400, type: "coding" },
        { id: 3, title: "Optimization Problem", difficulty: "Expert", points: 500, type: "coding" },
        { id: 4, title: "Competitive Programming", difficulty: "Expert", points: 600, type: "coding" },
      ],
      rules: [
        "4-hour championship competition",
        "4 advanced to expert level problems",
        "Massive 500-participant contest",
        "Highest prize pool available",
        "Ultimate coding championship experience",
      ],
      inviteCode: "GRANDCHAMP2024",
    },
    "mega-vibe-1": {
      id: "mega-vibe-1",
      title: "🎶 Global Vibe Coding Festival",
      description: "The world's largest vibe coding event! Creative challenges with music from around the globe.",
      type: "vibe-coding",
      category: "mega-contest",
      creator: "Global Vibe Network",
      participants: 298,
      maxParticipants: 350,
      prizePool: 16625,
      totalCollected: 17500,
      platformFee: 875,
      entryFee: 50,
      prizeType: "cash",
      difficulty: "intermediate",
      duration: "3 hours",
      tags: ["Mega Contest", "Vibe Coding", "Global"],
      featured: true,
      prizeDistribution: [
        { position: "1st", percentage: 25, amount: 4156, count: 1 },
        { position: "2nd-5th", percentage: 30, amount: 1247, count: 4 },
        { position: "6th-20th", percentage: 45, amount: 499, count: 15 },
      ],
      problems: [
        {
          id: 1,
          title: "Global Music Mixer",
          difficulty: "Medium",
          points: 200,
          type: "creative",
          theme: "World music",
        },
        {
          id: 2,
          title: "Cultural Beat Synthesis",
          difficulty: "Medium",
          points: 250,
          type: "creative",
          theme: "Cultural fusion",
        },
        {
          id: 3,
          title: "Interactive Sound Canvas",
          difficulty: "Hard",
          points: 350,
          type: "creative",
          theme: "Interactive audio",
        },
      ],
      rules: [
        "3-hour global vibe coding festival",
        "3 music and culture themed challenges",
        "350 participants from around the world",
        "Creative and collaborative environment",
        "Celebration of global coding culture",
      ],
      inviteCode: "GLOBALVIBE2024",
    },
    "high-roller-dsa-1": {
      id: "high-roller-dsa-1",
      title: "💎 Diamond League Challenge",
      description: "Ultra-premium contest for coding elites. Advanced algorithms, high stakes, massive rewards!",
      type: "dsa",
      category: "high-roller",
      creator: "Diamond Coders Elite",
      participants: 34,
      maxParticipants: 50,
      prizePool: 23750,
      totalCollected: 25000,
      platformFee: 1250,
      entryFee: 500,
      prizeType: "cash",
      difficulty: "expert",
      duration: "3 hours",
      tags: ["High Roller", "Elite", "Premium"],
      featured: true,
      prizeDistribution: [
        { position: "1st", percentage: 40, amount: 9500, count: 1 },
        { position: "2nd", percentage: 25, amount: 5937, count: 1 },
        { position: "3rd", percentage: 20, amount: 4750, count: 1 },
        { position: "4th-5th", percentage: 15, amount: 1781, count: 2 },
      ],
      problems: [
        { id: 1, title: "Elite Algorithm Mastery", difficulty: "Expert", points: 500, type: "coding" },
        { id: 2, title: "Advanced Data Structures", difficulty: "Expert", points: 600, type: "coding" },
        { id: 3, title: "Computational Complexity", difficulty: "Expert", points: 700, type: "coding" },
      ],
      rules: [
        "3-hour diamond league competition",
        "3 expert-level algorithm challenges",
        "Ultra-premium contest experience",
        "Highest difficulty and rewards",
        "Elite coding professionals only",
      ],
      inviteCode: "DIAMOND2024",
    },
    "high-roller-logic-1": {
      id: "high-roller-logic-1",
      title: "🧠 Mastermind Elite Series",
      description: "The most challenging logic contest for intellectual giants. High entry, higher rewards!",
      type: "logic",
      category: "high-roller",
      creator: "Mastermind Society",
      participants: 28,
      maxParticipants: 40,
      prizePool: 9500,
      totalCollected: 10000,
      platformFee: 500,
      entryFee: 250,
      prizeType: "cash",
      difficulty: "expert",
      duration: "90 minutes",
      tags: ["High Roller", "Logic", "Elite"],
      featured: true,
      prizeDistribution: [
        { position: "1st", percentage: 50, amount: 4750, count: 1 },
        { position: "2nd", percentage: 30, amount: 2850, count: 1 },
        { position: "3rd", percentage: 20, amount: 1900, count: 1 },
      ],
      problems: [
        { id: 1, title: "Advanced Logic Puzzles", difficulty: "Expert", points: 400, type: "mcq", options: 4 },
        { id: 2, title: "Mathematical Reasoning", difficulty: "Expert", points: 500, type: "mcq", options: 4 },
        { id: 3, title: "Abstract Problem Solving", difficulty: "Expert", points: 600, type: "puzzle" },
      ],
      rules: [
        "90-minute mastermind challenge",
        "3 expert-level logic problems",
        "Intellectual giants competition",
        "Highest logic difficulty available",
        "Premium rewards for top performers",
      ],
      inviteCode: "MASTERMIND2024",
    },
  }

  return contests[id as keyof typeof contests] || null
}

// Permission Request Dialog (For DSA and Logic contests)
function PermissionRequestDialog({
  isOpen,
  onClose,
  onConfirm,
  isRequesting,
  contestType,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isRequesting: boolean
  contestType: string
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-600" />
            Contest Security Setup
          </DialogTitle>
          <DialogDescription>
            {contestType === "logic"
              ? "To ensure fair play during the quiz, we need to enable monitoring."
              : "To ensure fair play and prevent cheating, we need to enable monitoring during the contest."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Required Permissions */}
          <MaterialCard elevation={1} className="p-4 bg-blue-50">
            <h4 className="font-medium text-blue-900 mb-3">Required Permissions</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Camera Access</p>
                  <p className="text-sm text-blue-700">
                    {contestType === "logic"
                      ? "Monitor for suspicious activity during the quiz"
                      : "Monitor for suspicious activity during the contest"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Screen Recording</p>
                  <p className="text-sm text-blue-700">Detect tab switching and external resource usage</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mic className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Microphone Access</p>
                  <p className="text-sm text-blue-700">Audio monitoring for communication detection</p>
                </div>
              </div>
            </div>
          </MaterialCard>

          {/* Security Notice */}
          <MaterialCard elevation={1} className="p-4 bg-yellow-50">
            <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Privacy & Security Notice
            </h4>
            <div className="space-y-2 text-sm text-yellow-800">
              <p>• All monitoring data is encrypted and secure</p>
              <p>• Data is only used for contest integrity purposes</p>
              <p>• Recordings are automatically deleted after 30 days</p>
              <p>• No personal data is stored or shared</p>
            </div>
          </MaterialCard>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <MaterialButton variant="outlined" onClick={onClose} className="flex-1" disabled={isRequesting}>
              Cancel
            </MaterialButton>
            <MaterialButton
              onClick={onConfirm}
              disabled={isRequesting}
              className="flex-1"
              startIcon={
                isRequesting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )
              }
            >
              {isRequesting ? "Requesting..." : "Grant Permissions"}
            </MaterialButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Invite Friends Dialog
function InviteFriendsDialog({
  contest,
  isOpen,
  onClose,
}: {
  contest: any
  isOpen: boolean
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  if (!contest) return null

  const contestUrl = `${window.location.origin}/contest/${contest.id}`
  const inviteMessage = `🚀 Join me in "${contest.title}"!\n\n${contest.description}\n\nContest Code: ${contest.inviteCode}\nDirect Link: ${contestUrl}\n\n#Codarena #CodingContest`

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(contestUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(contest.inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(inviteMessage)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(inviteMessage)}`
    window.open(twitterUrl, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Share2 className="h-6 w-6 text-blue-600" />
            Invite Friends
          </DialogTitle>
          <DialogDescription>Share this contest with your friends and compete together!</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contest Info */}
          <MaterialCard elevation={1} className="p-4 bg-blue-50">
            <h4 className="font-medium text-blue-900 mb-2">{contest.title}</h4>
            <div className="space-y-1 text-sm">
              <p className="text-blue-800">Duration: {contest.duration}</p>
              <p className="text-blue-800">Difficulty: {contest.difficulty}</p>
              <p className="text-blue-800">
                {contest.prizeType === "cash" ? `Entry Fee: ₹${contest.entryFee}` : "Free Practice"}
              </p>
            </div>
          </MaterialCard>

          {/* Invite Code */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Contest Code</label>
            <div className="flex gap-2">
              <input
                value={contest.inviteCode}
                readOnly
                className="flex-1 font-mono px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
              <MaterialButton
                variant="outlined"
                size="medium"
                onClick={handleCopyCode}
                startIcon={copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              >
                {copied ? "Copied!" : "Copy"}
              </MaterialButton>
            </div>
          </div>

          {/* Direct Link */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Direct Link</label>
            <div className="flex gap-2">
              <input
                value={contestUrl}
                readOnly
                className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
              <MaterialButton
                variant="outlined"
                size="medium"
                onClick={handleCopyLink}
                startIcon={copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              >
                {copied ? "Copied!" : "Copy"}
              </MaterialButton>
            </div>
          </div>

          {/* Social Share */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">Share on Social Media</label>
            <div className="grid grid-cols-2 gap-3">
              <MaterialButton
                variant="outlined"
                onClick={handleShareWhatsApp}
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                WhatsApp
              </MaterialButton>
              <MaterialButton
                variant="outlined"
                onClick={handleShareTwitter}
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                Twitter
              </MaterialButton>
            </div>
          </div>

          <MaterialButton onClick={onClose} fullWidth>
            Done
          </MaterialButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Contest Rules Dialog
function ContestRulesDialog({
  contest,
  isOpen,
  onClose,
}: {
  contest: any
  isOpen: boolean
  onClose: () => void
}) {
  if (!contest) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Contest Rules
          </DialogTitle>
          <DialogDescription>Important guidelines for "{contest.title}"</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contest Overview */}
          <MaterialCard elevation={1} className="p-4 bg-blue-50">
            <h4 className="font-medium text-blue-900 mb-3">Contest Overview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-800">Duration:</span>
                <span className="font-medium text-blue-900">{contest.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Problems:</span>
                <span className="font-medium text-blue-900">{contest.problems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Difficulty:</span>
                <span className="font-medium text-blue-900 capitalize">{contest.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Type:</span>
                <span className="font-medium text-blue-900 uppercase">{contest.type}</span>
              </div>
            </div>
          </MaterialCard>

          {/* Rules List */}
          <MaterialCard elevation={1} className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">Contest Rules</h4>
            <div className="space-y-3">
              {contest.rules.map((rule: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{rule}</p>
                </div>
              ))}
            </div>
          </MaterialCard>

          {/* General Guidelines */}
          <MaterialCard elevation={1} className="p-4 bg-yellow-50">
            <h4 className="font-medium text-yellow-900 mb-3">General Guidelines</h4>
            <div className="space-y-2 text-sm text-yellow-800">
              <p>• Ensure stable internet connection throughout the contest</p>
              <p>• Submit solutions before the time limit expires</p>
              <p>• Contact support if you encounter technical issues</p>
              <p>• Fair play is expected from all participants</p>
              <p>• Results will be announced after contest completion</p>
            </div>
          </MaterialCard>

          <MaterialButton onClick={onClose} fullWidth>
            I Understand
          </MaterialButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ContestLobbyPage() {
  const params = useParams()
  const router = useRouter()
  const { balance } = useWallet()
  const contestId = params.id as string

  const [contest, setContest] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Dialog states
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showRulesDialog, setShowRulesDialog] = useState(false)

  // Mock participants data
  const [participants, setParticipants] = useState([
    { id: 1, username: "CodeNinja", avatar: "🥷", status: "ready", joinedAt: "2 min ago" },
    { id: 2, username: "AlgoMaster", avatar: "🧠", status: "ready", joinedAt: "5 min ago" },
    { id: 3, username: "DevGuru", avatar: "👨‍💻", status: "waiting", joinedAt: "1 min ago" },
    { id: 4, username: "ByteWarrior", avatar: "⚔️", status: "ready", joinedAt: "3 min ago" },
    { id: 5, username: "CodeCrusher", avatar: "💪", status: "waiting", joinedAt: "Just now" },
  ])

  // Load contest data
  useEffect(() => {
    const contestData = getContestById(contestId)
    setContest(contestData)
  }, [contestId])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTimeUntilStart = (startTime: Date) => {
    const diff = startTime.getTime() - currentTime.getTime()

    if (diff <= 0) return { text: "Started", isUrgent: false, isStarted: true }

    const totalSeconds = Math.floor(diff / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    const isUrgent = totalSeconds <= 300 // 5 minutes or less

    if (days > 0) return { text: `${days}d ${hours % 24}h`, isUrgent: false, isStarted: false }
    if (hours > 0) return { text: `${hours}h ${minutes % 60}m`, isUrgent: false, isStarted: false }
    if (minutes > 0)
      return {
        text: isUrgent ? `${minutes}m ${seconds}s` : `${minutes}m`,
        isUrgent,
        isStarted: false,
      }
    return { text: `${seconds}s`, isUrgent: true, isStarted: false }
  }

  const handleJoinContest = () => {
    if (!contest) return

    // Different flows based on contest type
    if (contest.type === "dsa" || contest.type === "logic") {
      // DSA and Logic contests require security setup
      setShowPermissionDialog(true)
    } else {
      // UI/UX and Vibe Coding contests redirect directly to contest details
      router.push(`/contest/${contest.id}`)
    }
  }

  const handlePermissionConfirm = async () => {
    setIsRequestingPermissions(true)

    try {
      // Request camera permission for DSA and Logic contests
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      // Stop the stream immediately after getting permission
      stream.getTracks().forEach((track) => track.stop())

      // Simulate additional permission checks
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setShowPermissionDialog(false)

      // Redirect based on contest type
      if (contest.type === "dsa") {
        router.push(`/contest/${contest.id}/editor`)
      } else if (contest.type === "logic") {
        router.push(`/contest/${contest.id}/mcq`)
      }
    } catch (error) {
      console.error("Permission denied:", error)
      alert("Camera and microphone permissions are required to participate in the contest.")
    } finally {
      setIsRequestingPermissions(false)
    }
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contest details...</p>
        </div>
      </div>
    )
  }

  const timeInfo = contest.showTimer && contest.startTime ? formatTimeUntilStart(contest.startTime) : null
  const isUrgent = timeInfo?.isUrgent || false
  const isStarted = timeInfo?.isStarted || false

  const getContestTypeIcon = (type: string) => {
    switch (type) {
      case "dsa":
        return Code2
      case "logic":
        return Brain
      case "vibe-coding":
        return Zap
      case "ui-ux":
        return Paintbrush
      default:
        return Target
    }
  }

  const getContestTypeColor = (type: string) => {
    switch (type) {
      case "dsa":
        return "bg-blue-600"
      case "logic":
        return "bg-purple-600"
      case "vibe-coding":
        return "bg-pink-600"
      case "ui-ux":
        return "bg-orange-600"
      default:
        return "bg-blue-600"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "practice":
        return "bg-green-100 text-green-800 border-green-200"
      case "beginner-special":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "small-league":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "mega-contest":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "high-roller":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "practice":
        return "Practice"
      case "beginner-special":
        return "Beginner Special"
      case "small-league":
        return "Small League"
      case "mega-contest":
        return "Mega Contest"
      case "high-roller":
        return "High Roller"
      default:
        return "Contest"
    }
  }

  const getContestTypeLabel = (type: string) => {
    switch (type) {
      case "dsa":
        return "DSA"
      case "logic":
        return "Logic"
      case "vibe-coding":
        return "Vibe Coding"
      case "ui-ux":
        return "UI/UX"
      default:
        return "Contest"
    }
  }

  const getProblemTypeIcon = (problemType: string) => {
    switch (problemType) {
      case "coding":
        return Code2
      case "mcq":
        return HelpCircle
      case "puzzle":
        return Lightbulb
      case "design":
        return Palette
      case "creative":
        return Music
      default:
        return FileText
    }
  }

  const getProblemTypeLabel = (problemType: string) => {
    switch (problemType) {
      case "coding":
        return "Coding Problem"
      case "mcq":
        return "Multiple Choice"
      case "puzzle":
        return "Logic Puzzle"
      case "design":
        return "Design Task"
      case "creative":
        return "Creative Challenge"
      default:
        return "Problem"
    }
  }

  const fillPercentage = contest.maxParticipants ? (contest.participants / contest.maxParticipants) * 100 : 0

  const TypeIcon = getContestTypeIcon(contest.type)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <MaterialButton variant="text" size="medium" startIcon={<ArrowLeft className="h-4 w-4" />}>
                  Back to Contests
                </MaterialButton>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getContestTypeColor(contest.type)}`}>
                  <TypeIcon className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Contest Lobby</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/wallet">
                <MaterialButton variant="text" size="medium" startIcon={<Wallet className="h-4 w-4" />}>
                  ₹{balance.toLocaleString("en-IN")}
                </MaterialButton>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contest Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contest Header */}
            <MaterialCard elevation={2} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <MaterialBadge variant="default" size="medium" className={getCategoryColor(contest.category)}>
                      {getCategoryLabel(contest.category)}
                    </MaterialBadge>
                    <MaterialBadge variant="default" size="medium" className="bg-blue-100 text-blue-800">
                      {getContestTypeLabel(contest.type)}
                    </MaterialBadge>
                    {contest.featured && (
                      <MaterialBadge variant="default" size="medium" className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </MaterialBadge>
                    )}
                    {isUrgent && !isStarted && (
                      <MaterialBadge variant="default" size="medium" className="bg-red-100 text-red-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Starting Soon!
                      </MaterialBadge>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">{contest.title}</h1>
                  <p className="text-gray-600 mb-4">{contest.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {contest.creator}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {contest.duration}
                    </span>
                    <span className="flex items-center gap-1 capitalize">
                      <Target className="h-4 w-4" />
                      {contest.difficulty}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {contest.participants}/{contest.maxParticipants} participants
                    </span>
                  </div>
                </div>

                {/* Timer Section */}
                {contest.showTimer && timeInfo && (
                  <div className="flex-shrink-0">
                    <MaterialCard
                      elevation={1}
                      className={`p-4 text-center min-w-[140px] ${
                        isUrgent && !isStarted
                          ? "bg-red-50 border border-red-200"
                          : isStarted
                            ? "bg-green-50 border border-green-200"
                            : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Timer
                          className={`h-5 w-5 ${
                            isUrgent && !isStarted ? "text-red-600" : isStarted ? "text-green-600" : "text-blue-600"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            isUrgent && !isStarted ? "text-red-600" : isStarted ? "text-green-600" : "text-blue-600"
                          }`}
                        >
                          {isStarted ? "Live Now" : "Starts in"}
                        </span>
                      </div>
                      <div
                        className={`text-xl font-bold ${
                          isUrgent && !isStarted ? "text-red-700" : isStarted ? "text-green-700" : "text-blue-700"
                        }`}
                      >
                        {timeInfo.text}
                      </div>
                    </MaterialCard>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {contest.maxParticipants && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Contest Capacity</span>
                    <span className="text-sm font-medium text-gray-900">
                      {contest.participants}/{contest.maxParticipants}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        (contest.participants / contest.maxParticipants) * 100 > 80
                          ? "bg-red-500"
                          : (contest.participants / contest.maxParticipants) * 100 > 60
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min((contest.participants / contest.maxParticipants) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Contest Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{contest.problems.length}</div>
                  <div className="text-sm text-blue-800">
                    {contest.type === "logic"
                      ? "Questions"
                      : contest.type === "ui-ux"
                        ? "Tasks"
                        : contest.type === "vibe-coding"
                          ? "Challenges"
                          : "Problems"}
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{contest.participants}</div>
                  <div className="text-sm text-green-800">Participants</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {contest.prizeType === "cash" ? `₹${contest.prizePool.toLocaleString("en-IN")}` : "FREE"}
                  </div>
                  <div className="text-sm text-purple-800">Prize Pool</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{contest.duration}</div>
                  <div className="text-sm text-orange-800">Duration</div>
                </div>
              </div>
            </MaterialCard>

            {/* Contest Problems/Tasks */}
            <MaterialCard elevation={1} className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TypeIcon className="h-5 w-5 text-blue-600" />
                Contest{" "}
                {contest.type === "logic"
                  ? "Questions"
                  : contest.type === "ui-ux"
                    ? "Tasks"
                    : contest.type === "vibe-coding"
                      ? "Challenges"
                      : "Problems"}
              </h2>
              <div className="space-y-4">
                {contest.problems.map((problem: any, index: number) => {
                  const ProblemIcon = getProblemTypeIcon(problem.type)
                  return (
                    <div key={problem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex items-center gap-2">
                          <ProblemIcon className="h-4 w-4 text-gray-600" />
                          <div>
                            <h3 className="font-medium text-gray-900">{problem.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <MaterialBadge
                                variant="default"
                                size="small"
                                className={
                                  problem.difficulty === "Easy"
                                    ? "bg-green-100 text-green-800"
                                    : problem.difficulty === "Medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }
                              >
                                {problem.difficulty}
                              </MaterialBadge>
                              <span className="text-sm text-gray-500">{problem.points} points</span>
                              {problem.type && (
                                <MaterialBadge variant="default" size="small" className="bg-gray-100 text-gray-700">
                                  {getProblemTypeLabel(problem.type)}
                                </MaterialBadge>
                              )}
                            </div>
                            {/* Contest-specific additional info */}
                            {contest.type === "logic" && problem.options && (
                              <p className="text-xs text-gray-500 mt-1">{problem.options} options</p>
                            )}
                            {contest.type === "ui-ux" && problem.deliverable && (
                              <p className="text-xs text-gray-500 mt-1">Deliverable: {problem.deliverable}</p>
                            )}
                            {contest.type === "vibe-coding" && problem.theme && (
                              <p className="text-xs text-gray-500 mt-1">Theme: {problem.theme}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </MaterialCard>

            {/* Participants List */}
            <MaterialCard elevation={1} className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Recent Participants
              </h2>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{participant.avatar}</div>
                      <div>
                        <div className="font-medium text-gray-900">{participant.username}</div>
                        <div className="text-sm text-gray-500">Joined {participant.joinedAt}</div>
                      </div>
                    </div>
                    <MaterialBadge
                      variant="default"
                      size="small"
                      className={
                        participant.status === "ready" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {participant.status}
                    </MaterialBadge>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  {contest.participants - participants.length} more participants...
                </p>
              </div>
            </MaterialCard>

            {/* Contest Information */}
            <MaterialCard elevation={1} className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contest Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Contest Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900">{getContestTypeLabel(contest.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="font-medium text-gray-900 capitalize">{contest.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-900">{contest.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {contest.type === "logic"
                          ? "Questions:"
                          : contest.type === "ui-ux"
                            ? "Tasks:"
                            : contest.type === "vibe-coding"
                              ? "Challenges:"
                              : "Problems:"}
                      </span>
                      <span className="font-medium text-gray-900">{contest.problems.length}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Rewards</h3>
                  {contest.prizeType === "cash" ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prize Pool:</span>
                        <span className="font-medium text-green-600">₹{contest.prizePool.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Winners:</span>
                        <span className="font-medium text-gray-900">
                          {contest.prizeDistribution.reduce((sum: number, p: any) => sum + p.count, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Top Prize:</span>
                        <span className="font-medium text-green-600">
                          ₹{Math.max(...contest.prizeDistribution.map((p: any) => p.amount)).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      {contest.learningBenefits.map((benefit: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-green-700">
                          <Star className="h-4 w-4" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </MaterialCard>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Join Contest Card */}
            <MaterialCard elevation={2} className="p-6 sticky top-24">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Start?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Click below to{" "}
                  {contest.type === "dsa"
                    ? "enter the contest environment and begin solving problems"
                    : contest.type === "logic"
                      ? "start answering questions"
                      : "access the contest interface"}
                  .
                </p>
                <MaterialButton
                  size="large"
                  onClick={handleJoinContest}
                  className={`w-full ${getContestTypeColor(contest.type)} hover:opacity-90 text-white`}
                  startIcon={<Play className="h-5 w-5" />}
                >
                  {contest.type === "logic" ? "Start Quiz" : "Join Contest"}
                </MaterialButton>
                {(contest.type === "dsa" || contest.type === "logic") && (
                  <p className="text-xs text-gray-500 mt-2">
                    Camera and microphone permissions required for contest integrity
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <MaterialButton
                  variant="outlined"
                  size="medium"
                  fullWidth
                  onClick={() => setShowInviteDialog(true)}
                  startIcon={<Share2 className="h-4 w-4" />}
                >
                  Invite Friends
                </MaterialButton>
                <MaterialButton
                  variant="outlined"
                  size="medium"
                  fullWidth
                  onClick={() => setShowRulesDialog(true)}
                  startIcon={<BookOpen className="h-4 w-4" />}
                >
                  View Contest Rules
                </MaterialButton>
              </div>
            </MaterialCard>

            {/* Contest Type Specific Info */}
            {contest.type === "logic" && (
              <MaterialCard elevation={1} className="p-6 bg-purple-50">
                <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Logic Challenge Info
                </h3>
                <div className="space-y-3 text-sm text-purple-800">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="h-4 w-4 mt-0.5" />
                    <span>Multiple choice questions with instant feedback</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 mt-0.5" />
                    <span>Pattern recognition and logical reasoning</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Timer className="h-4 w-4 mt-0.5" />
                    <span>Time-based scoring with bonus points</span>
                  </div>
                </div>
              </MaterialCard>
            )}

            {contest.type === "ui-ux" && (
              <MaterialCard elevation={1} className="p-6 bg-orange-50">
                <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center gap-2">
                  <Paintbrush className="h-5 w-5" />
                  Design Challenge Info
                </h3>
                <div className="space-y-3 text-sm text-orange-800">
                  <div className="flex items-start gap-2">
                    <Palette className="h-4 w-4 mt-0.5" />
                    <span>Create visual designs and prototypes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-0.5" />
                    <span>Submit design files and explanations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Star className="h-4 w-4 mt-0.5" />
                    <span>Judged on creativity and usability</span>
                  </div>
                </div>
              </MaterialCard>
            )}

            {contest.type === "vibe-coding" && (
              <MaterialCard elevation={1} className="p-6 bg-pink-50">
                <h3 className="text-lg font-semibold text-pink-900 mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Vibe Coding Info
                </h3>
                <div className="space-y-3 text-sm text-pink-800">
                  <div className="flex items-start gap-2">
                    <Music className="h-4 w-4 mt-0.5" />
                    <span>Code with live music and creative themes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 mt-0.5" />
                    <span>Express creativity through code</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-0.5" />
                    <span>Collaborative and fun environment</span>
                  </div>
                </div>
              </MaterialCard>
            )}

            {/* Security Notice - For DSA and Logic contests */}
            {(contest.type === "dsa" || contest.type === "logic") && (
              <MaterialCard elevation={1} className="p-6 bg-blue-50">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Contest Security
                </h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <Camera className="h-4 w-4 mt-0.5" />
                    <span>Camera monitoring for fair play</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Monitor className="h-4 w-4 mt-0.5" />
                    <span>Screen recording to prevent cheating</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mic className="h-4 w-4 mt-0.5" />
                    <span>Audio monitoring for communication detection</span>
                  </div>
                </div>
                <p className="text-xs text-blue-700 mt-3">
                  All monitoring data is encrypted and automatically deleted after 30 days.
                </p>
              </MaterialCard>
            )}

            {/* Prize Pool Card */}
            {contest.prizeType === "cash" ? (
              <MaterialCard elevation={1} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Prize Distribution
                </h3>

                <div className="space-y-3">
                  {contest.prizeDistribution.slice(0, 3).map((prize: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <div className="flex items-center gap-3">
                        {index === 0 && <Crown className="h-4 w-4 text-yellow-600" />}
                        {index === 1 && <Medal className="h-4 w-4 text-gray-400" />}
                        {index === 2 && <Award className="h-4 w-4 text-amber-600" />}
                        <span className="font-medium text-gray-900">{prize.position}</span>
                      </div>
                      <span className="font-bold text-green-600">₹{prize.amount.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </MaterialCard>
            ) : (
              <MaterialCard elevation={1} className="p-6 bg-green-50">
                <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Practice Benefits
                </h3>
                <div className="space-y-2">
                  {contest.learningBenefits.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-green-700">
                      <Star className="h-4 w-4" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </MaterialCard>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs - Show permission dialog for DSA and Logic contests */}
      {(contest.type === "dsa" || contest.type === "logic") && (
        <PermissionRequestDialog
          isOpen={showPermissionDialog}
          onClose={() => setShowPermissionDialog(false)}
          onConfirm={handlePermissionConfirm}
          isRequesting={isRequestingPermissions}
          contestType={contest.type}
        />
      )}

      <InviteFriendsDialog contest={contest} isOpen={showInviteDialog} onClose={() => setShowInviteDialog(false)} />

      <ContestRulesDialog contest={contest} isOpen={showRulesDialog} onClose={() => setShowRulesDialog(false)} />
    </div>
  )
}
