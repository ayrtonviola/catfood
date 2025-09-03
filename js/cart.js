export let cart = [];

export const addToCart = (product) => {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
};

export const removeFromCart = (productId) => {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
};

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

export const checkout = async () => {
  if (cart.length === 0) {
    window.showMessage("Seu carrinho está vazio!");
    return;
  }

  try {
    const order = {
      userId: "anon", // ou substitua por ID real se tiver login
      items: cart,
      total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      status: "pendente",
    };

    const res = await fetch("http://192.168.3.61:3000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (!res.ok) throw new Error("Erro ao salvar pedido");

    cart = [];
    renderCart();
    window.showPage("orders");
    window.showMessage("Pedido realizado com sucesso!");
  } catch (e) {
    console.error("Erro ao finalizar pedido:", e);
    window.showMessage("Erro ao finalizar pedido. Tente novamente.");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkout);
  }
});