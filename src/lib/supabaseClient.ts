import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vopyhhhxwyivqmtvppbe.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvcHloaGh4d3lpdnFtdHZwcGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMDA3MzUsImV4cCI6MjA4MjU3NjczNX0.KiSQ6lOoIA6JBn9zBsoKhQePa2UEoYf4gFEFzHQBamY';

export const supabase = createClient(supabaseUrl, supabaseKey);