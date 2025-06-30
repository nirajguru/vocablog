/*
  # Create words table for vocabulary learning app

  1. New Tables
    - `words`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with time zone)
      - `word` (text) - The vocabulary word
      - `meaning` (text) - Definition of the word
      - `synonyms` (text array) - List of synonyms
      - `antonyms` (text array) - List of antonyms
      - `example` (text) - Example sentence using the word
      - `user_id` (uuid) - Reference to the user who saved this word

  2. Security
    - Enable RLS on `words` table
    - Add policies for authenticated users to manage their own words
    - Users can only access words they have created
*/

CREATE TABLE IF NOT EXISTS words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  word text NOT NULL,
  meaning text NOT NULL,
  synonyms text[] DEFAULT '{}',
  antonyms text[] DEFAULT '{}',
  example text DEFAULT '',
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own words
CREATE POLICY "Users can view own words"
  ON words
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own words
CREATE POLICY "Users can insert own words"
  ON words
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own words
CREATE POLICY "Users can update own words"
  ON words
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own words
CREATE POLICY "Users can delete own words"
  ON words
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS words_user_id_idx ON words(user_id);
CREATE INDEX IF NOT EXISTS words_created_at_idx ON words(created_at DESC);