import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // જો કી ના મળે તો ડેવલપમેન્ટમાં વોર્નિંગ આપશે, પણ એપ ક્રેશ થવા દેશે નહીં
  console.warn('Supabase Keys Missing! Database caching will not work.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);