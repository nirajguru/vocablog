import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are properly configured (not just present, but valid)
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  isValidUrl(supabaseUrl) &&
  !supabaseUrl.includes('your_supabase_project_url_here') &&
  !supabaseAnonKey.includes('your_supabase_anon_key_here')

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables are not configured. Please set up your Supabase connection.')
}

// Create a mock client if environment variables are missing or invalid
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: () => Promise.resolve({ data: { user: null }, error: { message: 'Please configure Supabase connection' } }),
    signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: 'Please configure Supabase connection' } }),
    signOut: () => Promise.resolve({ error: null })
  },
  from: () => ({
    select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }),
    insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Please configure Supabase connection' } }) }) }),
    delete: () => ({ eq: () => Promise.resolve({ error: { message: 'Please configure Supabase connection' } }) })
  })
})

export const supabase = !isSupabaseConfigured 
  ? createMockClient() 
  : createClient(supabaseUrl, supabaseAnonKey)