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
  
  // Lógica de esconder/mostrar o botão "Voltar" (aparece APENAS no 'menu')
  if (pageId === "home") {
    backButton.classList.add("hidden");
    headerTitle.textContent = "CatFood";
  } else {
    // Só mostra o botão de voltar na página de menu
    if (pageId === "menu") {
      backButton.classList.remove("hidden");
    } else {
      backButton.classList.add("hidden");
    }

    // Lógica para atualizar o título do cabeçalho
    if (pageId === 'auth') headerTitle.textContent = "Login";
    if (pageId === 'menu') headerTitle.textContent = "Cardápio";
    if (pageId === 'cart') headerTitle.textContent = "Carrinho";
    if (pageId === 'orders') headerTitle.textContent = "Meus Pedidos";
    if (pageId === 'profile') headerTitle.textContent = "Meu Perfil";
  }
};

// Ponto de entrada do App
document.addEventListener('DOMContentLoaded', () => {
  // Evento de clique do Google Login
  const googleLoginButton = document.getElementById('google-login-btn');
  if (googleLoginButton) {
    googleLoginButton.addEventListener('click', () => {
      signInWithGoogle();
    });
  }

  // Evento de clique para o botão 'Voltar'
  const backButton = document.getElementById("back-button");
  if (backButton) {
      backButton.addEventListener("click", () => {
          window.showPage("home");
          // Esconde o botão ao voltar para a home, garantindo que ele não fique visível.
          backButton.classList.add("hidden"); 
      });
  }

  // Estado de autenticação do Supabase
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session && session.user) {
      console.log('Usuário logado:', session.user);
      window.showPage('home');
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
      window.showPage('auth');
    }
  });
});