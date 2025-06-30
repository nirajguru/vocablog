export interface Word {
  id: string
  word: string
  meaning: string
  synonyms: string[]
  antonyms: string[]
  example: string
  user_id: string
  created_at: string
}

export interface User {
  id: string
  email: string
}

export interface WordDefinition {
  word: string
  meanings: Array<{
    partOfSpeech: string
    definitions: Array<{
      definition: string
      example?: string
      synonyms: string[]
      antonyms: string[]
    }>
  }>
}