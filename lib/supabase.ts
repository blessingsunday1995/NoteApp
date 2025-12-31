import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('AsyncStorage imported successfully:', !!AsyncStorage);

const supabaseUrl = 'https://ehwqkucagzumgqgoliln.supabase.co';
const supabaseAnonKey = 'sb_publishable_WV30rU8wAMMxUhkVtGFtVw_S29V2QIO';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});