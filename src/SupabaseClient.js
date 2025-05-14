import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eshkpbjjmnojqnmojbhw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzaGtwYmpqbW5vanFubW9qYmh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDg5NTksImV4cCI6MjA2MjcyNDk1OX0.Q6QdzTRrV6CRiy06wTMFLuK3PXUn05QKlKOIVcfKUwM';

export const supabase = createClient(supabaseUrl, supabaseKey);
