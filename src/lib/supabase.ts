import { createClient } from '@supabase/supabase-js'

// Hardcoded for now - we'll fix env vars later
const supabaseUrl = 'https://gqcuegopzlaixssyxgbb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxY3VlZ29wemxhaXhzc3l4Z2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODk3ODYsImV4cCI6MjA3ODk2NTc4Nn0.BTOrNlCK59NPpvLQU7oh7yMVbIevH8QLrZwDVAu7xUM'

export const supabase = createClient(supabaseUrl, supabaseKey)