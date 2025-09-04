// js/supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://kzwdjggmuqeyyduobawk.supabase.co'; // Já peguei pra você da sua URL de callback :)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6d2RqZ2dtdXFleXlkdW9iYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5MDgyNDIsImV4cCI6MjA3MTQ4NDI0Mn0.99G2M6QnyV1BChNre7ylGICH1o7AjWP1uePv4y3YoPA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
