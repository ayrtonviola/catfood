// js/app.js

// Importações dos Módulos
import { supabase } from './supabaseClient.js';
import { signInWithGoogle } from './auth.js';
import { loadRestaurants } from "./restaurants.js";
import { loadOrders } from "./orders.js";

// Função para mostrar/esconder páginas (você já tinha, mas com melhorias)
window.showPage = (pageId) => {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.add("hidden");
  });
  const targetPage = document.getElementById(`${pageId}-page`);
  if (targetPage) {
    targetPage.classList.remove("hidden");
    targetPage.classList.remove("flex-col"); // Garante que não afete outras páginas
  }

  // Lógica para mostrar/esconder o botão de voltar e título (você já tinha)
  const backButton = document.getElementById("back-button");
  const headerTitle = document.getElementById("header-title");
  if (pageId === "home") {
    backButton.classList.add("hidden");
    headerTitle.textContent = "CatFood";
  } else {
    backButton.classList.remove("hidden");
    // Ajusta o título para outras páginas
    if (pageId === 'auth') headerTitle.textContent = "Login";
    if (pageId === 'menu') headerTitle.textContent = "Cardápio";
    if (pageId === 'cart') headerTitle.textContent = "Carrinho";
    if (pageId === 'orders') headerTitle.textContent = "Meus Pedidos";
    if (pageId === 'profile') headerTitle.textContent = "Meu Perfil";
  }
};

// Ponto de entrada do App quando o HTML carrega
document.addEventListener('DOMContentLoaded', () => {
  // Adiciona o evento de clique no botão de login
  const googleLoginButton = document.getElementById('google-login-btn');
  if (googleLoginButton) {
    googleLoginButton.addEventListener('click', () => {
      signInWithGoogle();
    });
  }

  // Ouve mudanças no estado de autenticação (login, logout)
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session && session.user) {
      // --- USUÁRIO ESTÁ LOGADO ---
      console.log('Usuário logado:', session.user);
      showPage('home'); // Mostra a página principal
      loadRestaurants(); // <<-- FINALMENTE, CHAMAMOS AQUI!
    } else {
      // --- USUÁRIO NÃO ESTÁ LOGADO ---
      console.log('Nenhum usuário logado.');
      showPage('auth'); // Mostra a página de login
    }
  });
});