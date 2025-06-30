import React, { useState, useEffect } from 'react'
import { RotateCcw, Check, X, ArrowLeft, ArrowRight } from 'lucide-react'
import { Word } from '../types'

interface FlashcardsProps {
  words: Word[]
  onClose: () => void
}

export default function Flashcards({ words, onClose }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [shuffledWords, setShuffledWords] = useState<Word[]>([])
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)

  useEffect(() => {
    // Shuffle words for random order
    const shuffled = [...words].sort(() => Math.random() - 0.5)
    setShuffledWords(shuffled)
  }, [words])

  const currentWord = shuffledWords[currentIndex]

  const handleNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowAnswer(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowAnswer(false)
    }
  }

  const handleCorrect = () => {
    setCorrect(correct + 1)
    if (currentIndex < shuffledWords.length - 1) {
      handleNext()
    }
  }

  const handleIncorrect = () => {
    setIncorrect(incorrect + 1)
    if (currentIndex < shuffledWords.length - 1) {
      handleNext()
    }
  }

  const resetCards = () => {
    setCurrentIndex(0)
    setShowAnswer(false)
    setCorrect(0)
    setIncorrect(0)
    const shuffled = [...words].sort(() => Math.random() - 0.5)
    setShuffledWords(shuffled)
  }

  if (shuffledWords.length === 0) {
    return null
  }

  const isLastCard = currentIndex === shuffledWords.length - 1

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-teal-500 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Flashcard Practice</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-white/90">
              Card {currentIndex + 1} of {shuffledWords.length}
            </p>
            <div className="flex space-x-4 text-sm">
              <span className="bg-green-500/30 px-3 py-1 rounded-full">
                Correct: {correct}
              </span>
              <span className="bg-red-500/30 px-3 py-1 rounded-full">
                Incorrect: {incorrect}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div 
              className="bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl p-8 min-h-[300px] flex flex-col justify-center cursor-pointer border-2 border-purple-100 hover:border-purple-200 transition-all"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {!showAnswer ? (
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4 capitalize">
                    {currentWord.word}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Click to reveal the meaning
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {currentWord.meaning}
                  </p>
                  
                  {currentWord.example && (
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Example:</p>
                      <p className="text-gray-700 italic">"{currentWord.example}"</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    {currentWord.synonyms.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Synonyms:</p>
                        <div className="flex flex-wrap gap-1">
                          {currentWord.synonyms.map((synonym) => (
                            <span key={synonym} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              {synonym}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentWord.antonyms.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Antonyms:</p>
                        <div className="flex flex-wrap gap-1">
                          {currentWord.antonyms.map((antonym) => (
                            <span key={antonym} className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                              {antonym}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {showAnswer && (
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={handleIncorrect}
                className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                <X size={20} />
                <span>Incorrect</span>
              </button>
              <button
                onClick={handleCorrect}
                className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                <Check size={20} />
                <span>Correct</span>
              </button>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Previous</span>
            </button>

            <button
              onClick={resetCards}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors"
            >
              <RotateCcw size={20} />
              <span>Shuffle & Restart</span>
            </button>

            <button
              onClick={handleNext}
              disabled={isLastCard}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ArrowRight size={20} />
            </button>
          </div>

          {isLastCard && showAnswer && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-teal-50 rounded-lg text-center">
              <p className="text-gray-700 font-medium">
                🎉 Great job! You've completed all flashcards.
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Final Score: {correct} correct, {incorrect} incorrect
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}