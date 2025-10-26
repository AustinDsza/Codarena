"use client"

import Link from "next/link"

import { useState, useEffect, useCallback } from "react"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard } from "@/components/ui/material-card"
import { MaterialBadge } from "@/components/ui/material-badge"
import {
  Trophy,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Code2,
  ArrowLeft,
  Download,
  Share2,
  Lightbulb,
  Award,
  Medal,
  Crown,
  Star,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Copy,
  Bot,
  Zap,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  MessageCircle,
  Instagram,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Coins,
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"

// Function to format Codarena Coins amount
const formatCCAmount = (amount: number): string => {
  return `${amount.toLocaleString("en-IN")} CC`
}

// Mock contest results data
const getContestResults = (contestId: string, sessionData?: any) => {
  const baseResults = {
    "live-dsa-urgent": {
      contestId: "live-dsa-urgent",
      contestTitle: "🔥 Lightning DSA Challenge",
      userRank: 7,
      totalParticipants: 23,
      totalScore: 520,
      maxScore: 750,
      percentile: 78,
      timeSpent: "42m 15s",
      contestDuration: "45m",
      status: "completed",
      prizeWon: 0,
      prizeDetails: {
        hasWon: false,
        message: "Great effort! You were close to the prize zone.",
        encouragement: "Keep practicing and you'll be in the top 3 next time!",
        nextContestInfo: "Join our next Lightning DSA Challenge for another chance to win up to 950 CC!",
        missedBy: 2, // positions away from prize zone
      },
    },
    "practice-dsa-1": {
      contestId: "practice-dsa-1",
      contestTitle: "🎯 DSA Practice Arena",
      userRank: 12,
      totalParticipants: 234,
      totalScore: 280,
      maxScore: 350,
      percentile: 85,
      timeSpent: "48m 30s",
      contestDuration: "1h",
      status: "completed",
      prizeWon: 0,
      prizeDetails: {
        hasWon: false,
        message: "Excellent performance! You're in the top 15%.",
        encouragement: "Your coding skills are improving rapidly. Keep up the momentum!",
        nextContestInfo: "Practice contests help you prepare for prize-winning live contests!",
        achievement: "Top 15% Performer",
      },
    },
    "live-dsa-winner": {
      contestId: "live-dsa-winner",
      contestTitle: "🔥 Lightning DSA Challenge",
      userRank: 2,
      totalParticipants: 45,
      totalScore: 720,
      maxScore: 750,
      percentile: 96,
      timeSpent: "38m 45s",
      contestDuration: "45m",
      status: "completed",
      prizeWon: 570,
      prizeDetails: {
        hasWon: true,
        prizeName: "🥈 Second Place Winner",
        prizeAmount: 570,
        prizeDescription: "Outstanding performance! You secured the second position.",
        paymentStatus: "processing",
        paymentInfo: "Prize money will be credited to your wallet within 24-48 hours.",
        achievement: "Top 5% Elite Performer",
        bonusInfo: "You also earned 50 bonus XP points!",
      },
    },
  }

  const problemsData = {
    "live-dsa-urgent": [
      {
        id: 1,
        title: "Array Manipulation",
        maxPoints: 200,
        earnedPoints: 200,
        status: "accepted",
        attempts: 2,
        timeSpent: "12m 30s",
        difficulty: "Medium",
        submissionTime: "12:30",
        feedback: {
          overall: "Excellent solution! Your approach using Kadane's algorithm was optimal.",
          strengths: [
            "Correctly identified the maximum subarray problem",
            "Implemented Kadane's algorithm efficiently",
            "Good variable naming and code structure",
            "Handled edge cases properly",
          ],
          improvements: ["Consider adding more comments for complex logic", "Could optimize space complexity slightly"],
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
          codeQuality: 9,
          algorithmChoice: 10,
          implementation: 9,
        },
        solution: `def maxSubArray(nums):
    max_sum = nums[0]
    current_sum = nums[0]
    
    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
    
    return max_sum`,
        testCases: {
          passed: 10,
          total: 10,
          details: [
            { input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6", actual: "6", status: "passed" },
            { input: "[1]", expected: "1", actual: "1", status: "passed" },
            { input: "[5,4,-1,7,8]", expected: "23", actual: "23", status: "passed" },
          ],
        },
        aiCrossCheck: {
          status: "verified",
          confidence: 95,
          analysis:
            "The solution correctly implements Kadane's algorithm for the maximum subarray problem. The approach is optimal with O(n) time complexity and O(1) space complexity.",
          suggestions: [
            "Consider adding input validation for empty arrays",
            "The algorithm handles negative numbers correctly",
            "Edge cases are properly managed",
          ],
          alternativeApproaches: [
            "Divide and conquer approach (O(n log n))",
            "Brute force approach (O(n²)) - not recommended for large inputs",
          ],
        },
      },
      {
        id: 2,
        title: "String Algorithms",
        maxPoints: 250,
        earnedPoints: 180,
        status: "partial",
        attempts: 3,
        timeSpent: "18m 45s",
        difficulty: "Medium",
        submissionTime: "31:15",
        feedback: {
          overall: "Good attempt! Your solution works for most cases but has issues with edge cases.",
          strengths: [
            "Understood the palindrome concept correctly",
            "Good use of two-pointer technique",
            "Clean code structure",
          ],
          improvements: [
            "Handle empty strings and single characters",
            "Consider the expand-around-centers approach for better efficiency",
            "Add boundary checks to prevent index errors",
            "Test with more edge cases",
          ],
          timeComplexity: "O(n²)",
          spaceComplexity: "O(1)",
          codeQuality: 7,
          algorithmChoice: 6,
          implementation: 7,
        },
        solution: `def longestPalindrome(s):
    if not s:
        return ""
    
    start = 0
    max_len = 1
    
    for i in range(len(s)):
        # Check for odd length palindromes
        left, right = i, i
        while left >= 0 and right < len(s) and s[left] == s[right]:
            if right - left + 1 > max_len:
                start = left
                max_len = right - left + 1
            left -= 1
            right += 1
    
    return s[start:start + max_len]`,
        testCases: {
          passed: 7,
          total: 10,
          details: [
            { input: '"babad"', expected: '"bab"', actual: '"bab"', status: "passed" },
            { input: '"cbbd"', expected: '"bb"', actual: '"bb"', status: "passed" },
            { input: '""', expected: '""', actual: "Error", status: "failed" },
          ],
        },
        aiCrossCheck: {
          status: "needs_improvement",
          confidence: 72,
          analysis:
            "The solution implements the expand-around-centers approach but misses some edge cases. The logic for odd-length palindromes is correct, but even-length palindromes are not handled.",
          suggestions: [
            "Add handling for even-length palindromes",
            "Implement proper empty string validation",
            "Consider using Manacher's algorithm for O(n) solution",
          ],
          alternativeApproaches: [
            "Manacher's algorithm (O(n) time complexity)",
            "Dynamic programming approach (O(n²) time, O(n²) space)",
            "Expand around centers for both odd and even lengths",
          ],
        },
      },
      {
        id: 3,
        title: "Graph Traversal",
        maxPoints: 300,
        earnedPoints: 140,
        status: "partial",
        attempts: 4,
        timeSpent: "11m 00s",
        difficulty: "Hard",
        submissionTime: "42:15",
        feedback: {
          overall: "Your understanding of graph traversal is good, but the implementation needs work.",
          strengths: [
            "Correctly identified the need for Dijkstra's algorithm",
            "Good graph representation using adjacency list",
            "Proper initialization of distances",
          ],
          improvements: [
            "Priority queue implementation is incorrect",
            "Missing proper relaxation of edges",
            "Need to handle disconnected graphs",
            "Consider using heapq for better performance",
            "Add validation for negative weights",
          ],
          timeComplexity: "O(V²) - should be O((V+E)logV)",
          spaceComplexity: "O(V)",
          codeQuality: 6,
          algorithmChoice: 8,
          implementation: 5,
        },
        solution: `def shortestPath(graph, start, end):
    import heapq
    
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        current_dist, current = heapq.heappop(pq)
        
        if current == end:
            return current_dist
            
        for neighbor, weight in graph[current]:
            distance = current_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    
    return -1  # No path found`,
        testCases: {
          passed: 6,
          total: 12,
          details: [
            { input: "Simple graph", expected: "7", actual: "7", status: "passed" },
            { input: "Disconnected graph", expected: "-1", actual: "Error", status: "failed" },
            { input: "Single node", expected: "0", actual: "0", status: "passed" },
          ],
        },
        aiCrossCheck: {
          status: "critical_issues",
          confidence: 58,
          analysis:
            "The Dijkstra's algorithm implementation has several issues. While the basic structure is correct, there are problems with edge relaxation and handling of disconnected components.",
          suggestions: [
            "Fix the priority queue implementation to avoid processing same node multiple times",
            "Add proper handling for disconnected graphs",
            "Implement visited set to optimize performance",
            "Add input validation for negative weights",
          ],
          alternativeApproaches: [
            "Bellman-Ford algorithm (handles negative weights)",
            "Floyd-Warshall algorithm (all-pairs shortest path)",
            "A* algorithm (with heuristic for faster pathfinding)",
          ],
        },
      },
    ],
    "practice-dsa-1": [
      {
        id: 1,
        title: "Two Sum",
        maxPoints: 100,
        earnedPoints: 100,
        status: "accepted",
        attempts: 1,
        timeSpent: "8m 15s",
        difficulty: "Easy",
        submissionTime: "8:15",
        feedback: {
          overall: "Perfect solution! You implemented the optimal hash map approach.",
          strengths: [
            "Correctly used hash map for O(n) solution",
            "Clean and readable code",
            "Proper handling of edge cases",
            "Efficient single-pass algorithm",
          ],
          improvements: ["Consider adding input validation", "Could add more descriptive variable names"],
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          codeQuality: 9,
          algorithmChoice: 10,
          implementation: 9,
        },
        solution: `def twoSum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
        testCases: {
          passed: 10,
          total: 10,
          details: [
            { input: "[2,7,11,15], 9", expected: "[0,1]", actual: "[0,1]", status: "passed" },
            { input: "[3,2,4], 6", expected: "[1,2]", actual: "[1,2]", status: "passed" },
            { input: "[3,3], 6", expected: "[0,1]", actual: "[0,1]", status: "passed" },
          ],
        },
        aiCrossCheck: {
          status: "verified",
          confidence: 98,
          analysis:
            "Excellent implementation of the Two Sum problem using hash map. The solution is optimal with O(n) time complexity and handles all edge cases correctly.",
          suggestions: [
            "The solution is already optimal",
            "Consider adding type hints for better code documentation",
            "Input validation could be added for production code",
          ],
          alternativeApproaches: [
            "Brute force approach (O(n²) time complexity)",
            "Two-pointer approach (requires sorted array)",
            "Using built-in functions like enumerate and dictionary comprehension",
          ],
        },
      },
      {
        id: 2,
        title: "Valid Parentheses",
        maxPoints: 100,
        earnedPoints: 80,
        status: "partial",
        attempts: 2,
        timeSpent: "15m 20s",
        difficulty: "Easy",
        submissionTime: "23:35",
        feedback: {
          overall: "Good understanding of stack data structure, but missed some edge cases.",
          strengths: [
            "Correctly used stack for bracket matching",
            "Good logic for opening and closing brackets",
            "Clean implementation structure",
          ],
          improvements: [
            "Handle empty string case properly",
            "Add validation for invalid characters",
            "Consider stack underflow scenarios",
            "Test with more complex nested cases",
          ],
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          codeQuality: 7,
          algorithmChoice: 8,
          implementation: 7,
        },
        solution: `def isValid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return not stack`,
        testCases: {
          passed: 8,
          total: 10,
          details: [
            { input: '"()"', expected: "true", actual: "true", status: "passed" },
            { input: '"()[]{}"', expected: "true", actual: "true", status: "passed" },
            { input: '""', expected: "true", actual: "false", status: "failed" },
          ],
        },
        aiCrossCheck: {
          status: "needs_improvement",
          confidence: 78,
          analysis:
            "Good stack-based approach for parentheses validation. The core logic is correct but some edge cases are not handled properly, particularly empty strings and invalid characters.",
          suggestions: [
            "Add explicit handling for empty string case",
            "Validate input characters before processing",
            "Consider early termination for performance optimization",
            "Add more comprehensive test cases",
          ],
          alternativeApproaches: [
            "Counter-based approach (less efficient)",
            "Recursive approach (not recommended for large inputs)",
            "Regular expression approach (less readable)",
          ],
        },
      },
      {
        id: 3,
        title: "Merge Two Sorted Lists",
        maxPoints: 150,
        earnedPoints: 100,
        status: "partial",
        attempts: 3,
        timeSpent: "25m 00s",
        difficulty: "Easy",
        submissionTime: "48:35",
        feedback: {
          overall: "Decent approach but implementation has some issues with edge cases.",
          strengths: [
            "Understood the merge concept correctly",
            "Good use of two pointers",
            "Attempted to handle different list lengths",
          ],
          improvements: [
            "Handle null/empty list cases properly",
            "Fix pointer advancement logic",
            "Consider using dummy node for cleaner code",
            "Test with lists of different lengths",
          ],
          timeComplexity: "O(m+n)",
          spaceComplexity: "O(1)",
          codeQuality: 6,
          algorithmChoice: 7,
          implementation: 6,
        },
        solution: `def mergeTwoLists(list1, list2):
    dummy = ListNode(0)
    current = dummy
    
    while list1 and list2:
        if list1.val <= list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next
    
    current.next = list1 or list2
    return dummy.next`,
        testCases: {
          passed: 7,
          total: 10,
          details: [
            { input: "[1,2,4], [1,3,4]", expected: "[1,1,2,3,4,4]", actual: "[1,1,2,3,4,4]", status: "passed" },
            { input: "[], []", expected: "[]", actual: "Error", status: "failed" },
            { input: "[], [0]", expected: "[0]", actual: "Error", status: "failed" },
          ],
        },
        aiCrossCheck: {
          status: "needs_improvement",
          confidence: 71,
          analysis:
            "The merge logic is fundamentally correct using the dummy node approach. However, there are issues with null pointer handling that cause failures in edge cases.",
          suggestions: [
            "Add null checks at the beginning of the function",
            "Handle empty list cases explicitly",
            "Consider iterative vs recursive approaches",
            "Test thoroughly with edge cases",
          ],
          alternativeApproaches: [
            "Recursive approach (more intuitive but uses stack space)",
            "In-place merging (modifies original lists)",
            "Using built-in merge functions from libraries",
          ],
        },
      },
    ],
  }

  const leaderboardData = {
    "live-dsa-urgent": [
      { rank: 1, name: "CodeMaster_2024", score: 750, time: "38m 22s", prize: 950 },
      { rank: 2, name: "AlgoExpert", score: 720, time: "41m 15s", prize: 570 },
      { rank: 3, name: "DSA_Ninja", score: 680, time: "43m 08s", prize: 380 },
      { rank: 4, name: "ByteWarrior", score: 650, time: "44m 30s", prize: 0 },
      { rank: 5, name: "CodeCrusher", score: 600, time: "42m 45s", prize: 0 },
      { rank: 6, name: "AlgoWizard", score: 580, time: "41m 52s", prize: 0 },
      { rank: 7, name: "You", score: 520, time: "42m 15s", prize: 0 },
      { rank: 8, name: "DevGuru", score: 480, time: "44m 12s", prize: 0 },
    ],
    "practice-dsa-1": [
      { rank: 1, name: "PythonPro", score: 350, time: "35m 10s", prize: 0 },
      { rank: 2, name: "CodeNinja", score: 340, time: "42m 30s", prize: 0 },
      { rank: 3, name: "AlgoMaster", score: 320, time: "45m 15s", prize: 0 },
      { rank: 4, name: "DevExpert", score: 310, time: "50m 20s", prize: 0 },
      { rank: 5, name: "ByteCoder", score: 300, time: "48m 45s", prize: 0 },
      { rank: 12, name: "You", score: 280, time: "48m 30s", prize: 0 },
    ],
  }

  const insightsData = {
    "live-dsa-urgent": {
      strongAreas: ["Array Algorithms", "Two Pointers", "Basic Graph Theory"],
      improvementAreas: ["Advanced Graph Algorithms", "Edge Case Handling", "Code Optimization"],
      recommendations: [
        "Practice more graph algorithm problems on LeetCode",
        "Focus on implementing Dijkstra's algorithm correctly",
        "Work on handling edge cases in string problems",
        "Study time and space complexity analysis",
      ],
      nextSteps: [
        "Solve 10 more graph problems this week",
        "Review Dijkstra's algorithm implementation",
        "Practice string manipulation edge cases",
        "Join the next intermediate DSA contest",
      ],
    },
    "practice-dsa-1": {
      strongAreas: ["Hash Maps", "Array Manipulation", "Basic Data Structures"],
      improvementAreas: ["Linked Lists", "Edge Case Handling", "Code Robustness"],
      recommendations: [
        "Practice more linked list problems",
        "Focus on edge case handling in all solutions",
        "Study common data structure implementations",
        "Work on code validation and error handling",
      ],
      nextSteps: [
        "Complete 15 linked list problems this week",
        "Practice edge case scenarios for each data structure",
        "Review stack and queue implementations",
        "Join the next beginner DSA contest",
      ],
    },
  }

  // Merge with session data if available
  const result = {
    ...baseResults[contestId as keyof typeof baseResults],
    problems: problemsData[contestId as keyof typeof problemsData] || [],
    leaderboard: leaderboardData[contestId as keyof typeof leaderboardData] || [],
    insights: insightsData[contestId as keyof typeof insightsData] || {},
  }

  // Update with session data if available
  if (sessionData) {
    result.totalScore = sessionData.userScore || result.totalScore
    result.timeSpent = sessionData.timeSpent || result.timeSpent

    // Update problems based on solved problems
    if (sessionData.solvedProblems) {
      result.problems.forEach((problem: any, index: number) => {
        if (sessionData.solvedProblems.includes(index)) {
          problem.status = "accepted"
          problem.earnedPoints = problem.maxPoints
        }
      })
    }
  }

  return result
}

// AI Cross-Check Component
function AICrossCheck({ aiCrossCheck }: { aiCrossCheck: any }) {
  const [showDetails, setShowDetails] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "needs_improvement":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "critical_issues":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-50 border-green-200"
      case "needs_improvement":
        return "bg-yellow-50 border-yellow-200"
      case "critical_issues":
        return "bg-red-50 border-red-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "verified":
        return "AI Verified ✓"
      case "needs_improvement":
        return "Needs Improvement"
      case "critical_issues":
        return "Critical Issues Found"
      default:
        return "Under Review"
    }
  }

  return (
    <MaterialCard elevation={1} className={`p-4 ${getStatusColor(aiCrossCheck.status)}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-purple-600" />
          <span className="font-medium text-gray-900">AI Code Analysis</span>
          <MaterialBadge variant="default" size="small" className="bg-purple-100 text-purple-800">
            {aiCrossCheck.confidence}% Confidence
          </MaterialBadge>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(aiCrossCheck.status)}
          <span className="text-sm font-medium">{getStatusText(aiCrossCheck.status)}</span>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-3">{aiCrossCheck.analysis}</p>

      <MaterialButton
        variant="text"
        size="small"
        onClick={() => setShowDetails(!showDetails)}
        endIcon={showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      >
        {showDetails ? "Hide Details" : "Show AI Insights"}
      </MaterialButton>

      {showDetails && (
        <div className="mt-4 space-y-3">
          {/* AI Suggestions */}
          <div>
            <h6 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              AI Suggestions
            </h6>
            <ul className="space-y-1">
              {aiCrossCheck.suggestions.map((suggestion: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <Zap className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-500" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* Alternative Approaches */}
          <div>
            <h6 className="font-medium text-gray-900 mb-2">Alternative Approaches</h6>
            <ul className="space-y-1">
              {aiCrossCheck.alternativeApproaches.map((approach: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <Code2 className="h-3 w-3 mt-0.5 flex-shrink-0 text-green-500" />
                  {approach}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </MaterialCard>
  )
}

// Problem Analysis Component
function ProblemAnalysis({ problem, index }: { problem: any; index: number }) {
  const [showCode, setShowCode] = useState(false)
  const [showTestCases, setShowTestCases] = useState(false)
  const [showFeedback, setShowFeedback] = useState(true)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "partial":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <XCircle className="h-5 w-5 text-red-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-50 border-green-200"
      case "partial":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-red-50 border-red-200"
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(problem.solution)
  }

  return (
    <MaterialCard elevation={1} className={`p-6 ${getStatusColor(problem.status)}`}>
      {/* Problem Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {index + 1}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{problem.title}</h3>
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
              <span className="text-sm text-gray-600">
                {problem.attempts} attempt{problem.attempts > 1 ? "s" : ""}
              </span>
              <span className="text-sm text-gray-600">• {problem.timeSpent}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusIcon(problem.status)}
          <div className="text-right">
            <div className="font-bold text-lg">
              {problem.earnedPoints}/{problem.maxPoints}
            </div>
            <div className="text-sm text-gray-600">points</div>
          </div>
        </div>
      </div>

      {/* AI Cross-Check */}
      {problem.aiCrossCheck && (
        <div className="mb-6">
          <AICrossCheck aiCrossCheck={problem.aiCrossCheck} />
        </div>
      )}

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-white rounded-lg border">
          <div className="text-xl font-bold text-blue-600">{problem.feedback.codeQuality}/10</div>
          <div className="text-sm text-gray-600">Code Quality</div>
        </div>
        <div className="text-center p-3 bg-white rounded-lg border">
          <div className="text-xl font-bold text-purple-600">{problem.feedback.algorithmChoice}/10</div>
          <div className="text-sm text-gray-600">Algorithm</div>
        </div>
        <div className="text-center p-3 bg-white rounded-lg border">
          <div className="text-xl font-bold text-green-600">{problem.feedback.implementation}/10</div>
          <div className="text-sm text-gray-600">Implementation</div>
        </div>
        <div className="text-center p-3 bg-white rounded-lg border">
          <div className="text-xl font-bold text-orange-600">
            {problem.testCases.passed}/{problem.testCases.total}
          </div>
          <div className="text-sm text-gray-600">Test Cases</div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            Detailed Feedback
          </h4>
          <MaterialButton
            variant="text"
            size="small"
            onClick={() => setShowFeedback(!showFeedback)}
            endIcon={showFeedback ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          >
            {showFeedback ? "Hide" : "Show"}
          </MaterialButton>
        </div>

        {showFeedback && (
          <div className="space-y-4">
            {/* Overall Feedback */}
            <MaterialCard elevation={1} className="p-4 bg-blue-50 border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-2">Overall Assessment</h5>
              <p className="text-blue-800 text-sm">{problem.feedback.overall}</p>
            </MaterialCard>

            {/* Strengths */}
            <MaterialCard elevation={1} className="p-4 bg-green-50 border border-green-200">
              <h5 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Strengths
              </h5>
              <ul className="space-y-1">
                {problem.feedback.strengths.map((strength: string, idx: number) => (
                  <li key={idx} className="text-green-800 text-sm flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </MaterialCard>

            {/* Areas for Improvement */}
            <MaterialCard elevation={1} className="p-4 bg-orange-50 border border-orange-200">
              <h5 className="font-medium text-orange-900 mb-2 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Areas for Improvement
              </h5>
              <ul className="space-y-1">
                {problem.feedback.improvements.map((improvement: string, idx: number) => (
                  <li key={idx} className="text-orange-800 text-sm flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </MaterialCard>

            {/* Complexity Analysis */}
            <MaterialCard elevation={1} className="p-4 bg-purple-50 border border-purple-200">
              <h5 className="font-medium text-purple-900 mb-2">Complexity Analysis</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-purple-800 font-medium">Time Complexity:</span>
                  <div className="font-mono text-purple-900">{problem.feedback.timeComplexity}</div>
                </div>
                <div>
                  <span className="text-purple-800 font-medium">Space Complexity:</span>
                  <div className="font-mono text-purple-900">{problem.feedback.spaceComplexity}</div>
                </div>
              </div>
            </MaterialCard>
          </div>
        )}

        {/* Code Section */}
        <div className="flex items-center justify-between">
          <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
            <Code2 className="h-4 w-4 text-blue-600" />
            Your Solution
          </h4>
          <MaterialButton
            variant="text"
            size="small"
            onClick={() => setShowCode(!showCode)}
            endIcon={showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          >
            {showCode ? "Hide Code" : "Show Code"}
          </MaterialButton>
        </div>

        {showCode && (
          <MaterialCard elevation={1} className="p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Python Solution</span>
              <MaterialButton variant="text" size="small" onClick={copyCode} startIcon={<Copy className="h-3 w-3" />}>
                Copy
              </MaterialButton>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
              <code>{problem.solution}</code>
            </pre>
          </MaterialCard>
        )}

        {/* Test Cases */}
        <div className="flex items-center justify-between">
          <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
            <Target className="h-4 w-4 text-green-600" />
            Test Cases ({problem.testCases.passed}/{problem.testCases.total})
          </h4>
          <MaterialButton
            variant="text"
            size="small"
            onClick={() => setShowTestCases(!showTestCases)}
            endIcon={showTestCases ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          >
            {showTestCases ? "Hide" : "Show"}
          </MaterialButton>
        </div>

        {showTestCases && (
          <div className="space-y-2">
            {problem.testCases.details.map((testCase: any, idx: number) => (
              <MaterialCard
                key={idx}
                elevation={1}
                className={`p-3 ${testCase.status === "passed" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Test Case {idx + 1}</span>
                  <div className="flex items-center gap-1">
                    {testCase.status === "passed" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${testCase.status === "passed" ? "text-green-700" : "text-red-700"}`}
                    >
                      {testCase.status === "passed" ? "Passed" : "Failed"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-gray-600">Input:</span>
                    <div className="bg-gray-100 p-1 rounded">{testCase.input}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Expected:</span>
                    <div className="bg-gray-100 p-1 rounded">{testCase.expected}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Your Output:</span>
                    <div className={`p-1 rounded ${testCase.status === "passed" ? "bg-green-100" : "bg-red-100"}`}>
                      {testCase.actual}
                    </div>
                  </div>
                </div>
              </MaterialCard>
            ))}
          </div>
        )}
      </div>
    </MaterialCard>
  )
}

// Share Modal Component
function ShareModal({ isOpen, onClose, results }: { isOpen: boolean; onClose: () => void; results: any }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = `${window.location.origin}/contest/${results.contestId}/results`
  const shareText = results.prizeDetails?.hasWon
    ? `🎉 I just won ${formatCCAmount(results.prizeDetails.prizeAmount)} in "${results.contestTitle}"! Ranked #${results.userRank} out of ${results.totalParticipants} participants. 🏆`
    : `I just completed "${results.contestTitle}" and scored ${results.totalScore}/${results.maxScore} points! Ranked #${results.userRank} out of ${results.totalParticipants} participants. 🎯`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOptions = [
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      color: "bg-blue-500 hover:bg-blue-600",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      color: "bg-blue-700 hover:bg-blue-800",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "bg-green-500 hover:bg-green-600",
      url: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      color: "bg-pink-500 hover:bg-pink-600",
      url: "#",
    },
    {
      name: "Email",
      icon: <Mail className="h-5 w-5" />,
      color: "bg-gray-600 hover:bg-gray-700",
      url: `mailto:?subject=${encodeURIComponent("Check out my contest results!")}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <MaterialCard elevation={3} className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Share Your Results</h3>
          <MaterialButton variant="text" size="small" onClick={onClose}>
            ✕
          </MaterialButton>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">Share your achievement with friends and colleagues!</p>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Link href="#" className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
            />
            <MaterialButton
              variant="text"
              size="small"
              onClick={copyToClipboard}
              className={copied ? "text-green-600" : ""}
            >
              {copied ? "Copied!" : "Copy"}
            </MaterialButton>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 p-3 rounded-lg text-white transition-colors ${option.color}`}
              onClick={option.name === "Instagram" ? (e) => e.preventDefault() : undefined}
            >
              {option.icon}
              <span className="text-sm font-medium">{option.name}</span>
            </a>
          ))}
        </div>
      </MaterialCard>
    </div>
  )
}

export default function ContestResultsPage() {
  const params = useParams()
  const router = useRouter()
  const contestId = params.id as string

  const [results, setResults] = useState<any>(null)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  // Prefetch the homepage for faster navigation
  useEffect(() => {
    router.prefetch("/")
  }, [router])

  // Optimized navigation handler to redirect to homepage
  const handleBackToHomepage = useCallback(async () => {
    if (isNavigating) return // Prevent double clicks

    setIsNavigating(true)

    try {
      // Clear heavy data to improve performance
      setResults(null)

      // Use router.push for faster navigation to homepage
      await router.push("/")
    } catch (error) {
      console.error("Navigation error:", error)
      // Fallback to window.location for reliability
      window.location.href = "/"
    } finally {
      setIsNavigating(false)
    }
  }, [router, isNavigating])

  useEffect(() => {
    const loadResults = async () => {
      setIsLoading(true)

      // Get session data if available
      const sessionDataStr = localStorage.getItem(`contest_session_${contestId}`)
      const sessionData = sessionDataStr ? JSON.parse(sessionDataStr) : null

      // Simulate loading delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const contestResults = getContestResults(contestId, sessionData)
      setResults(contestResults)
      setIsLoading(false)
    }

    loadResults()
  }, [contestId])

  const downloadReport = async () => {
    setIsDownloading(true)

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create a comprehensive report
    const reportData = {
      contestInfo: {
        title: results.contestTitle,
        date: new Date().toLocaleDateString(),
        duration: results.contestDuration,
        totalParticipants: results.totalParticipants,
      },
      performance: {
        rank: results.userRank,
        score: results.totalScore,
        maxScore: results.maxScore,
        percentile: results.percentile,
        timeSpent: results.timeSpent,
      },
      problems: results.problems.map((problem: any) => ({
        title: problem.title,
        difficulty: problem.difficulty,
        status: problem.status,
        points: `${problem.earnedPoints}/${problem.maxPoints}`,
        attempts: problem.attempts,
        timeSpent: problem.timeSpent,
        aiVerification: problem.aiCrossCheck?.status || "pending",
        aiConfidence: problem.aiCrossCheck?.confidence || 0,
      })),
      insights: results.insights,
    }

    // Create and download the report
    const reportContent = `
CONTEST RESULTS REPORT
======================

Contest: ${reportData.contestInfo.title}
Date: ${reportData.contestInfo.date}
Duration: ${reportData.contestInfo.duration}
Total Participants: ${reportData.contestInfo.totalParticipants}

PERFORMANCE SUMMARY
==================
Rank: #${reportData.performance.rank}
Score: ${reportData.performance.score}/${reportData.performance.maxScore}
Percentile: ${reportData.performance.percentile}%
Time Spent: ${reportData.performance.timeSpent}

PROBLEM BREAKDOWN
================
${reportData.problems
  .map(
    (p: any, i: number) => `
${i + 1}. ${p.title} (${p.difficulty})
   Status: ${p.status.toUpperCase()}
   Points: ${p.points}
   Attempts: ${p.attempts}
   Time: ${p.timeSpent}
   AI Verification: ${p.aiVerification} (${p.aiConfidence}% confidence)
`,
  )
  .join("")}

INSIGHTS
========
Strong Areas: ${reportData.insights.strongAreas?.join(", ") || "N/A"}
Improvement Areas: ${reportData.insights.improvementAreas?.join(", ") || "N/A"}

Generated on: ${new Date().toLocaleString()}
    `

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `contest-results-${contestId}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsDownloading(false)
  }

  // Helper functions
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
    return <Trophy className="h-5 w-5 text-blue-500" />
  }

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
          <p className="text-sm text-gray-500 mt-2">Analyzing your performance and generating AI feedback...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load contest results</p>
          <MaterialButton onClick={() => router.push("/")} className="mt-4">
            Return to Home
          </MaterialButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <MaterialButton
                variant="text"
                size="medium"
                startIcon={
                  isNavigating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                  ) : (
                    <ArrowLeft className="h-4 w-4" />
                  )
                }
                onClick={handleBackToHomepage}
                disabled={isNavigating}
              >
                {isNavigating ? "Loading..." : "Back to Contest"}
              </MaterialButton>
              <div className="hidden sm:block h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-600">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Contest Results</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MaterialButton
                variant="outlined"
                size="medium"
                onClick={downloadReport}
                disabled={isDownloading}
                startIcon={
                  isDownloading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )
                }
              >
                {isDownloading ? "Generating..." : "Download Report"}
              </MaterialButton>
              <MaterialButton
                variant="outlined"
                size="medium"
                onClick={() => setShowShareModal(true)}
                startIcon={<Share2 className="h-4 w-4" />}
              >
                Share Results
              </MaterialButton>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <MaterialCard elevation={2} className="p-8 mb-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              {getRankIcon(results.userRank)}
              <h1 className="text-3xl font-bold text-gray-900">Contest Completed!</h1>
            </div>
            <h2 className="text-xl text-gray-600 mb-2">{results.contestTitle}</h2>
            <p className="text-gray-500">
              Finished in {results.timeSpent} out of {results.contestDuration}
            </p>
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">#{results.userRank}</div>
              <div className="text-sm text-blue-800">Your Rank</div>
              <div className="text-xs text-gray-600">out of {results.totalParticipants}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{results.totalScore}</div>
              <div className="text-sm text-green-800">Total Score</div>
              <div className="text-xs text-gray-600">out of {results.maxScore}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className={`text-3xl font-bold ${getPerformanceColor(results.percentile)}`}>
                {results.percentile}%
              </div>
              <div className="text-sm text-purple-800">Percentile</div>
              <div className="text-xs text-gray-600">performance</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{results.timeSpent}</div>
              <div className="text-sm text-orange-800">Time Taken</div>
              <div className="text-xs text-gray-600">total duration</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">
                {results.problems.filter((p: any) => p.status === "accepted").length}
              </div>
              <div className="text-sm text-yellow-800">Solved</div>
              <div className="text-xs text-gray-600">out of {results.problems.length}</div>
            </div>
          </div>

          {/* Prize Showcase Section */}
          <div className="mb-8">
            {results.prizeDetails?.hasWon ? (
              // Winner Display
              <MaterialCard
                elevation={2}
                className="p-6 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border-2 border-yellow-300"
              >
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-yellow-500">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-yellow-800">🎉 Congratulations!</h3>
                      <p className="text-yellow-700">You won a prize in this contest!</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 border-2 border-yellow-200 mb-4">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">{results.prizeDetails.prizeName}</div>
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      <span className="text-2xl font-bold text-green-600 flex items-center gap-2">
                        <Coins className="h-6 w-6" />
                        {formatCCAmount(results.prizeDetails.prizeAmount)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{results.prizeDetails.prizeDescription}</p>

                    <div className="flex items-center justify-center gap-2 mb-3">
                      <MaterialBadge variant="default" className="bg-yellow-100 text-yellow-800">
                        {results.prizeDetails.achievement}
                      </MaterialBadge>
                      <MaterialBadge variant="default" className="bg-green-100 text-green-800">
                        Prize Winner
                      </MaterialBadge>
                    </div>

                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Info className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Payment Status: </span>
                        <span className="capitalize text-blue-700">{results.prizeDetails.paymentStatus}</span>
                      </div>
                      <p className="text-blue-700">{results.prizeDetails.paymentInfo}</p>
                    </div>

                    {results.prizeDetails.bonusInfo && (
                      <div className="mt-3 text-sm text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-200">
                        <Sparkles className="h-4 w-4 inline mr-1" />
                        {results.prizeDetails.bonusInfo}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <MaterialButton
                      size="large"
                      onClick={() => router.push("/wallet")}
                      startIcon={<Award className="h-5 w-5" />}
                    >
                      View Wallet
                    </MaterialButton>
                    <MaterialButton
                      size="large"
                      variant="outlined"
                      onClick={() => setShowShareModal(true)}
                      startIcon={<Share2 className="h-5 w-5" />}
                    >
                      Share Victory
                    </MaterialButton>
                  </div>
                </div>
              </MaterialCard>
            ) : (
              // Non-winner Encouragement Display
              <MaterialCard
                elevation={1}
                className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-blue-500">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-blue-800">Keep Going Strong!</h3>
                      <p className="text-blue-600">Every contest makes you better</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-5 border border-blue-200 mb-4">
                    <p className="text-lg text-gray-800 mb-3">{results.prizeDetails?.message}</p>
                    <p className="text-blue-700 font-medium mb-3">{results.prizeDetails?.encouragement}</p>

                    {results.prizeDetails?.achievement && (
                      <MaterialBadge variant="default" className="bg-blue-100 text-blue-800 mb-3">
                        {results.prizeDetails.achievement}
                      </MaterialBadge>
                    )}

                    {results.prizeDetails?.missedBy && (
                      <div className="text-sm text-orange-700 bg-orange-50 p-3 rounded-lg border border-orange-200 mb-3">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        You were just {results.prizeDetails.missedBy} positions away from the prize zone!
                      </div>
                    )}

                    <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                      <Lightbulb className="h-4 w-4 inline mr-1" />
                      {results.prizeDetails?.nextContestInfo}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <MaterialButton
                      size="large"
                      onClick={() => router.push("/")}
                      startIcon={<Zap className="h-5 w-5" />}
                    >
                      Join Next Contest
                    </MaterialButton>
                    <MaterialButton
                      size="large"
                      variant="outlined"
                      onClick={() => setShowLeaderboard(!showLeaderboard)}
                      startIcon={<Trophy className="h-5 w-5" />}
                    >
                      {showLeaderboard ? "Hide Leaderboard" : "View Leaderboard"}
                    </MaterialButton>
                  </div>
                </div>
              </MaterialCard>
            )}
          </div>
        </MaterialCard>

        {/* AI Analysis Summary */}
        <MaterialCard
          elevation={1}
          className="p-6 mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-600">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Analysis Summary</h3>
              <p className="text-sm text-gray-600">Comprehensive code review powered by artificial intelligence</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                {results.problems.filter((p: any) => p.aiCrossCheck?.status === "verified").length}
              </div>
              <div className="text-sm text-gray-600">AI Verified Solutions</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-yellow-600">
                {results.problems.filter((p: any) => p.aiCrossCheck?.status === "needs_improvement").length}
              </div>
              <div className="text-sm text-gray-600">Need Improvement</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(
                  results.problems.reduce((acc: number, p: any) => acc + (p.aiCrossCheck?.confidence || 0), 0) /
                    results.problems.length,
                )}
                %
              </div>
              <div className="text-sm text-gray-600">Average AI Confidence</div>
            </div>
          </div>
        </MaterialCard>

        {/* Leaderboard */}
        {showLeaderboard && (
          <MaterialCard elevation={1} className="p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Contest Leaderboard
            </h3>
            <div className="space-y-2">
              {results.leaderboard.map((participant: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    participant.name === "You"
                      ? "bg-blue-50 border-2 border-blue-200"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(participant.rank)}
                      <span className="font-bold text-lg">#{participant.rank}</span>
                    </div>
                    <div>
                      <div className={`font-medium ${participant.name === "You" ? "text-blue-900" : "text-gray-900"}`}>
                        {participant.name}
                      </div>
                      <div className="text-sm text-gray-600">{participant.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-green-600">{participant.score} pts</div>
                    {participant.prize > 0 && (
                      <div className="text-sm text-yellow-600 flex items-center gap-1">
                        <Coins className="h-3 w-3" />
                        {formatCCAmount(participant.prize)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </MaterialCard>
        )}

        {/* Problem Analysis */}
        <div className="space-y-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-blue-600" />
            Detailed Problem Analysis
          </h3>
          {results.problems.map((problem: any, index: number) => (
            <ProblemAnalysis key={problem.id} problem={problem} index={index} />
          ))}
        </div>

        {/* Insights and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Insights */}
          <MaterialCard elevation={1} className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Performance Insights
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-900 mb-2">Strong Areas</h4>
                <div className="space-y-1">
                  {results.insights.strongAreas?.map((area: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-green-700">
                      <Star className="h-4 w-4" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-orange-900 mb-2">Areas for Improvement</h4>
                <div className="space-y-1">
                  {results.insights.improvementAreas?.map((area: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-orange-700">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MaterialCard>

          {/* AI Recommendations */}
          <MaterialCard elevation={1} className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-600" />
              AI-Powered Recommendations
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Study Recommendations</h4>
                <div className="space-y-2">
                  {results.insights.recommendations?.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-blue-700">
                      <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-purple-900 mb-2">Next Steps</h4>
                <div className="space-y-2">
                  {results.insights.nextSteps?.map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-purple-700">
                      <Target className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MaterialCard>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} results={results} />
    </div>
  )
}
