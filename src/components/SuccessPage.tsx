import React, { useEffect, useState } from 'react'
import { CheckCircle, ArrowLeft, Crown } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SuccessPage() {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = '/'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-white" size={40} />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Crown className="text-yellow-600" size={24} />
            <span className="text-yellow-800 font-bold text-lg">Welcome to Premium!</span>
          </div>
          <p className="text-yellow-700 text-sm">
            You now have access to all premium features including unlimited word storage, 
            advanced flashcards, and progress tracking.
          </p>
        </div>

        <p className="text-gray-600 mb-6">
          Thank you for upgrading to VocabLog Premium. Your payment has been processed successfully.
        </p>

        <div className="space-y-4">
          <a
            href="/"
            className="w-full bg-gradient-to-r from-purple-600 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-teal-600 transition-all transform hover:scale-105 inline-block"
          >
            Start Using Premium Features
          </a>

          <p className="text-sm text-gray-500">
            Redirecting automatically in {countdown} seconds...
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team at support@vocablog.com
          </p>
        </div>
      </div>
    </div>
  )
}