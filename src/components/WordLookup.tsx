import React, { useState } from 'react'
import { Search, Plus, Loader } from 'lucide-react'
import { lookupWord, createKidFriendlyExample, getTopSynonymsAntonyms } from '../services/dictionaryService'
import { supabase } from '../lib/supabase'
import { Word } from '../types'

interface WordLookupProps {
  user: any
  onWordAdded: (word: Word) => void
}

export default function WordLookup({ user, onWordAdded }: WordLookupProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const definition = await lookupWord(searchTerm.trim())
      if (!definition) {
        setError('Word not found. Please try another word.')
        return
      }

      setResult(definition)
    } catch (error) {
      setError('Failed to look up word. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveWord = async () => {
    if (!result || !user) return

    try {
      const firstMeaning = result.meanings[0]
      const firstDefinition = firstMeaning.definitions[0]
      const { synonyms, antonyms } = getTopSynonymsAntonyms(result.meanings)

      const wordData = {
        word: result.word,
        meaning: firstDefinition.definition,
        synonyms,
        antonyms,
        example: createKidFriendlyExample(result.word, firstDefinition.example),
        user_id: user.id
      }

      const { data, error } = await supabase
        .from('words')
        .insert([wordData])
        .select()
        .single()

      if (error) throw error

      onWordAdded(data)
      setResult(null)
      setSearchTerm('')
    } catch (error) {
      console.error('Error saving word:', error)
      setError('Failed to save word. Please try again.')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Look up a new word</h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-4 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Enter a word to look up..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
          />
          <button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            className="absolute right-2 top-2 bg-gradient-to-r from-purple-600 to-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-teal-600 transition-all disabled:opacity-50"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-gradient-to-br from-purple-50 to-teal-50 rounded-xl p-6 border border-purple-100">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gray-800 capitalize">{result.word}</h3>
            <button
              onClick={handleSaveWord}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-teal-600 transition-all transform hover:scale-105"
            >
              <Plus size={18} />
              <span>Save Word</span>
            </button>
          </div>

          <div className="space-y-4">
            {result.meanings.map((meaning: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <p className="text-sm font-semibold text-purple-600 mb-2 uppercase">
                  {meaning.partOfSpeech}
                </p>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  {meaning.definitions[0].definition}
                </p>
                
                {meaning.definitions[0].example && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-gray-600 mb-1">Example:</p>
                    <p className="text-gray-700 italic">"{meaning.definitions[0].example}"</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {meaning.definitions[0].synonyms?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Synonyms:</p>
                      <div className="flex flex-wrap gap-1">
                        {meaning.definitions[0].synonyms.slice(0, 3).map((synonym: string) => (
                          <span key={synonym} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                            {synonym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {meaning.definitions[0].antonyms?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Antonyms:</p>
                      <div className="flex flex-wrap gap-1">
                        {meaning.definitions[0].antonyms.slice(0, 3).map((antonym: string) => (
                          <span key={antonym} className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                            {antonym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}