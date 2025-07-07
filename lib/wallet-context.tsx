"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface Transaction {
  id: string
  type: "debit" | "credit"
  amount: number
  description: string
  contestName?: string
  date: Date
  status: "successful" | "pending" | "failed"
  transactionId: string
  paymentMethod?: string
}

interface WalletContextType {
  balance: number
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id" | "date" | "transactionId">) => void
  updateBalance: (amount: number) => void
  getTransactionHistory: () => Transaction[]
  deductAmount: (amount: number, description: string, contestName?: string) => Transaction
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(1500) // Initial balance
  const [transactions, setTransactions] = useState<Transaction[]>([
    // Sample initial transactions
    {
      id: "1",
      type: "credit",
      amount: 1000,
      description: "Initial wallet credit",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: "successful",
      transactionId: "TXN001",
      paymentMethod: "UPI",
    },
    {
      id: "2",
      type: "credit",
      amount: 500,
      description: "Referral bonus",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: "successful",
      transactionId: "TXN002",
      paymentMethod: "Bonus",
    },
    {
      id: "3",
      type: "debit",
      amount: 75,
      description: "Contest entry fee",
      contestName: "Weekly Coding Challenge",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "successful",
      transactionId: "TXN003",
      paymentMethod: "Wallet",
    },
  ])

  const addTransaction = (transactionData: Omit<Transaction, "id" | "date" | "transactionId">) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      date: new Date(),
      transactionId: `TXN${Date.now().toString().slice(-6)}`,
    }

    setTransactions((prev) => [newTransaction, ...prev])

    // Update balance
    if (transactionData.type === "debit") {
      setBalance((prev) => prev - transactionData.amount)
    } else {
      setBalance((prev) => prev + transactionData.amount)
    }
  }

  const updateBalance = (amount: number) => {
    setBalance((prev) => prev + amount)
  }

  const getTransactionHistory = () => {
    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  const deductAmount = (amount: number, description: string, contestName?: string) => {
    if (balance < amount) {
      throw new Error("Insufficient balance")
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: "debit",
      amount,
      description,
      contestName,
      date: new Date(),
      status: "successful",
      transactionId: `TXN${Date.now().toString().slice(-6)}`,
      paymentMethod: "Wallet",
    }

    setTransactions((prev) => [transaction, ...prev])
    setBalance((prev) => prev - amount)

    return transaction
  }

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        addTransaction,
        updateBalance,
        getTransactionHistory,
        deductAmount,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
