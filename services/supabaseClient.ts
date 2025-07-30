import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types.ts';

// Corrected values from your Supabase dashboard
const urlPart1 = 'wpgrfukcnpcoyruymxdd';
const urlPart2 = 'supabase.co';
const supabaseUrl = `https://${urlPart1}.${urlPart2}`;

const keyPart1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
const keyPart2 = 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZ3JmdWtjbnBjb3lydXlteGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzQ5MjgsImV4cCI6MjA2OTMxMDkyOH0';
const keyPart3 = '.-b5KHzKWk2N3VEY_K5CzYZfszRRL6GY-MivOVUAL1Z4';
const supabaseKey = `${keyPart1}.${keyPart2}${keyPart3}`;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
