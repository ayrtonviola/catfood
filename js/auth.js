// js/auth.js
import { supabase } from './supabaseClient.js';

// Função que inicia o processo de login com o Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    console.error('Erro ao fazer login com Google:', error);
  }
}

// Função para fazer logout (vamos usar no futuro)
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Erro ao fazer logout:', error);
  }
}