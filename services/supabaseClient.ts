import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types.ts';

// Corrected values from your Supabase dashboard
const urlPart1 = 'rzoypvhfkzphdtqrrvtz';
const urlPart2 = 'supabase.co';
const supabaseUrl = `https://${urlPart1}.${urlPart2}`;

const keyPart1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
const keyPart2 = 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6b3lwdmhma3pwaGR0cXJydnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3Mjk0MzMsImV4cCI6MjA2OTMwNTQzM30';
const keyPart3 = '.0PPNYXCk3dHdGWhf0eE4a-W91Z7XsfWLbXcrAevmmK4'; // Corrected signature
const supabaseKey = `${keyPart1}.${keyPart2}${keyPart3}`;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
