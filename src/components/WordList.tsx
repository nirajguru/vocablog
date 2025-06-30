import React from 'react'
import { Calendar, Trash2, BookOpen } from 'lucide-react'
import { Word } from '../types'

interface WordListProps {
  words: Word[]
  onDeleteWord: (id: string) => void
  onStartFlashcards: () => void
}

export default function WordList({ words, onDeleteWord, onStartFlashcards }: WordListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Vocabulary ({words.length})</h2>
        {words.length > 0 && (
          <button
            onClick={onStartFlashcards}
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
          >
            <BookOpen size={18} />
            <span>Practice Flashcards</span>
          </button>
        )}
      </div>

      {words.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 text-lg">No words in your vocabulary yet.</p>
          <p className="text-gray-400">Start looking up words to build your collection!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {words.map((word) => (
            <div key={word.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800 capitalize">{word.word}</h3>
                <button
                  onClick={() => onDeleteWord(word.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <p className="text-gray-700 text-sm mb-3 leading-relaxed">{word.meaning}</p>

              {word.example && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-xs font-medium text-gray-600 mb-1">Example:</p>
                  <p className="text-gray-700 text-sm italic">"{word.example}"</p>
                </div>
              )}

              <div className="space-y-2 mb-3">
                {word.synonyms.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Synonyms:</p>
                    <div className="flex flex-wrap gap-1">
                      {word.synonyms.map((synonym) => (
                        <span key={synonym} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                          {synonym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {word.antonyms.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Antonyms:</p>
                    <div className="flex flex-wrap gap-1">
                      {word.antonyms.map((antonym) => (
                        <span key={antonym} className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                          {antonym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                <Calendar size={12} className="mr-1" />
                Added {formatDate(word.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}