import { db, auth, appId } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

export let cart = [];

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
