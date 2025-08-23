import { db, auth, appId } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

export let cart = [];

// Adiciona produto ao carrinho
export const addToCart = (product) => {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
};

// Remove produto do carrinho
export const removeFromCart = (productId) => {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
};

// Renderiza o carrinho
export const renderCart = () => {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const countEl = document.getElementById("cart-count");

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-500 mt-8">Seu carrinho está vazio.</p>`;
    countEl.classList.add("hidden");
    totalEl.textContent = "R$ 0,00";
    return;
  }

  cart.forEach((item) => {
    const card = document.createElement("div");
    card.className = "flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm";
    card.innerHTML = `
      <div>
        <h4 class="font-semibold">${item.name}</h4>
        <p class="text-sm text-gray-500">R$ ${item.price.toFixed(2).replace(".", ",")} x ${item.quantity}</p>
      </div>
      <button class="text-red-500 font-bold text-xl">×</button>
    `;
    card.querySelector("button").addEventListener("click", () => removeFromCart(item.id));
    container.appendChild(card);
  });

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  totalEl.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;

  countEl.textContent = cart.length;
  countEl.classList.remove("hidden");
};

// Função de finalizar pedido
export const checkout = async () => {
  if (cart.length === 0) {
    window.showMessage("Seu carrinho está vazio!");
    return;
  }

  try {
    const order = {
      userId: auth.currentUser ? auth.currentUser.uid : null,
      items: cart,
      total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      status: "pendente",
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, `artifacts/${appId}/public/data/orders`), order);

    cart = [];
    renderCart();
    window.showPage("orders");
    window.showMessage("Pedido realizado com sucesso!");
  } catch (e) {
    console.error("Erro ao salvar pedido:", e);
    window.showMessage("Erro ao finalizar pedido. Tente novamente.");
  }
};

// Conecta o botão "Finalizar Pedido"
document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkout);
  }
});
