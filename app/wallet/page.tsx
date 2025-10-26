"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Coins,
} from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/lib/wallet-context"

export default function WalletPage() {
  const { balance, transactions, addTransaction } = useWallet()
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [showBalance, setShowBalance] = useState(true)
  const [addAmount, setAddAmount] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const handleAddMoney = async () => {
    if (!addAmount || !selectedPaymentMethod) return

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    addTransaction({
      type: "credit",
      amount: Number.parseFloat(addAmount),
      description: `Money added via ${selectedPaymentMethod}`,
      status: "successful",
      paymentMethod: selectedPaymentMethod,
    })

    setIsProcessing(false)
    setShowAddMoney(false)
    setAddAmount("")
    setSelectedPaymentMethod("")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "successful":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "successful":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const typeMatch = filterType === "all" || transaction.type === filterType
    const statusMatch = filterStatus === "all" || transaction.status === filterStatus
    return typeMatch && statusMatch
  })

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatCCAmount = (amount: number): string => {
    return `${amount.toLocaleString("en-IN")} CC`
  }

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: Smartphone },
    { id: "card", name: "Credit/Debit Card", icon: CreditCard },
    { id: "netbanking", name: "Net Banking", icon: Building2 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
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
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-full shadow-md">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-medium text-gray-900">My Wallet</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Wallet Balance Card */}
          <Card className="mb-8 bg-gradient-to-r from-green-600 to-emerald-700 text-white border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white mb-2">Wallet Balance</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl font-bold flex items-center gap-2">
                      <Coins className="h-8 w-8" />
                      {showBalance ? formatCCAmount(balance) : "**** CC"}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-white hover:bg-white/20 p-1"
                    >
                      {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <Button
                    onClick={() => setShowAddMoney(true)}
                    className="bg-white text-green-600 hover:bg-gray-100 font-medium"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Money
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-white" />
                    <div>
                      <p className="text-white/80 text-sm">This Month</p>
                      <p className="text-xl font-bold flex items-center gap-1">
                        <Coins className="h-4 w-4" />
                        {formatCCAmount(Math.floor(Math.random() * 500) + 200)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <ArrowDownLeft className="h-8 w-8 text-white" />
                    <div>
                      <p className="text-white/80 text-sm">Total Spent</p>
                      <p className="text-xl font-bold flex items-center gap-1">
                        <Coins className="h-4 w-4" />
                        {formatCCAmount(Math.floor(Math.random() * 1000) + 500)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <ArrowUpRight className="h-8 w-8 text-white" />
                    <div>
                      <p className="text-white/80 text-sm">Total Added</p>
                      <p className="text-xl font-bold flex items-center gap-1">
                        <Coins className="h-4 w-4" />
                        {formatCCAmount(Math.floor(Math.random() * 2000) + 1000)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Transaction History
                  </CardTitle>
                  <CardDescription>View all your wallet transactions</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Transaction Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="credit">Credits</SelectItem>
                    <SelectItem value="debit">Debits</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="successful">Successful</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transactions List */}
              <div className="space-y-4">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No transactions found</h3>
                    <p className="text-sm">Your transaction history will appear here</p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {transaction.type === "credit" ? (
                            <ArrowUpRight className="h-5 w-5" />
                          ) : (
                            <ArrowDownLeft className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                          {transaction.contestName && (
                            <p className="text-sm text-gray-600">Contest: {transaction.contestName}</p>
                          )}
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                            <p className="text-xs text-gray-500">ID: {transaction.transactionId}</p>
                            {transaction.paymentMethod && (
                              <p className="text-xs text-gray-500">via {transaction.paymentMethod}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-3">
                          <div>
                            <p
                              className={`text-lg font-bold flex items-center gap-1 ${
                                transaction.type === "credit" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              <Coins className="h-4 w-4" />
                              {transaction.type === "credit" ? "+" : "-"}{formatCCAmount(transaction.amount)}
                            </p>
                            <Badge variant="secondary" className={getStatusColor(transaction.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(transaction.status)}
                                <span className="capitalize">{transaction.status}</span>
                              </div>
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Money Dialog */}
      <Dialog open={showAddMoney} onOpenChange={setShowAddMoney}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-6 w-6 text-green-600" />
              Add Money to Wallet
            </DialogTitle>
            <DialogDescription>Choose amount and payment method to add money</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label htmlFor="amount" className="text-base font-medium">
                Amount to Add *
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="mt-2 text-lg"
                min="1"
                max="50000"
              />
              <p className="text-sm text-gray-500 mt-1">Minimum: 1 CC, Maximum: 50,000 CC</p>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Payment Method *</Label>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPaymentMethod === method.id
                        ? "border-green-500 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={selectedPaymentMethod === method.id}
                          onChange={() => setSelectedPaymentMethod(method.id)}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <div
                          className={`p-2 rounded-lg ${
                            selectedPaymentMethod === method.id ? "bg-green-100" : "bg-gray-100"
                          }`}
                        >
                          <method.icon
                            className={`h-5 w-5 ${
                              selectedPaymentMethod === method.id ? "text-green-600" : "text-gray-600"
                            }`}
                          />
                        </div>
                      </div>
                      <span
                        className={`font-medium ${
                          selectedPaymentMethod === method.id ? "text-green-900" : "text-gray-900"
                        }`}
                      >
                        {method.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {addAmount && selectedPaymentMethod && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium mb-3 text-gray-900">Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Amount</span>
                    <span className="font-medium flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {formatCCAmount(Number(addAmount))}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Processing Fee</span>
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      0 CC
                    </span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold text-gray-900">
                    <span>Total</span>
                    <span className="text-green-600 flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {formatCCAmount(Number(addAmount))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAddMoney(false)}
                className="flex-1"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddMoney}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!addAmount || !selectedPaymentMethod || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add {formatCCAmount(Number(addAmount) || 0)}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
