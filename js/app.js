
import { initFirebase } from "./firebase.js";
import { loadRestaurants } from "./restaurants.js";

let pageHistory = ["home"];

window.showPage = (pageId, previousPageId = null) => {
  const allPages = document.querySelectorAll(".page");
  allPages.forEach((page) => page.classList.add("hidden"));

  const targetPage = document.getElementById(`${pageId}-page`);
  if (targetPage) targetPage.classList.remove("hidden");

  const locationHeader = document.getElementById("location-icon-container");
  const backButton = document.getElementById("back-button");
  const headerTitle = document.getElementById("header-title");

  if (pageId === "home") {
    locationHeader.classList.remove("hidden");
    backButton.classList.add("hidden");
    headerTitle.textContent = "CatFood";
  } else if (pageId === "menu") {
    locationHeader.classList.add("hidden");
    backButton.classList.remove("hidden");
    headerTitle.textContent = "";
  } else if (pageId === "cart") {
    locationHeader.classList.add("hidden");
    backButton.classList.remove("hidden");
    headerTitle.textContent = "Meu Carrinho";
  } else {
    locationHeader.classList.add("hidden");
    backButton.classList.remove("hidden");
    headerTitle.textContent = pageId === "profile" ? "Meu Perfil" : "Meus Pedidos";
  }

  if (backButton) backButton.onclick = () => goBack(previousPageId);

  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    const itemPageId = item.getAttribute("onclick").match(/showPage\('(.+)'\)/)[1];
    if (itemPageId === pageId) {
      item.classList.remove("text-gray-400");
      item.classList.add("text-purple-600");
    } else {
      item.classList.remove("text-purple-600");
      item.classList.add("text-gray-400");
    }
  });

  const cartButton = document.getElementById("cart-button");
  if (["home", "menu"].includes(pageId)) {
    cartButton.classList.add("scale-100");
    cartButton.classList.remove("scale-0");
  } else {
    cartButton.classList.add("scale-0");
    cartButton.classList.remove("scale-100");
  }
};

window.goBack = () => {
  if (pageHistory.length > 1) {
    pageHistory.pop();
    showPage(pageHistory[pageHistory.length - 1]);
  }
};

window.showMessage = (text) => {
  const modal = document.getElementById("message-modal");
  const modalText = document.getElementById("modal-text");
  modalText.textContent = text;
  modal.classList.remove("hidden");
};

// Inicia Firebase e carrega restaurantes
document.addEventListener("DOMContentLoaded", () => {
  initFirebase(() => {
    loadRestaurants();
  });
});
