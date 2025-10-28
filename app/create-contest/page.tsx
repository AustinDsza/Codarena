"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  Code2,
  Palette,
  Shield,
  Eye,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Crown,
  Zap,
  Lock,
  Globe,
  Camera,
  Monitor,
  Copy,
  Brain,
  Star,
  Settings,
  FileText,
  LinkIcon,
  Github,
  Figma,
  Plus,
  Trash2,
  Edit,
  Timer,
  Shuffle,
  BarChart3,
  PlayCircle,
  Lightbulb,
  Calculator,
  DollarSign,
  Gift,
  Swords,
  Flame,
  UserCheck,
  Building,
  LogOut,
  CreditCard,
  Send,
  X,
  Coins,
  Upload,
  Download,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context-supabase"

// Function to format Codarena Coins amount
const formatCCAmount = (amount: number): string => {
  return `${amount.toLocaleString("en-IN")} CC`
}

interface MCQQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  difficulty: "easy" | "medium" | "hard"
}

interface DSAQuestion {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  timeLimit: number
  memoryLimit: number
  sampleInput: string
  sampleOutput: string
  constraints: string
  tags: string[]
}

interface DesignProblem {
  id: string
  title: string
  description: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  requirements: string[]
  deliverables?: string[]
}

interface PrizeDistribution {
  position: string
  percentage: number
  amount: number
  count: number
}

interface ContestForm {
  title: string
  description: string
  type: "dsa" | "ui-ux" | "mcq" | "vibe-coding" | "graphic-design" | "api-design" | ""
  difficulty: string
  duration: string
  startDate: string
  startTime: string
  maxParticipants: string
  entryFee: string
  prizePool: string
  prizeType: "cash" | "free"
  visibility: "public" | "private"
  judging: "auto" | "manual"
  winnerCriteria: "timing" | "correctness" | "creativity" | "comprehensive"
  numberOfWinners: string
  prizeDistribution: PrizeDistribution[]
  customDistribution: boolean
  prizeStructure: "winner-takes-all" | "top-3" | "top-5" | "top-10" | "custom"
  newUserDiscount: number
  battleMode: {
    enabled: boolean
    type: "1v1" | "tournament" | "none"
  }
  // DSA specific
  enableProctoring: boolean
  copyPasteTracking: boolean
  tabSwitchDetection: boolean
  imageProctoring: boolean
  multiMonitorDetection: boolean
  secureMode: boolean
  plagiarismDetection: boolean
  codingLanguages: string[]
  dsaQuestions: DSAQuestion[]
  // UI/UX specific
  allowedSubmissions: string[]
  evaluationCriteria: string
  designProblems: DesignProblem[]
  // MCQ specific
  mcqQuestions: MCQQuestion[]
  timePerQuestion: string
  randomizeQuestions: boolean
  showResults: boolean
}

// Sample data for different contest types
const sampleData = {
  "ui-ux": {
    problems: [
      {
        id: "1",
        title: "E-commerce Product Page Redesign",
        description:
          "Design a modern, conversion-optimized product page for an e-commerce platform. Focus on user experience, visual hierarchy, and mobile responsiveness.",
        category: "E-commerce/Retail",
        difficulty: "medium" as const,
        requirements: [
          "Mobile-first design",
          "Product image gallery",
          "Customer reviews section",
          "Add to cart functionality",
        ],
        deliverables: ["Figma/Adobe XD file", "Responsive mockups", "Design system documentation"],
      },
      {
        id: "2",
        title: "SaaS Dashboard Interface",
        description:
          "Create a clean, intuitive dashboard for a project management SaaS tool. Include data visualization, navigation, and user-friendly controls.",
        category: "SaaS/Business",
        difficulty: "hard" as const,
        requirements: [
          "Data visualization charts",
          "Responsive sidebar navigation",
          "Dark/light mode toggle",
          "User profile management",
        ],
        deliverables: ["Interactive prototype", "Component library", "User flow documentation"],
      },
    ],
    evaluationCriteria:
      "Evaluation will be based on:\n\n1. Visual Design (30%)\n   - Color scheme and typography\n   - Layout and composition\n   - Visual hierarchy\n\n2. User Experience (25%)\n   - Navigation and usability\n   - Responsive design\n   - Accessibility considerations\n\n3. Creativity & Innovation (25%)\n   - Unique design approach\n   - Creative problem solving\n   - Original visual elements\n\n4. Technical Implementation (20%)\n   - Code quality and structure\n   - Performance optimization\n   - Cross-browser compatibility",
  },
  dsa: [
    {
      id: "1",
      title: "Two Sum",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      difficulty: "easy" as const,
      timeLimit: 1000,
      memoryLimit: 256,
      sampleInput: "nums = [2,7,11,15], target = 9",
      sampleOutput: "[0,1]",
      constraints: "2 ≤ nums.length ≤ 10⁴\n-10⁹ ≤ nums[i] ≤ 10⁹\n-10⁹ ≤ target ≤ 10⁹",
      tags: ["Array", "Hash Table"],
    },
    {
      id: "2",
      title: "Valid Parentheses",
      description:
        "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      difficulty: "easy" as const,
      timeLimit: 1000,
      memoryLimit: 256,
      sampleInput: 's = "()"',
      sampleOutput: "true",
      constraints: "1 ≤ s.length ≤ 10⁴\ns consists of parentheses only '()[]{}'.",
      tags: ["String", "Stack"],
    },
  ],
  mcq: [
    {
      id: "1",
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: 1,
      explanation:
        "Binary search divides the search space in half with each iteration, resulting in O(log n) complexity.",
      difficulty: "medium" as const,
    },
    {
      id: "2",
      question: "Which data structure uses LIFO (Last In, First Out) principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: 1,
      explanation: "Stack follows LIFO principle where the last element added is the first one to be removed.",
      difficulty: "easy" as const,
    },
  ],
}

const codingLanguages = [
  { id: "python", name: "Python", icon: "🐍" },
  { id: "javascript", name: "JavaScript", icon: "🟨" },
  { id: "java", name: "Java", icon: "☕" },
  { id: "cpp", name: "C++", icon: "⚡" },
  { id: "c", name: "C", icon: "🔧" },
  { id: "go", name: "Go", icon: "🐹" },
  { id: "rust", name: "Rust", icon: "🦀" },
  { id: "typescript", name: "TypeScript", icon: "🔷" },
]

// Contest name suggestions based on type and schedule
const contestNameSuggestions = {
  dsa: {
    daily: [
      "⚡ Lightning Code Battle",
      "🔥 Algorithm Gladiator Arena",
      "🚀 Daily Code Crusher",
      "⚔️ Binary Battle Royale",
      "🎯 Precision Programming Duel",
    ],
    weekend: [
      "👑 Weekend Code Championship",
      "🏆 Algorithm Master Tournament",
      "💎 Elite Coding Challenge",
      "🌟 Weekend Warrior Contest",
    ],
    special: [
      "🎊 Mega Championship Battle",
      "🔥 Ultimate Code Showdown",
      "💫 Grand Algorithm Tournament",
      "🏅 Elite Developer Championship",
    ],
  },
  mcq: {
    daily: [
      "🧠 Brain Burst Challenge",
      "🚀 Rapid Fire Logic Showdown",
      "⚡ Quick Think Battle",
      "🎯 Logic Lightning Round",
      "🔥 Mental Agility Test",
    ],
    weekend: [
      "🏆 Weekend Quiz Championship",
      "💎 Logic Master Challenge",
      "🌟 Knowledge Warrior Contest",
      "👑 Quiz Royale Weekend",
    ],
  },
  "ui-ux": {
    weekend: [
      "🎨 Weekend Design Masterclass",
      "✨ Creative Genius Weekend",
      "🏆 Design Excellence Challenge",
      "💎 UI/UX Championship",
      "🌟 Creative Vision Contest",
    ],
    special: [
      "🎊 Design Innovation Summit",
      "🔥 Creative Showdown",
      "💫 Ultimate Design Challenge",
      "🏅 Design Master Tournament",
    ],
  },
}

// Default prize distribution schemes
const defaultDistributionSchemes = {
  "winner-takes-all": [{ position: "Winner", percentage: 100, amount: 0, count: 1 }],
  "top-3": [
    { position: "1st", percentage: 60, amount: 0, count: 1 },
    { position: "2nd", percentage: 25, amount: 0, count: 1 },
    { position: "3rd", percentage: 15, amount: 0, count: 1 },
  ],
  "top-5": [
    { position: "1st", percentage: 40, amount: 0, count: 1 },
    { position: "2nd", percentage: 25, amount: 0, count: 1 },
    { position: "3rd", percentage: 20, amount: 0, count: 1 },
    { position: "4th-5th", percentage: 15, amount: 0, count: 2 },
  ],
  "top-10": [
    { position: "1st", percentage: 30, amount: 0, count: 1 },
    { position: "2nd", percentage: 20, amount: 0, count: 1 },
    { position: "3rd", percentage: 15, amount: 0, count: 1 },
    { position: "4th-5th", percentage: 15, amount: 0, count: 2 },
    { position: "6th-10th", percentage: 20, amount: 0, count: 5 },
  ],
}

// MCQ Question Form Component
function MCQQuestionForm({ question, onSave, onCancel }: {
  question: MCQQuestion | null
  onSave: (question: MCQQuestion) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<MCQQuestion>(
    question || {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    }
  )

  const handleSave = () => {
    if (!formData.question.trim()) return
    if (formData.options.filter(opt => opt.trim()).length < 2) return
    onSave(formData)
  }

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const csv = e.target?.result as string
      const lines = csv.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        alert('CSV must have at least a header row and one data row')
        return
      }

      const headers = lines[0].split(',').map(h => h.trim())
      const requiredHeaders = ['question', 'option1', 'option2', 'option3', 'option4', 'correctAnswer']
      
      if (!requiredHeaders.every(h => headers.includes(h))) {
        alert('CSV must have columns: question, option1, option2, option3, option4, correctAnswer')
        return
      }

      const questions: MCQQuestion[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        if (values.length >= 6) {
          const correctAnswer = parseInt(values[5]) - 1 // Convert to 0-based index
          if (correctAnswer >= 0 && correctAnswer < 4) {
            questions.push({
              id: Date.now().toString() + i,
              question: values[0],
              options: [values[1], values[2], values[3], values[4]],
              correctAnswer: correctAnswer,
              explanation: values[6] || '',
            })
          }
        }
      }

      if (questions.length > 0) {
        // Add all questions to the contest form
        questions.forEach(q => onSave(q))
        alert(`Successfully imported ${questions.length} questions from CSV`)
      } else {
        alert('No valid questions found in CSV')
      }
    }
    reader.readAsText(file)
  }

  const downloadSampleCSV = () => {
    const sampleData = `question,option1,option2,option3,option4,correctAnswer,explanation
"What is the capital of France?","London","Paris","Berlin","Madrid",2,"Paris is the capital and largest city of France."
"What is 2 + 2?","3","4","5","6",2,"2 + 2 equals 4."
"What is the largest planet in our solar system?","Earth","Jupiter","Saturn","Mars",2,"Jupiter is the largest planet in our solar system."`
    
    const blob = new Blob([sampleData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_mcq_questions.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="question">Question</Label>
        <Textarea
          id="question"
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          placeholder="Enter your question here..."
          className="mt-1"
        />
      </div>

      <div>
        <Label>Options</Label>
        <RadioGroup
          value={formData.correctAnswer.toString()}
          onValueChange={(value) => setFormData({ ...formData, correctAnswer: parseInt(value) })}
        >
          <div className="space-y-2 mt-2">
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-sm font-normal">
                    Option {index + 1}
                  </Label>
                </div>
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...formData.options]
                    newOptions[index] = e.target.value
                    setFormData({ ...formData, options: newOptions })
                  }}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="explanation">Explanation (Optional)</Label>
        <Textarea
          id="explanation"
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          placeholder="Explain why this is the correct answer..."
          className="mt-1"
        />
      </div>

      {/* CSV Upload Section */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium">Bulk Import from CSV</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadSampleCSV}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Sample CSV
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
            id="csv-upload"
          />
          <Label
            htmlFor="csv-upload"
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-sm"
          >
            <Upload className="h-4 w-4" />
            Choose CSV File
          </Label>
          <span className="text-xs text-gray-500">
            Upload multiple questions at once
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          <p><strong>CSV Format:</strong> question, option1, option2, option3, option4, correctAnswer, explanation</p>
          <p><strong>Note:</strong> correctAnswer should be 1-4 (1 for first option, 2 for second, etc.)</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {question ? "Update" : "Add"} Question
        </Button>
      </div>
    </div>
  )
}

// DSA Problem Form Component
function DSAProblemForm({ problem, onSave, onCancel }: {
  problem: DSAQuestion | null
  onSave: (problem: DSAQuestion) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<DSAQuestion>(
    problem || {
      id: Date.now().toString(),
      title: "",
      description: "",
      difficulty: "easy",
      timeLimit: "60",
      memoryLimit: "256",
      testCases: [],
      constraints: "",
      examples: [],
    }
  )

  const handleSave = () => {
    if (!formData.title.trim() || !formData.description.trim()) return
    onSave(formData)
  }

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const csv = e.target?.result as string
      const lines = csv.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        alert('CSV must have at least a header row and one data row')
        return
      }

      const headers = lines[0].split(',').map(h => h.trim())
      const requiredHeaders = ['title', 'description', 'difficulty', 'timeLimit', 'constraints']
      
      if (!requiredHeaders.every(h => headers.includes(h))) {
        alert('CSV must have columns: title, description, difficulty, timeLimit, constraints')
        return
      }

      const problems: DSAQuestion[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        if (values.length >= 5) {
          problems.push({
            id: Date.now().toString() + i,
            title: values[0],
            description: values[1],
            difficulty: values[2] as "easy" | "medium" | "hard",
            timeLimit: values[3],
            memoryLimit: "256",
            testCases: [],
            constraints: values[4],
            examples: [],
          })
        }
      }

      if (problems.length > 0) {
        // Add all problems to the contest form
        problems.forEach(p => onSave(p))
        alert(`Successfully imported ${problems.length} problems from CSV`)
      } else {
        alert('No valid problems found in CSV')
      }
    }
    reader.readAsText(file)
  }

  const downloadSampleCSV = () => {
    const sampleData = `title,description,difficulty,timeLimit,constraints
"Two Sum","Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.","easy","60","2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9"
"Reverse Linked List","Given the head of a singly linked list, reverse the list and return the reversed list.","medium","120","The number of nodes in the list is in the range [0, 5000]. -5000 <= Node.val <= 5000"
"Binary Tree Inorder Traversal","Given the root of a binary tree, return the inorder traversal of its nodes' values.","easy","90","The number of nodes in the tree is in the range [0, 100]. -100 <= Node.val <= 100"`
    
    const blob = new Blob([sampleData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_dsa_problems.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Problem Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter problem title..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Problem Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the problem..."
          className="mt-1"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
          <Input
            id="timeLimit"
            type="number"
            value={formData.timeLimit}
            onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="constraints">Constraints</Label>
        <Textarea
          id="constraints"
          value={formData.constraints}
          onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
          placeholder="Enter problem constraints..."
          className="mt-1"
          rows={2}
        />
      </div>

      {/* CSV Upload Section */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium">Bulk Import from CSV</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadSampleCSV}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Sample CSV
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
            id="dsa-csv-upload"
          />
          <Label
            htmlFor="dsa-csv-upload"
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-sm"
          >
            <Upload className="h-4 w-4" />
            Choose CSV File
          </Label>
          <span className="text-xs text-gray-500">
            Upload multiple problems at once
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          <p><strong>CSV Format:</strong> title, description, difficulty, timeLimit, constraints</p>
          <p><strong>Note:</strong> difficulty should be easy, medium, or hard</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {problem ? "Update" : "Add"} Problem
        </Button>
      </div>
    </div>
  )
}

// Design Problem Form Component
function DesignProblemForm({ problem, onSave, onCancel }: {
  problem: DesignProblem | null
  onSave: (problem: DesignProblem) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<DesignProblem>(
    problem || {
      id: Date.now().toString(),
      title: "",
      description: "",
      difficulty: "easy",
      requirements: [],
      deliverables: [],
      evaluationCriteria: "",
    }
  )

  const handleSave = () => {
    if (!formData.title.trim() || !formData.description.trim()) return
    onSave(formData)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Problem Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter design challenge title..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Problem Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the design challenge..."
          className="mt-1"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select
          value={formData.difficulty}
          onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="evaluationCriteria">Evaluation Criteria</Label>
        <Textarea
          id="evaluationCriteria"
          value={formData.evaluationCriteria}
          onChange={(e) => setFormData({ ...formData, evaluationCriteria: e.target.value })}
          placeholder="How will this design be evaluated?"
          className="mt-1"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {problem ? "Update" : "Add"} Problem
        </Button>
      </div>
    </div>
  )
}

export default function CreateContestPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [userTier, setUserTier] = useState<"regular" | "verified">("regular")
  const [demoMode, setDemoMode] = useState(false) // Always false - no demo mode
  // Demo modal removed
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingMCQ, setEditingMCQ] = useState<MCQQuestion | null>(null)
  const [editingDSA, setEditingDSA] = useState<DSAQuestion | null>(null)
  const [editingDesign, setEditingDesign] = useState<DesignProblem | null>(null)
  const [showMCQForm, setShowMCQForm] = useState(false)
  const [showDSAForm, setShowDSAForm] = useState(false)
  const [showDesignForm, setShowDesignForm] = useState(false)
  const [showPrizeCalculator, setShowPrizeCalculator] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()

  const [contestForm, setContestForm] = useState<ContestForm>({
    title: "",
    description: "",
    type: "",
    difficulty: "",
    duration: "",
    startDate: "",
    startTime: "",
    maxParticipants: "15", // Default to 15, will be updated based on userTier
    entryFee: "0",
    prizePool: "",
    prizeType: "free",
    visibility: "private", // Default to private, will be updated based on userTier
    judging: "auto",
    winnerCriteria: "timing",
    numberOfWinners: "1",
    prizeDistribution: [],
    customDistribution: false,
    prizeStructure: "winner-takes-all",
    newUserDiscount: 0,
    battleMode: {
      enabled: false,
      type: "none",
    },
    // DSA specific
    enableProctoring: false,
    copyPasteTracking: userTier === "regular" ? true : false,
    tabSwitchDetection: userTier === "regular" ? true : false,
    imageProctoring: false,
    multiMonitorDetection: false,
    secureMode: false,
    plagiarismDetection: false,
    codingLanguages: [],
    dsaQuestions: [],
    // UI/UX specific
    allowedSubmissions: [],
    evaluationCriteria: "",
    designProblems: [],
    // MCQ specific
    mcqQuestions: [],
    timePerQuestion: "60",
    randomizeQuestions: false,
    showResults: true,
  })

  // Update form based on userTier changes
  useEffect(() => {
    setContestForm((prev) => ({
      ...prev,
      maxParticipants: userTier === "regular" ? "15" : "",
      visibility: userTier === "regular" ? "private" : "public",
    }))
  }, [userTier])

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    router.push('/login')
    return null
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const calculatePrizePool = () => {
    const entryFee = Number.parseFloat(contestForm.entryFee) || 0
    const maxParticipants = Number.parseInt(contestForm.maxParticipants) || 0
    const totalCollected = entryFee * maxParticipants

    // Apply commission based on user tier and demo mode
    let platformFee = 0
    if (userTier === "regular" && demoMode) {
      platformFee = totalCollected * 0.05 // 5% commission for regular users in demo mode
    } else if (userTier === "verified") {
      platformFee = 0 // No commission for verified users (subscription model)
    } else {
      platformFee = totalCollected * 0.05 // Default 5% for regular users
    }

    const prizePool = totalCollected - platformFee
    return {
      totalCollected,
      platformFee,
      prizePool,
    }
  }

  const updatePrizeDistribution = () => {
    const { prizePool } = calculatePrizePool()
    const prizeStructure = contestForm.prizeStructure

    if (prizeStructure in defaultDistributionSchemes && !contestForm.customDistribution) {
      const scheme = defaultDistributionSchemes[prizeStructure as keyof typeof defaultDistributionSchemes]
      const updatedDistribution = scheme.map((item) => ({
        ...item,
        amount: Math.round((prizePool * item.percentage) / 100),
      }))

      setContestForm((prev) => ({
        ...prev,
        prizeDistribution: updatedDistribution,
        prizePool: prizePool.toString(),
      }))
    }
  }

  const generateContestName = () => {
    const type = contestForm.type as keyof typeof contestNameSuggestions
    const defaultSchedule = "daily" // Use daily as default, or "special" for variety

    if (type in contestNameSuggestions && defaultSchedule in contestNameSuggestions[type]) {
      const suggestions = contestNameSuggestions[type][defaultSchedule] as string[]
      const randomName = suggestions[Math.floor(Math.random() * suggestions.length)]
      setContestForm((prev) => ({ ...prev, title: randomName }))
    }
  }

  const handleInputChange = (field: keyof ContestForm, value: any) => {
    setContestForm((prev) => ({ ...prev, [field]: value }))

    // Auto-calculate prize pool when entry fee or participants change
    if (field === "entryFee" || field === "maxParticipants") {
      setTimeout(() => {
        updatePrizeDistribution()
      }, 100)
    }

    // Update prize distribution when structure changes
    if (field === "prizeStructure") {
      setTimeout(() => {
        updatePrizeDistribution()
      }, 100)
    }
  }

  const handleSubmissionTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setContestForm((prev) => ({
        ...prev,
        allowedSubmissions: [...prev.allowedSubmissions, type],
      }))
    } else {
      setContestForm((prev) => ({
        ...prev,
        allowedSubmissions: prev.allowedSubmissions.filter((t) => t !== type),
      }))
    }
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      setContestForm((prev) => ({
        ...prev,
        codingLanguages: [...prev.codingLanguages, language],
      }))
    } else {
      setContestForm((prev) => ({
        ...prev,
        codingLanguages: prev.codingLanguages.filter((l) => l !== language),
      }))
    }
  }

  const addMCQQuestion = (question: MCQQuestion) => {
    setContestForm((prev) => ({
      ...prev,
      mcqQuestions: [...prev.mcqQuestions, question],
    }))
  }

  const updateMCQQuestion = (questionId: string, updatedQuestion: MCQQuestion) => {
    setContestForm((prev) => ({
      ...prev,
      mcqQuestions: prev.mcqQuestions.map((q) => (q.id === questionId ? updatedQuestion : q)),
    }))
  }

  const deleteMCQQuestion = (questionId: string) => {
    setContestForm((prev) => ({
      ...prev,
      mcqQuestions: prev.mcqQuestions.filter((q) => q.id !== questionId),
    }))
  }

  const addDSAQuestion = (question: DSAQuestion) => {
    setContestForm((prev) => ({
      ...prev,
      dsaQuestions: [...prev.dsaQuestions, question],
    }))
  }

  const updateDSAQuestion = (questionId: string, updatedQuestion: DSAQuestion) => {
    setContestForm((prev) => ({
      ...prev,
      dsaQuestions: prev.dsaQuestions.map((q) => (q.id === questionId ? updatedQuestion : q)),
    }))
  }

  const deleteDSAQuestion = (questionId: string) => {
    setContestForm((prev) => ({
      ...prev,
      dsaQuestions: prev.dsaQuestions.filter((q) => q.id !== questionId),
    }))
  }

  const addDesignProblem = (problem: DesignProblem) => {
    setContestForm((prev) => ({
      ...prev,
      designProblems: [...prev.designProblems, problem],
    }))
  }

  const updateDesignProblem = (problemId: string, updatedProblem: DesignProblem) => {
    setContestForm((prev) => ({
      ...prev,
      designProblems: prev.designProblems.map((p) => (p.id === problemId ? updatedProblem : p)),
    }))
  }

  const deleteDesignProblem = (problemId: string) => {
    setContestForm((prev) => ({
      ...prev,
      designProblems: prev.designProblems.filter((p) => p.id !== problemId),
    }))
  }

  const loadSampleData = () => {
    if (contestForm.type === "mcq") {
      setContestForm((prev) => ({
        ...prev,
        mcqQuestions: [
          ...prev.mcqQuestions,
          ...sampleData.mcq.map((q) => ({ ...q, id: Date.now().toString() + Math.random() })),
        ],
      }))
    } else if (contestForm.type === "dsa") {
      setContestForm((prev) => ({
        ...prev,
        dsaQuestions: [
          ...prev.dsaQuestions,
          ...sampleData.dsa.map((q) => ({ ...q, id: Date.now().toString() + Math.random() })),
        ],
        codingLanguages: ["python", "javascript", "java", "cpp"],
      }))
    } else if (["ui-ux", "vibe-coding", "graphic-design", "api-design"].includes(contestForm.type)) {
      const typeKey = contestForm.type as keyof typeof sampleData
      if (typeKey in sampleData && typeof sampleData[typeKey] === "object" && "problems" in sampleData[typeKey]) {
        const data = sampleData[typeKey] as { problems: DesignProblem[]; evaluationCriteria: string }
        setContestForm((prev) => ({
          ...prev,
          designProblems: [
            ...prev.designProblems,
            ...data.problems.map((p) => ({ ...p, id: Date.now().toString() + Math.random() })),
          ],
          evaluationCriteria: data.evaluationCriteria,
        }))
      }
    }
  }

  // Demo mode removed - always create real contests

  const exitDemoMode = () => {
    setDemoMode(false)
    setUserTier("regular")
    // Reset form to default state
    setContestForm({
      title: "",
      description: "",
      type: "",
      difficulty: "",
      duration: "",
      startDate: "",
      startTime: "",
      maxParticipants: "15",
      entryFee: "0",
      prizePool: "",
      prizeType: "free",
      visibility: "private",
      judging: "auto",
      winnerCriteria: "timing",
      numberOfWinners: "1",
      prizeDistribution: [],
      customDistribution: false,
      prizeStructure: "winner-takes-all",
      newUserDiscount: 0,
      battleMode: {
        enabled: false,
        type: "none",
      },
      enableProctoring: false,
      copyPasteTracking: true,
      tabSwitchDetection: true,
      imageProctoring: false,
      multiMonitorDetection: false,
      secureMode: false,
      plagiarismDetection: false,
      codingLanguages: [],
      dsaQuestions: [],
      allowedSubmissions: [],
      evaluationCriteria: "",
      designProblems: [],
      mcqQuestions: [],
      timePerQuestion: "60",
      randomizeQuestions: false,
      showResults: true,
    })
    setCurrentStep(1)
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmitContest = () => {
    setShowConfirmationModal(true)
  }

  const handleConfirmSubmission = async () => {
    if (!isAuthenticated || !user) {
      setError("You must be logged in to create a contest")
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      // Prepare contest data for API
      const startDateTime = new Date(`${contestForm.startDate}T${contestForm.startTime}`)
      const endDateTime = new Date(startDateTime.getTime() + parseInt(contestForm.duration) * 60 * 1000)

      const contestData = {
        title: contestForm.title,
        description: contestForm.description,
        type: contestForm.type,
        category: contestForm.type, // Using type as category for now
        entry_fee: parseInt(contestForm.entryFee) || 0,
        prize_pool: parseInt(contestForm.prizePool) || 0,
        max_participants: parseInt(contestForm.maxParticipants) || 15,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        difficulty: contestForm.difficulty,
        visibility: contestForm.visibility,
        judging: contestForm.judging,
        winner_criteria: contestForm.winnerCriteria,
        number_of_winners: parseInt(contestForm.numberOfWinners) || 1,
        prize_structure: contestForm.prizeStructure,
        new_user_discount: contestForm.newUserDiscount,
        battle_mode: contestForm.battleMode,
        // DSA specific
        enable_proctoring: contestForm.enableProctoring,
        copy_paste_tracking: contestForm.copyPasteTracking,
        tab_switch_detection: contestForm.tabSwitchDetection,
        image_proctoring: contestForm.imageProctoring,
        multi_monitor_detection: contestForm.multiMonitorDetection,
        secure_mode: contestForm.secureMode,
        plagiarism_detection: contestForm.plagiarismDetection,
        coding_languages: contestForm.codingLanguages,
        // UI/UX specific
        allowed_submissions: contestForm.allowedSubmissions,
        evaluation_criteria: contestForm.evaluationCriteria,
        // MCQ specific
        time_per_question: parseInt(contestForm.timePerQuestion) || 60,
        randomize_questions: contestForm.randomizeQuestions,
        show_results: contestForm.showResults,
        // Problems/Questions
        problems: [
          ...contestForm.dsaQuestions.map(q => ({
            title: q.title,
            description: q.description,
            difficulty: q.difficulty,
            points: 100, // Default points
            constraints: q.constraints,
            hints: [],
            test_cases: q.testCases || [],
            type: 'dsa'
          })),
          ...contestForm.mcqQuestions.map(q => ({
            title: q.question,
            description: q.question,
            difficulty: 'medium', // Default for MCQ
            points: 50, // Default points
            constraints: '',
            hints: [],
            test_cases: [],
            type: 'mcq',
            options: q.options,
            correct_answer: q.correctAnswer,
            explanation: q.explanation
          })),
          ...contestForm.designProblems.map(p => ({
            title: p.title,
            description: p.description,
            difficulty: p.difficulty,
            points: 100, // Default points
            constraints: '',
            hints: [],
            test_cases: [],
            type: 'design',
            requirements: p.requirements,
            deliverables: p.deliverables,
            evaluation_criteria: p.evaluationCriteria
          }))
        ]
      }

      // Call the API to create contest
      const response = await fetch('/api/contests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`, // Using user ID as auth for now
        },
        body: JSON.stringify(contestData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create contest')
      }

      const result = await response.json()
      
      // Generate invitation code for the contest
      const invitationCode = `${contestForm.type.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`

      // Store contest data and invitation code in localStorage for the homepage notification
      const notificationData = {
        title: contestForm.title,
        type: contestForm.type,
        invitationCode,
        isDemo: demoMode,
        createdAt: new Date().toISOString(),
        contestId: result.contest.id,
      }

      localStorage.setItem("newContestCreated", JSON.stringify(notificationData))

      // Show success message
      setSuccess(`Contest "${contestForm.title}" created successfully!`)
      
      // Close modal and redirect to homepage after a short delay
      setTimeout(() => {
        setShowConfirmationModal(false)
        setIsSubmitting(false)
        router.push("/")
      }, 2000)

    } catch (error) {
      console.error("Error creating contest:", error)
      setError(error instanceof Error ? error.message : "Failed to create contest. Please try again.")
      setIsSubmitting(false)
    }
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return contestForm.title && contestForm.description && contestForm.type
      case 2:
        return (
          contestForm.difficulty &&
          contestForm.duration &&
          contestForm.startDate &&
          contestForm.startTime &&
          contestForm.winnerCriteria
        )
      case 3:
        return true
      case 4:
        return true
      default:
        return false
    }
  }

  const getContestTypeLabel = (type: string) => {
    switch (type) {
      case "dsa":
        return "DSA Challenge"
      case "ui-ux":
        return "UI/UX Design"
      case "mcq":
        return "Logic Quiz"
      case "vibe-coding":
        return "Vibe Coding"
      case "graphic-design":
        return "Graphic Design"
      case "api-design":
        return "API Design"
      default:
        return "Contest"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error/Success Messages */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
            <button
              onClick={() => setSuccess(null)}
              className="ml-2 text-green-500 hover:text-green-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-[var(--z-sticky)]">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline font-medium">Back to Home</span>
                  <span className="sm:hidden font-medium">Back</span>
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-2 rounded-full shadow-md">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-medium text-gray-900">Create Contest</span>
                {/* Demo mode badge removed */}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Exit demo button removed */}
              {userTier === "verified" ? (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium border shadow-md flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Verified Creator
                </div>
              ) : (
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                  Regular User
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Demo Mode Selection Modal */}
      <Dialog open={showDemoModal} onOpenChange={setShowDemoModal}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-blue-500" />
              Choose Demo Experience
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              Experience Codarena's contest creation from different perspectives. Choose your demo mode:
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Demo */}
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300"
                  onClick={() => handleDemoModeSelection("user")}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                      <UserCheck className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-blue-900">See Demo as User</CardTitle>
                    <CardDescription>Experience the platform as a regular user</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <h4 className="font-medium text-blue-900 mb-2">Features Available:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Create invite-only contests</li>
                          <li>• Up to 15 participants max</li>
                          <li>• Copy/Paste tracking enabled</li>
                          <li>• Tab switch detection enabled</li>
                          <li>• Basic question management</li>
                        </ul>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3">
                        <h4 className="font-medium text-red-700 mb-2">Commission Structure:</h4>
                        <ul className="text-sm text-red-600 space-y-1">
                          <li>• 5% commission on paid contests</li>
                          <li>• Commission deducted from prize pool</li>
                          <li>• No monthly subscription required</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-medium text-gray-700 mb-2">Limitations:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• No advanced proctoring</li>
                          <li>• No image monitoring</li>
                          <li>• No multi-monitor detection</li>
                          <li>• Private contests only</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Organization Demo */}
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-yellow-300"
                  onClick={() => handleDemoModeSelection("organization")}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto bg-yellow-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                      <Building className="h-8 w-8 text-yellow-600" />
                    </div>
                    <CardTitle className="text-yellow-900">See Demo as Organization</CardTitle>
                    <CardDescription>Experience full creator capabilities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <h4 className="font-medium text-yellow-900 mb-2">Full Features:</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• Unlimited participants</li>
                          <li>• Advanced proctoring suite</li>
                          <li>• Image & webcam monitoring</li>
                          <li>• Multi-monitor detection</li>
                          <li>• AI plagiarism detection</li>
                          <li>• Secure mode environment</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <h4 className="font-medium text-green-700 mb-2">Subscription Model:</h4>
                        <ul className="text-sm text-green-600 space-y-1">
                          <li>• 999 CC/month subscription</li>
                          <li>• 0% commission on contests</li>
                          <li>• Keep 100% of entry fees</li>
                          <li>• Unlimited contest creation</li>
                        </ul>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <h4 className="font-medium text-purple-700 mb-2">Premium Options:</h4>
                        <ul className="text-sm text-purple-600 space-y-1">
                          <li>• Public & private contests</li>
                          <li>• Cash prizes & UPI payouts</li>
                          <li>• Battle mode & tournaments</li>
                          <li>• Custom branding</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Pricing Comparison
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <h5 className="font-medium text-blue-900 mb-2">Regular User</h5>
                    <ul className="text-blue-700 space-y-1">
                      <li>• No monthly fee</li>
                      <li>• 5% commission per contest</li>
                      <li>• Limited features</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-yellow-200">
                    <h5 className="font-medium text-yellow-900 mb-2">Organization</h5>
                    <ul className="text-yellow-700 space-y-1">
                      <li>• 999 CC/month subscription</li>
                      <li>• 0% commission</li>
                      <li>• All premium features</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Security & Anti-Cheating Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-purple-700">
                    <Copy className="h-4 w-4" />
                    Copy/Paste Tracking
                  </div>
                  <div className="flex items-center gap-2 text-purple-700">
                    <Monitor className="h-4 w-4" />
                    Tab Switch Detection
                  </div>
                  <div className="flex items-center gap-2 text-purple-700">
                    <Camera className="h-4 w-4" />
                    Image Proctoring
                  </div>
                  <div className="flex items-center gap-2 text-purple-700">
                    <Shield className="h-4 w-4" />
                    Secure Mode
                  </div>
                  <div className="flex items-center gap-2 text-purple-700">
                    <Brain className="h-4 w-4" />
                    AI Plagiarism Detection
                  </div>
                  <div className="flex items-center gap-2 text-purple-700">
                    <Lock className="h-4 w-4" />
                    Multi-Monitor Detection
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={() => setShowDemoModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmationModal} onOpenChange={setShowConfirmationModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-6 w-6 text-blue-600" />
              Confirm Contest Submission
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to submit and publish this contest? Once published, it will be live and participants
              can join.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Contest Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">{contestForm.title}</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>Type: {getContestTypeLabel(contestForm.type)}</div>
                <div>Duration: {contestForm.duration}</div>
                <div>
                  Start: {contestForm.startDate} at {contestForm.startTime}
                </div>
                {contestForm.prizeType === "cash" && <div>Entry Fee: {formatCCAmount(Number(contestForm.entryFee))}</div>}
              </div>
            </div>

            {/* Demo mode warning removed - contests are always real */}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmationModal(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSubmission}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating Contest...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Create Contest
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[
                { step: 1, title: "Contest Type", icon: Code2 },
                { step: 2, title: "Details & Pricing", icon: DollarSign },
                { step: 3, title: "Configuration", icon: Settings },
                { step: 4, title: "Review & Submit", icon: Send },
              ].map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      currentStep >= item.step
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p
                      className={`text-sm font-medium ${currentStep >= item.step ? "text-blue-600" : "text-gray-400"}`}
                    >
                      Step {item.step}
                    </p>
                    <p className={`text-xs ${currentStep >= item.step ? "text-gray-900" : "text-gray-400"}`}>
                      {item.title}
                    </p>
                  </div>
                  {index < 3 && (
                    <div
                      className={`hidden sm:block w-16 h-0.5 ml-6 transition-all duration-300 ${
                        currentStep > item.step ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Step 1: Contest Type */}
            {currentStep === 1 && (
              <div className="p-8 min-h-[600px] overflow-y-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-medium text-gray-900 mb-4">Choose Contest Type</h2>
                  <p className="text-gray-600 text-lg">Select the type of challenge you want to host</p>
                  {!demoMode && (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowDemoModal(true)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Try Demo Mode
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <Label htmlFor="contest-type" className="text-base font-medium text-gray-900 mb-4 block">
                    Contest Category
                  </Label>
                  <Select value={contestForm.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select contest type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dsa">DSA Challenge</SelectItem>
                      <SelectItem value="mcq">Logic Quiz</SelectItem>
                      <SelectItem value="ui-ux">UI/UX Design</SelectItem>
                      <SelectItem value="vibe-coding">Vibe Coding</SelectItem>
                      <SelectItem value="graphic-design">Graphic Design</SelectItem>
                      <SelectItem value="api-design">API Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {contestForm.type && (
                  <div className="mb-8">
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {contestForm.type === "dsa" && <Code2 className="h-5 w-5 text-blue-600" />}
                          {contestForm.type === "mcq" && <Brain className="h-5 w-5 text-blue-600" />}
                          {["ui-ux", "vibe-coding", "graphic-design", "api-design"].includes(contestForm.type) && (
                            <Palette className="h-5 w-5 text-blue-600" />
                          )}
                          {getContestTypeLabel(contestForm.type)}
                        </CardTitle>
                        <CardDescription>
                          {contestForm.type === "dsa" &&
                            "Algorithm and data structure problems with automated evaluation and battle modes"}
                          {contestForm.type === "mcq" && "Logic and reasoning questions with rapid-fire scoring"}
                          {contestForm.type === "ui-ux" && "User interface and experience design challenges"}
                          {contestForm.type === "vibe-coding" && "Creative coding challenges with AI tools"}
                          {contestForm.type === "graphic-design" && "Visual design and branding challenges"}
                          {contestForm.type === "api-design" && "Backend API design and documentation"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {contestForm.type === "dsa" && (
                            <>
                              <div className="flex items-center gap-2 text-sm text-blue-700">
                                <Swords className="h-4 w-4" />
                                1v1 Battle Mode
                              </div>
                              <div className="flex items-center gap-2 text-sm text-blue-700">
                                <Brain className="h-4 w-4" />
                                AI plagiarism detection
                              </div>
                              <div className="flex items-center gap-2 text-sm text-blue-700">
                                <Zap className="h-4 w-4" />
                                Lightning fast judging
                              </div>
                            </>
                          )}
                          {contestForm.type === "mcq" && (
                            <>
                              <div className="flex items-center gap-2 text-sm text-blue-700">
                                <Timer className="h-4 w-4" />
                                Rapid-fire questions
                              </div>
                              <div className="flex items-center gap-2 text-sm text-blue-700">
                                <BarChart3 className="h-4 w-4" />
                                Instant leaderboard
                              </div>
                              <div className="flex items-center gap-2 text-sm text-blue-700">
                                <Shuffle className="h-4 w-4" />
                                Question randomization
                              </div>
                            </>
                          )}
                          {["ui-ux", "vibe-coding", "graphic-design", "api-design"].includes(contestForm.type) && (
                            <>
                              <div className="flex items-center gap-2 text-sm text-blue-700">
                                <FileText className="h-4 w-4" />
                                File submissions
                              </div>
                              <div className="flex items-center gap-2 text-sm text-blue-700">
                                <Eye className="h-4 w-4" />
                                Expert judging
                              </div>
                              <div className="flex items-center gap-2 text-sm text-blue-700">
                                <Star className="h-4 w-4" />
                                Creativity focused
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="title" className="text-base font-medium text-gray-900">
                        Contest Title *
                      </Label>
                      {contestForm.type && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={generateContestName}
                          className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Generate Name
                        </Button>
                      )}
                    </div>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter contest title or generate one"
                      value={contestForm.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="mt-2 text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-base font-medium text-gray-900">
                      Contest Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your contest, rules, and what participants should expect"
                      value={contestForm.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="mt-2 min-h-[120px] text-base"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contest Details & Pricing */}
            {currentStep === 2 && (
              <div className="p-8 min-h-[600px] overflow-y-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-medium text-gray-900 mb-4">Contest Details & Pricing</h2>
                  <p className="text-gray-600 text-lg">Configure timing, difficulty, and prize structure</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <Label htmlFor="difficulty" className="text-base font-medium text-gray-900">
                      Difficulty Level *
                    </Label>
                    <Select
                      value={contestForm.difficulty}
                      onValueChange={(value) => handleInputChange("difficulty", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="duration" className="text-base font-medium text-gray-900">
                      Contest Duration *
                    </Label>
                    <Select
                      value={contestForm.duration}
                      onValueChange={(value) => handleInputChange("duration", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {contestForm.type === "mcq" && (
                          <>
                            <SelectItem value="15min">15 minutes</SelectItem>
                            <SelectItem value="30min">30 minutes</SelectItem>
                            <SelectItem value="45min">45 minutes</SelectItem>
                          </>
                        )}
                        {contestForm.type === "dsa" && (
                          <>
                            <SelectItem value="1hour">1 hour</SelectItem>
                            <SelectItem value="2hours">2 hours</SelectItem>
                            <SelectItem value="3hours">3 hours</SelectItem>
                            <SelectItem value="4hours">4 hours</SelectItem>
                          </>
                        )}
                        {contestForm.type === "ui-ux" && (
                          <>
                            <SelectItem value="24hours">24 hours</SelectItem>
                            <SelectItem value="48hours">48 hours</SelectItem>
                            <SelectItem value="72hours">72 hours</SelectItem>
                            <SelectItem value="1week">1 week</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="startDate" className="text-base font-medium text-gray-900">
                      Start Date *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={contestForm.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="startTime" className="text-base font-medium text-gray-900">
                      Start Time *
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={contestForm.startTime}
                      onChange={(e) => handleInputChange("startTime", e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="winnerCriteria" className="text-base font-medium text-gray-900">
                      Winner Selection Criteria *
                    </Label>
                    <Select
                      value={contestForm.winnerCriteria}
                      onValueChange={(value) => handleInputChange("winnerCriteria", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select winner criteria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="timing">Timing Competition (Fastest Correct)</SelectItem>
                        <SelectItem value="correctness">Correctness with More Points</SelectItem>
                        <SelectItem value="creativity">Creativity & Innovation</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive Evaluation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Battle Mode Configuration */}
                {contestForm.type === "dsa" && userTier === "verified" && (
                  <div className="mb-8">
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Swords className="h-5 w-5 text-red-600" />
                          Battle Mode Configuration
                        </CardTitle>
                        <CardDescription>Enable 1v1 battles and tournament modes for DSA contests</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="battleMode"
                            checked={contestForm.battleMode.enabled}
                            onCheckedChange={(checked) =>
                              handleInputChange("battleMode", {
                                ...contestForm.battleMode,
                                enabled: checked,
                                type: checked ? "1v1" : "none",
                              })
                            }
                          />
                          <Label htmlFor="battleMode" className="flex items-center gap-2">
                            <Flame className="h-4 w-4" />
                            Enable Battle Mode
                          </Label>
                        </div>

                        {contestForm.battleMode.enabled && (
                          <div className="ml-6 space-y-3 border-l-2 border-red-200 pl-4">
                            <div>
                              <Label className="text-sm font-medium">Battle Type</Label>
                              <RadioGroup
                                value={contestForm.battleMode.type}
                                onValueChange={(value) =>
                                  handleInputChange("battleMode", {
                                    ...contestForm.battleMode,
                                    type: value as "1v1" | "tournament",
                                  })
                                }
                                className="mt-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="1v1" id="1v1" />
                                  <Label htmlFor="1v1" className="flex items-center gap-2">
                                    <Swords className="h-4 w-4" />
                                    1v1 Battles
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="tournament" id="tournament" />
                                  <Label htmlFor="tournament" className="flex items-center gap-2">
                                    <Crown className="h-4 w-4" />
                                    Tournament Mode
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Prize Structure Section */}
                <div className="mb-8">
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-green-600" />
                        Prize Structure & Entry Fee
                      </CardTitle>
                      <CardDescription>Configure entry fees and prize distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Prize Type Selection */}
                      <div>
                        <Label className="text-base font-medium text-gray-900 mb-3 block">Contest Type</Label>
                        <RadioGroup
                          value={contestForm.prizeType}
                          onValueChange={(value) => handleInputChange("prizeType", value)}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="free" id="free" />
                            <Label htmlFor="free" className="flex items-center gap-2">
                              <Gift className="h-4 w-4" />
                              Free Contest (Recognition Only)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cash" id="cash" />
                            <Label htmlFor="cash" className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Paid Contest (Cash Prizes)
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {contestForm.prizeType === "cash" && (
                        <>
                          {/* Entry Fee and Participants */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="entryFee" className="text-base font-medium text-gray-900">
                                Entry Fee per Participant (₹) *
                              </Label>
                              <Input
                                id="entryFee"
                                type="number"
                                placeholder="50"
                                value={contestForm.entryFee}
                                onChange={(e) => handleInputChange("entryFee", e.target.value)}
                                className="mt-2"
                                min="1"
                              />
                            </div>

                            <div>
                              <Label htmlFor="maxParticipants" className="text-base font-medium text-gray-900">
                                Maximum Participants *
                              </Label>
                              <Input
                                id="maxParticipants"
                                type="number"
                                placeholder={userTier === "regular" ? "15 (max for regular users)" : "100"}
                                value={contestForm.maxParticipants}
                                onChange={(e) => handleInputChange("maxParticipants", e.target.value)}
                                className="mt-2"
                                min="2"
                                max={userTier === "regular" ? 15 : undefined}
                                disabled={userTier === "regular"}
                              />
                              {userTier === "regular" && (
                                <p className="text-sm text-gray-500 mt-1">
                                  Regular users are limited to 15 participants
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Prize Pool Calculator */}
                          {contestForm.entryFee && contestForm.maxParticipants && (
                            <div className="bg-white rounded-lg p-4 border border-green-200">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-green-900 flex items-center gap-2">
                                  <Calculator className="h-4 w-4" />
                                  Prize Pool Calculation
                                </h4>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowPrizeCalculator(!showPrizeCalculator)}
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                >
                                  {showPrizeCalculator ? "Hide" : "Show"} Details
                                </Button>
                              </div>

                              {(() => {
                                const { totalCollected, platformFee, prizePool } = calculatePrizePool()
                                return (
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>Total Entry Fees Collected:</span>
                                      <span className="font-medium flex items-center gap-1">
                                        <Coins className="h-3 w-3" />
                                        {formatCCAmount(totalCollected)}
                                      </span>
                                    </div>
                                    {showPrizeCalculator && (
                                      <>
                                        <div className="flex justify-between text-sm text-red-600">
                                          <span>Platform Fee ({userTier === "regular" ? "5%" : "0%"}):</span>
                                          <span className="flex items-center gap-1">
                                            <Coins className="h-3 w-3" />
                                            -{formatCCAmount(platformFee)}
                                          </span>
                                        </div>
                                        {userTier === "regular" && demoMode && (
                                          <p className="text-xs text-red-500">
                                            Regular users pay 5% commission on prize pools
                                          </p>
                                        )}
                                        {userTier === "verified" && (
                                          <p className="text-xs text-green-600">
                                            Verified creators keep 100% of entry fees (999 CC/month subscription)
                                          </p>
                                        )}
                                      </>
                                    )}
                                    <div className="flex justify-between text-base font-medium text-green-700 border-t pt-2">
                                      <span>Final Prize Pool:</span>
                                      <span className="flex items-center gap-1">
                                        <Coins className="h-3 w-3" />
                                        {formatCCAmount(prizePool)}
                                      </span>
                                    </div>
                                  </div>
                                )
                              })()}
                            </div>
                          )}

                          {/* Prize Distribution */}
                          <div>
                            <Label className="text-base font-medium text-gray-900 mb-3 block">
                              Prize Distribution Structure
                            </Label>
                            <Select
                              value={contestForm.prizeStructure}
                              onValueChange={(value) => {
                                handleInputChange("prizeStructure", value)
                                handleInputChange("customDistribution", value === "custom")
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select prize structure" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="winner-takes-all">Winner Takes All</SelectItem>
                                <SelectItem value="top-3">Top 3 Winners</SelectItem>
                                <SelectItem value="top-5">Top 5 Winners</SelectItem>
                                <SelectItem value="top-10">Top 10 Winners</SelectItem>
                                <SelectItem value="custom">Custom Distribution</SelectItem>
                              </SelectContent>
                            </Select>

                            {/* Prize Distribution Preview */}
                            {contestForm.prizeDistribution.length > 0 && (
                              <div className="mt-4 bg-white rounded-lg p-4 border border-green-200">
                                <h5 className="font-medium text-green-900 mb-3">Prize Distribution Preview</h5>
                                <div className="space-y-2">
                                  {contestForm.prizeDistribution.map((prize, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                      <span className="flex items-center gap-2">
                                        {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                                        {prize.position}
                                        {prize.count > 1 && (
                                          <Badge variant="secondary" className="text-xs">
                                            {prize.count} winners
                                          </Badge>
                                        )}
                                      </span>
                                      <span className="font-medium">
                                        <span className="flex items-center gap-1">
                                          <Coins className="h-3 w-3" />
                                          {formatCCAmount(prize.amount)} ({prize.percentage}%)
                                        </span>
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Visibility Settings */}
                <div>
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        Contest Visibility
                      </CardTitle>
                      <CardDescription>Choose who can see and join your contest</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={contestForm.visibility}
                        onValueChange={(value) => handleInputChange("visibility", value)}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="public" id="public" disabled={userTier === "regular"} />
                          <Label htmlFor="public" className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Public Contest (Anyone can join)
                            {userTier === "regular" && (
                              <Badge variant="secondary" className="text-xs">
                                Verified Only
                              </Badge>
                            )}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="private" id="private" />
                          <Label htmlFor="private" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Private Contest (Invite-only)
                          </Label>
                        </div>
                      </RadioGroup>
                      {userTier === "regular" && (
                        <p className="text-sm text-gray-500 mt-2">
                          Regular users can only create private contests. Upgrade to verified for public contests.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 3: Configuration */}
            {currentStep === 3 && (
              <div className="p-8 min-h-[600px] overflow-y-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-medium text-gray-900 mb-4">Contest Configuration</h2>
                  <p className="text-gray-600 text-lg">Set up questions, security, and advanced settings</p>
                </div>

                {/* Security & Anti-Cheating */}
                {contestForm.type === "dsa" && (
                  <div className="mb-8">
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-red-600" />
                          Security & Anti-Cheating
                        </CardTitle>
                        <CardDescription>Configure proctoring and security measures</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="copyPasteTracking"
                              checked={contestForm.copyPasteTracking}
                              onCheckedChange={(checked) => handleInputChange("copyPasteTracking", checked)}
                              disabled={userTier === "regular"}
                            />
                            <Label htmlFor="copyPasteTracking" className="flex items-center gap-2">
                              <Copy className="h-4 w-4" />
                              Copy/Paste Tracking
                              {userTier === "regular" && (
                                <Badge variant="secondary" className="text-xs">
                                  Always On
                                </Badge>
                              )}
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="tabSwitchDetection"
                              checked={contestForm.tabSwitchDetection}
                              onCheckedChange={(checked) => handleInputChange("tabSwitchDetection", checked)}
                              disabled={userTier === "regular"}
                            />
                            <Label htmlFor="tabSwitchDetection" className="flex items-center gap-2">
                              <Monitor className="h-4 w-4" />
                              Tab Switch Detection
                              {userTier === "regular" && (
                                <Badge variant="secondary" className="text-xs">
                                  Always On
                                </Badge>
                              )}
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="imageProctoring"
                              checked={contestForm.imageProctoring}
                              onCheckedChange={(checked) => handleInputChange("imageProctoring", checked)}
                              disabled={userTier === "regular"}
                            />
                            <Label htmlFor="imageProctoring" className="flex items-center gap-2">
                              <Camera className="h-4 w-4" />
                              Image Proctoring
                              {userTier === "regular" && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified Only
                                </Badge>
                              )}
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="multiMonitorDetection"
                              checked={contestForm.multiMonitorDetection}
                              onCheckedChange={(checked) => handleInputChange("multiMonitorDetection", checked)}
                              disabled={userTier === "regular"}
                            />
                            <Label htmlFor="multiMonitorDetection" className="flex items-center gap-2">
                              <Monitor className="h-4 w-4" />
                              Multi-Monitor Detection
                              {userTier === "regular" && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified Only
                                </Badge>
                              )}
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="secureMode"
                              checked={contestForm.secureMode}
                              onCheckedChange={(checked) => handleInputChange("secureMode", checked)}
                              disabled={userTier === "regular"}
                            />
                            <Label htmlFor="secureMode" className="flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              Secure Mode Environment
                              {userTier === "regular" && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified Only
                                </Badge>
                              )}
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="plagiarismDetection"
                              checked={contestForm.plagiarismDetection}
                              onCheckedChange={(checked) => handleInputChange("plagiarismDetection", checked)}
                              disabled={userTier === "regular"}
                            />
                            <Label htmlFor="plagiarismDetection" className="flex items-center gap-2">
                              <Brain className="h-4 w-4" />
                              AI Plagiarism Detection
                              {userTier === "regular" && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified Only
                                </Badge>
                              )}
                            </Label>
                          </div>
                        </div>

                        {userTier === "regular" && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                            <p className="text-sm text-yellow-800">
                              <AlertTriangle className="h-4 w-4 inline mr-2" />
                              Regular users have basic security features enabled by default. Upgrade to verified for
                              advanced proctoring options.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Programming Languages (DSA) */}
                {contestForm.type === "dsa" && (
                  <div className="mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Code2 className="h-5 w-5" />
                          Allowed Programming Languages
                        </CardTitle>
                        <CardDescription>Select which programming languages participants can use</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {codingLanguages.map((lang) => (
                            <div key={lang.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={lang.id}
                                checked={contestForm.codingLanguages.includes(lang.id)}
                                onCheckedChange={(checked) => handleLanguageChange(lang.id, checked as boolean)}
                              />
                              <Label htmlFor={lang.id} className="flex items-center gap-2 cursor-pointer">
                                <span>{lang.icon}</span>
                                {lang.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {contestForm.codingLanguages.length === 0 && (
                          <p className="text-sm text-gray-500 mt-2">Please select at least one programming language</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* MCQ Configuration */}
                {contestForm.type === "mcq" && (
                  <div className="mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5" />
                          MCQ Configuration
                        </CardTitle>
                        <CardDescription>Configure quiz settings and question behavior</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="timePerQuestion">Time per Question (seconds)</Label>
                            <Input
                              id="timePerQuestion"
                              type="number"
                              value={contestForm.timePerQuestion}
                              onChange={(e) => handleInputChange("timePerQuestion", e.target.value)}
                              className="mt-2"
                              min="30"
                              max="300"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="randomizeQuestions"
                              checked={contestForm.randomizeQuestions}
                              onCheckedChange={(checked) => handleInputChange("randomizeQuestions", checked)}
                            />
                            <Label htmlFor="randomizeQuestions" className="flex items-center gap-2">
                              <Shuffle className="h-4 w-4" />
                              Randomize Question Order
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="showResults"
                              checked={contestForm.showResults}
                              onCheckedChange={(checked) => handleInputChange("showResults", checked)}
                            />
                            <Label htmlFor="showResults" className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4" />
                              Show Results After Contest
                            </Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Design Contest Configuration */}
                {["ui-ux", "vibe-coding", "graphic-design", "api-design"].includes(contestForm.type) && (
                  <div className="mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Palette className="h-5 w-5" />
                          Submission Requirements
                        </CardTitle>
                        <CardDescription>Configure what participants can submit</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-base font-medium mb-3 block">Allowed Submission Types</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                              { id: "figma", name: "Figma Files", icon: Figma },
                              { id: "images", name: "Images/Screenshots", icon: Camera },
                              { id: "github", name: "GitHub Repository", icon: Github },
                              { id: "links", name: "Live Demo Links", icon: LinkIcon },
                              { id: "files", name: "File Uploads", icon: FileText },
                              { id: "videos", name: "Video Demos", icon: PlayCircle },
                            ].map((type) => (
                              <div key={type.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={type.id}
                                  checked={contestForm.allowedSubmissions.includes(type.id)}
                                  onCheckedChange={(checked) => handleSubmissionTypeChange(type.id, checked as boolean)}
                                />
                                <Label htmlFor={type.id} className="flex items-center gap-2 cursor-pointer">
                                  <type.icon className="h-4 w-4" />
                                  {type.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="evaluationCriteria" className="text-base font-medium">
                            Evaluation Criteria
                          </Label>
                          <Textarea
                            id="evaluationCriteria"
                            placeholder="Describe how submissions will be evaluated..."
                            value={contestForm.evaluationCriteria}
                            onChange={(e) => handleInputChange("evaluationCriteria", e.target.value)}
                            className="mt-2 min-h-[120px]"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Questions/Problems Section */}
                <div className="mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {contestForm.type === "dsa" && <Code2 className="h-5 w-5" />}
                          {contestForm.type === "mcq" && <Brain className="h-5 w-5" />}
                          {["ui-ux", "vibe-coding", "graphic-design", "api-design"].includes(contestForm.type) && (
                            <Palette className="h-5 w-5" />
                          )}
                          {contestForm.type === "dsa" && "DSA Problems"}
                          {contestForm.type === "mcq" && "Quiz Questions"}
                          {["ui-ux", "vibe-coding", "graphic-design", "api-design"].includes(contestForm.type) &&
                            "Design Problems"}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={loadSampleData}
                            className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
                          >
                            <Lightbulb className="h-4 w-4 mr-2" />
                            Load Sample Data
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (contestForm.type === "mcq") setShowMCQForm(true)
                              else if (contestForm.type === "dsa") setShowDSAForm(true)
                              else setShowDesignForm(true)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add{" "}
                            {contestForm.type === "dsa"
                              ? "Problem"
                              : contestForm.type === "mcq"
                                ? "Question"
                                : "Problem"}
                          </Button>
                        </div>
                      </CardTitle>
                      <CardDescription>
                        {contestForm.type === "dsa" && "Add coding problems for participants to solve"}
                        {contestForm.type === "mcq" && "Add multiple choice questions for the quiz"}
                        {["ui-ux", "vibe-coding", "graphic-design", "api-design"].includes(contestForm.type) &&
                          "Add design challenges for participants"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* MCQ Questions List */}
                      {contestForm.type === "mcq" && (
                        <div className="space-y-4">
                          {contestForm.mcqQuestions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>No questions added yet. Click "Add Question" or "Load Sample Data" to get started.</p>
                            </div>
                          ) : (
                            contestForm.mcqQuestions.map((question, index) => (
                              <Card key={question.id} className="border-gray-200">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline">Q{index + 1}</Badge>
                                        <Badge
                                          variant={
                                            question.difficulty === "easy"
                                              ? "default"
                                              : question.difficulty === "medium"
                                                ? "secondary"
                                                : "destructive"
                                          }
                                        >
                                          {question.difficulty}
                                        </Badge>
                                      </div>
                                      <h4 className="font-medium mb-2">{question.question}</h4>
                                      <div className="space-y-1">
                                        {question.options.map((option, optIndex) => (
                                          <div
                                            key={optIndex}
                                            className={`text-sm p-2 rounded ${
                                              optIndex === question.correctAnswer
                                                ? "bg-green-50 text-green-700 border border-green-200"
                                                : "bg-gray-50"
                                            }`}
                                          >
                                            {String.fromCharCode(65 + optIndex)}. {option}
                                            {optIndex === question.correctAnswer && (
                                              <CheckCircle className="h-4 w-4 inline ml-2" />
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                      {question.explanation && (
                                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                                          <strong>Explanation:</strong> {question.explanation}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setEditingMCQ(question)
                                          setShowMCQForm(true)
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => deleteMCQQuestion(question.id)}
                                        className="text-red-600 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          )}
                        </div>
                      )}

                      {/* DSA Problems List */}
                      {contestForm.type === "dsa" && (
                        <div className="space-y-4">
                          {contestForm.dsaQuestions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>No problems added yet. Click "Add Problem" or "Load Sample Data" to get started.</p>
                            </div>
                          ) : (
                            contestForm.dsaQuestions.map((problem, index) => (
                              <Card key={problem.id} className="border-gray-200">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline">P{index + 1}</Badge>
                                        <Badge
                                          variant={
                                            problem.difficulty === "easy"
                                              ? "default"
                                              : problem.difficulty === "medium"
                                                ? "secondary"
                                                : "destructive"
                                          }
                                        >
                                          {problem.difficulty}
                                        </Badge>
                                        <div className="flex gap-1">
                                          {problem.tags.map((tag) => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                      <h4 className="font-medium mb-2">{problem.title}</h4>
                                      <p className="text-sm text-gray-600 mb-3">{problem.description}</p>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <strong>Time Limit:</strong> {problem.timeLimit}ms
                                        </div>
                                        <div>
                                          <strong>Memory Limit:</strong> {problem.memoryLimit}MB
                                        </div>
                                      </div>
                                      <div className="mt-3 space-y-2">
                                        <div className="bg-gray-50 p-2 rounded">
                                          <strong className="text-xs">Sample Input:</strong>
                                          <pre className="text-xs mt-1">{problem.sampleInput}</pre>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded">
                                          <strong className="text-xs">Sample Output:</strong>
                                          <pre className="text-xs mt-1">{problem.sampleOutput}</pre>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setEditingDSA(problem)
                                          setShowDSAForm(true)
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => deleteDSAQuestion(problem.id)}
                                        className="text-red-600 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          )}
                        </div>
                      )}

                      {/* Design Problems List */}
                      {["ui-ux", "vibe-coding", "graphic-design", "api-design"].includes(contestForm.type) && (
                        <div className="space-y-4">
                          {contestForm.designProblems.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>No problems added yet. Click "Add Problem" or "Load Sample Data" to get started.</p>
                            </div>
                          ) : (
                            contestForm.designProblems.map((problem, index) => (
                              <Card key={problem.id} className="border-gray-200">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline">P{index + 1}</Badge>
                                        <Badge
                                          variant={
                                            problem.difficulty === "easy"
                                              ? "default"
                                              : problem.difficulty === "medium"
                                                ? "secondary"
                                                : "destructive"
                                          }
                                        >
                                          {problem.difficulty}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          {problem.category}
                                        </Badge>
                                      </div>
                                      <h4 className="font-medium mb-2">{problem.title}</h4>
                                      <p className="text-sm text-gray-600 mb-3">{problem.description}</p>
                                      <div className="space-y-2">
                                        <div>
                                          <strong className="text-sm">Requirements:</strong>
                                          <ul className="text-sm text-gray-600 mt-1 ml-4">
                                            {problem.requirements.map((req, reqIndex) => (
                                              <li key={reqIndex} className="list-disc">
                                                {req}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                        {problem.deliverables && problem.deliverables.length > 0 && (
                                          <div>
                                            <strong className="text-sm">Deliverables:</strong>
                                            <ul className="text-sm text-gray-600 mt-1 ml-4">
                                              {problem.deliverables.map((deliverable, delIndex) => (
                                                <li key={delIndex} className="list-disc">
                                                  {deliverable}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setEditingDesign(problem)
                                          setShowDesignForm(true)
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => deleteDesignProblem(problem.id)}
                                        className="text-red-600 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="p-8 min-h-[600px] overflow-y-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-medium text-gray-900 mb-4">Review & Submit</h2>
                  <p className="text-gray-600 text-lg">Review your contest details before publishing</p>
                </div>

                <div className="space-y-6">
                  {/* Contest Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Contest Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Title</Label>
                          <p className="text-base">{contestForm.title}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Type</Label>
                          <p className="text-base">{getContestTypeLabel(contestForm.type)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Difficulty</Label>
                          <p className="text-base capitalize">{contestForm.difficulty}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Duration</Label>
                          <p className="text-base">{contestForm.duration}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Start Date & Time</Label>
                          <p className="text-base">
                            {contestForm.startDate} at {contestForm.startTime}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Visibility</Label>
                          <p className="text-base capitalize">{contestForm.visibility}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Description</Label>
                        <p className="text-base text-gray-700">{contestForm.description}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Prize Information */}
                  {contestForm.prizeType === "cash" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5" />
                          Prize Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Entry Fee</Label>
                            <p className="text-base flex items-center gap-1">
                              <Coins className="h-4 w-4" />
                              {formatCCAmount(Number(contestForm.entryFee))}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Max Participants</Label>
                            <p className="text-base">{contestForm.maxParticipants}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Prize Pool</Label>
                            <p className="text-base flex items-center gap-1">
                              <Coins className="h-4 w-4" />
                              {formatCCAmount(Number(contestForm.prizePool))}
                            </p>
                          </div>
                        </div>
                        {contestForm.prizeDistribution.length > 0 && (
                          <div>
                            <Label className="text-sm font-medium text-gray-600 mb-2 block">Prize Distribution</Label>
                            <div className="space-y-2">
                              {contestForm.prizeDistribution.map((prize, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
                                >
                                  <span>{prize.position}</span>
                                  <span className="font-medium flex items-center gap-1">
                                    <Coins className="h-3 w-3" />
                                    {formatCCAmount(prize.amount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Questions/Problems Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {contestForm.type === "dsa" && <Code2 className="h-5 w-5" />}
                        {contestForm.type === "mcq" && <Brain className="h-5 w-5" />}
                        {["ui-ux", "vibe-coding", "graphic-design", "api-design"].includes(contestForm.type) && (
                          <Palette className="h-5 w-5" />
                        )}
                        {contestForm.type === "dsa" && "Problems"}
                        {contestForm.type === "mcq" && "Questions"}
                        {["ui-ux", "vibe-coding", "graphic-design", "api-design"].includes(contestForm.type) &&
                          "Problems"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {contestForm.type === "mcq" && (
                        <div>
                          <p className="text-base mb-2">Total Questions: {contestForm.mcqQuestions.length}</p>
                          {contestForm.mcqQuestions.length > 0 && (
                            <div className="space-y-1">
                              {contestForm.mcqQuestions.map((q, index) => (
                                <div key={q.id} className="text-sm text-gray-600">
                                  {index + 1}. {q.question}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {contestForm.type === "dsa" && (
                        <div>
                          <p className="text-base mb-2">Total Problems: {contestForm.dsaQuestions.length}</p>
                          {contestForm.dsaQuestions.length > 0 && (
                            <div className="space-y-1">
                              {contestForm.dsaQuestions.map((p, index) => (
                                <div key={p.id} className="text-sm text-gray-600">
                                  {index + 1}. {p.title} ({p.difficulty})
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {["ui-ux", "vibe-coding", "graphic-design", "api-design"].includes(contestForm.type) && (
                        <div>
                          <p className="text-base mb-2">Total Problems: {contestForm.designProblems.length}</p>
                          {contestForm.designProblems.length > 0 && (
                            <div className="space-y-1">
                              {contestForm.designProblems.map((p, index) => (
                                <div key={p.id} className="text-sm text-gray-600">
                                  {index + 1}. {p.title} ({p.difficulty})
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Security Settings (for DSA) */}
                  {contestForm.type === "dsa" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Security Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            { key: "copyPasteTracking", label: "Copy/Paste Tracking" },
                            { key: "tabSwitchDetection", label: "Tab Switch Detection" },
                            { key: "imageProctoring", label: "Image Proctoring" },
                            { key: "multiMonitorDetection", label: "Multi-Monitor Detection" },
                            { key: "secureMode", label: "Secure Mode" },
                            { key: "plagiarismDetection", label: "Plagiarism Detection" },
                          ].map((setting) => (
                            <div key={setting.key} className="flex items-center gap-2 text-sm">
                              {contestForm[setting.key as keyof ContestForm] ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <X className="h-4 w-4 text-gray-400" />
                              )}
                              <span
                                className={
                                  contestForm[setting.key as keyof ContestForm] ? "text-green-700" : "text-gray-500"
                                }
                              >
                                {setting.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Demo mode removed - contests are always real */}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="border-t bg-gray-50 px-8 py-6">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex gap-3">
                  {currentStep < 4 ? (
                    <Button onClick={nextStep} disabled={!isStepValid(currentStep)} className="flex items-center gap-2">
                      Next
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitContest}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Send className="h-4 w-4" />
                      Submit Contest
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MCQ Question Form Modal */}
      <Dialog open={showMCQForm} onOpenChange={setShowMCQForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add MCQ Question</DialogTitle>
            <DialogDescription>
              Create a new multiple choice question for your quiz contest.
            </DialogDescription>
          </DialogHeader>
          <MCQQuestionForm
            question={editingMCQ}
            onSave={(question) => {
              if (editingMCQ) {
                updateMCQQuestion(editingMCQ.id, question)
                setEditingMCQ(null)
              } else {
                addMCQQuestion(question)
              }
              setShowMCQForm(false)
            }}
            onCancel={() => {
              setEditingMCQ(null)
              setShowMCQForm(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* DSA Problem Form Modal */}
      <Dialog open={showDSAForm} onOpenChange={setShowDSAForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add DSA Problem</DialogTitle>
            <DialogDescription>
              Create a new coding problem for your DSA contest.
            </DialogDescription>
          </DialogHeader>
          <DSAProblemForm
            problem={editingDSA}
            onSave={(problem) => {
              if (editingDSA) {
                updateDSAQuestion(editingDSA.id, problem)
                setEditingDSA(null)
              } else {
                addDSAQuestion(problem)
              }
              setShowDSAForm(false)
            }}
            onCancel={() => {
              setEditingDSA(null)
              setShowDSAForm(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Design Problem Form Modal */}
      <Dialog open={showDesignForm} onOpenChange={setShowDesignForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Design Problem</DialogTitle>
            <DialogDescription>
              Create a new design challenge for your contest.
            </DialogDescription>
          </DialogHeader>
          <DesignProblemForm
            problem={editingDesign}
            onSave={(problem) => {
              if (editingDesign) {
                updateDesignProblem(editingDesign.id, problem)
                setEditingDesign(null)
              } else {
                addDesignProblem(problem)
              }
              setShowDesignForm(false)
            }}
            onCancel={() => {
              setEditingDesign(null)
              setShowDesignForm(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
