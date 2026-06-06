import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

console.log('Supabase URL loaded:', supabaseUrl ? 'YES' : 'NO');
console.log('Supabase Key loaded:', supabaseKey ? 'YES' : 'NO');

export const supabase = createClient(supabaseUrl, supabaseKey);
