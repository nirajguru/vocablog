import { WordDefinition } from '../types'

const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en'

export async function lookupWord(word: string): Promise<WordDefinition | null> {
  try {
    const response = await fetch(`${DICTIONARY_API_URL}/${word.toLowerCase()}`)
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    if (!data || data.length === 0) {
      return null
    }

    const entry = data[0]
    return {
      word: entry.word,
      meanings: entry.meanings.map((meaning: any) => ({
        partOfSpeech: meaning.partOfSpeech,
        definitions: meaning.definitions.map((def: any) => ({
          definition: def.definition,
          example: def.example,
          synonyms: def.synonyms || [],
          antonyms: def.antonyms || []
        }))
      }))
    }
  } catch (error) {
    console.error('Error looking up word:', error)
    return null
  }
}

export function createKidFriendlyExample(word: string, originalExample?: string): string {
  // If we have an original example and it's simple enough, use it
  if (originalExample && originalExample.length < 100 && !originalExample.includes('complex')) {
    return originalExample
  }

  // Generate simple examples for common word types
  const examples = [
    `I learned a new word today: "${word}".`,
    `The teacher used "${word}" in our lesson.`,
    `My friend taught me what "${word}" means.`,
    `I found "${word}" in my favorite book.`,
    `Can you use "${word}" in a sentence?`
  ]

  return examples[Math.floor(Math.random() * examples.length)]
}

export function getTopSynonymsAntonyms(meanings: any[]): { synonyms: string[], antonyms: string[] } {
  const allSynonyms = new Set<string>()
  const allAntonyms = new Set<string>()

  meanings.forEach(meaning => {
    meaning.definitions.forEach((def: any) => {
      def.synonyms?.forEach((syn: string) => allSynonyms.add(syn))
      def.antonyms?.forEach((ant: string) => allAntonyms.add(ant))
    })
  })

  return {
    synonyms: Array.from(allSynonyms).slice(0, 3),
    antonyms: Array.from(allAntonyms).slice(0, 3)
  }
}