import React, { useState } from 'react'
import { User, Mail, Lock, BookOpen, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface AuthProps {
  onAuth: (user: any) => void
}

export default function Auth({ onAuth }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShowEmailConfirmation(false)

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        if (data.user) {
          if (data.user.email_confirmed_at) {
            onAuth(data.user)
          } else {
            setShowEmailConfirmation(true)
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        if (data.user) {
          onAuth(data.user)
        }
      }
    } catch (error: any) {
      if (error.message.includes('Email not confirmed')) {
        setShowEmailConfirmation(true)
        setError('Please check your email and click the confirmation link before signing in.')
      } else {
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address first.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })
      if (error) throw error
      setError('Confirmation email sent! Please check your inbox.')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Check Your Email</h1>
            <p className="text-gray-600">We've sent a confirmation link to your email address</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-4 rounded-xl mb-6">
            <p className="text-sm mb-2">
              <strong>Email sent to:</strong> {email}
            </p>
            <p className="text-sm">
              Please check your inbox (and spam folder) for a confirmation email. Click the link in the email to verify your account, then return here to sign in.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleResendConfirmation}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? 'Sending...' : 'Resend Confirmation Email'}
            </button>

            <button
              onClick={() => {
                setShowEmailConfirmation(false)
                setError('')
              }}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">VocabLog</h1>
          <p className="text-gray-600">Your personal vocabulary companion</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-teal-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}