import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Word } from './types'
import Auth from './components/Auth'
import Header from './components/Header'
import WordLookup from './components/WordLookup'
import WordList from './components/WordList'
import Flashcards from './components/Flashcards'
import PricingSection from './components/PricingSection'
import UserSubscriptionStatus from './components/UserSubscriptionStatus'
import SuccessPage from './components/SuccessPage'
import { getUserSubscription } from './services/stripeService'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [words, setWords] = useState<Word[]>([])
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [userSubscription, setUserSubscription] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState<'main' | 'success'>('main')

  useEffect(() => {
    // Check URL for success page
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      setCurrentPage('success')
      return
    }

    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      fetchWords()
      fetchUserSubscription()
    }
  }, [user])

  const fetchWords = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setWords(data || [])
    } catch (error) {
      console.error('Error fetching words:', error)
    }
  }

  const fetchUserSubscription = async () => {
    try {
      const subscription = await getUserSubscription()
      setUserSubscription(subscription)
    } catch (error) {
      console.error('Error fetching user subscription:', error)
    }
  }

  const handleWordAdded = (newWord: Word) => {
    setWords([newWord, ...words])
  }

  const handleDeleteWord = async (wordId: string) => {
    try {
      const { error } = await supabase
        .from('words')
        .delete()
        .eq('id', wordId)

      if (error) throw error
      setWords(words.filter(word => word.id !== wordId))
    } catch (error) {
      console.error('Error deleting word:', error)
    }
  }

  const handleSignOut = () => {
    setUser(null)
    setWords([])
    setUserSubscription(null)
  }

  if (currentPage === 'success') {
    return <SuccessPage />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading VocabLog...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Auth onAuth={setUser} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserSubscriptionStatus user={user} />
        <WordLookup user={user} onWordAdded={handleWordAdded} />
        <PricingSection user={user} userSubscription={userSubscription} />
        <WordList 
          words={words} 
          onDeleteWord={handleDeleteWord}
          onStartFlashcards={() => setShowFlashcards(true)}
        />
      </main>

      {showFlashcards && words.length > 0 && (
        <Flashcards 
          words={words}
          onClose={() => setShowFlashcards(false)}
        />
      )}
    </div>
  )
}

export default App