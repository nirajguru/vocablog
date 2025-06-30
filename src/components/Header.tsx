import React from 'react'
import { BookOpen, LogOut, User } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface HeaderProps {
  user: any
  onSignOut: () => void
}

export default function Header({ user, onSignOut }: HeaderProps) {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    onSignOut()
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-teal-500 w-10 h-10 rounded-xl flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">VocabLog</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <User size={18} />
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}