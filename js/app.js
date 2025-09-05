// js/app.js

// Importações dos Módulos
import { supabase } from './supabaseClient.js';
import { signInWithGoogle, signOut } from './auth.js';
import { loadRestaurants } from "./restaurants.js";
import { loadOrders } from "./orders.js";

// Função para mostrar/esconder páginas
window.showPage = (pageId) => {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.add("hidden");
  });
  const targetPage = document.getElementById(`${pageId}-page`);
  if (targetPage) {
    targetPage.classList.remove("hidden");
    targetPage.classList.remove("flex-col");
  }

  // Header
  const backButton = document.getElementById("back-button");
  const headerTitle = document.getElementById("header-title");
  if (pageId === "home") {
    backButton.classList.add("hidden");
    headerTitle.textContent = "CatFood";
  } else {
    backButton.classList.remove("hidden");
    if (pageId === 'auth') headerTitle.textContent = "Login";
    if (pageId === 'menu') headerTitle.textContent = "Cardápio";
    if (pageId === 'cart') headerTitle.textContent = "Carrinho";
    if (pageId === 'orders') headerTitle.textContent = "Meus Pedidos";
    if (pageId === 'profile') headerTitle.textContent = "Meu Perfil";
  }
};

// Ponto de entrada do App
document.addEventListener('DOMContentLoaded', () => {
  // Clique login Google
  const googleLoginButton = document.getElementById('google-login-btn');
  if (googleLoginButton) {
    googleLoginButton.addEventListener('click', () => {
      signInWithGoogle();
    });
  }

  // Estado de autenticação
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session && session.user) {
      console.log('Usuário logado:', session.user);
      showPage('home');
      loadRestaurants();

      // Mostra email no perfil
      const userEmailElement = document.getElementById('user-email');
      if (userEmailElement) {
        userEmailElement.textContent = session.user.email;
      }

      // Botão logout
      const logoutButton = document.getElementById('logout-btn');
      if (logoutButton) {
        logoutButton.onclick = async () => {
          await signOut();
        };
      }

    } else {
      console.log('Nenhum usuário logado.');
      showPage('auth');
    }
  });
});
