export let cart = [];

export const addToCart = (product) => {
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  window.showMessage(`${product.name} adicionado ao carrinho!`);
  renderCart();
};

export const updateItemQuantity = (productId, change) => {
  const item = cart.find((i) => i.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter((i) => i.id !== productId);
    }
  }
  renderCart();
};

export const renderCart = () => {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-500 mt-8">Seu carrinho está vazio.</p>`;
    document.getElementById("cart-total-container").classList.add("hidden");
    document.getElementById("cart-count").classList.add("hidden");
    return;
  }

  document.getElementById("cart-total-container").classList.remove("hidden");
  document.getElementById("cart-count").classList.remove("hidden");

  cart.forEach((item) => {
    total += item.price * item.quantity;
    const card = document.createElement("div");
    card.className =
      "w-full p-4 bg-white rounded-xl shadow-md border border-gray-200 flex items-center space-x-4";
    card.innerHTML = `
      <div class="flex-grow">
        <h4 class="font-semibold">${item.name}</h4>
        <p class="text-sm text-gray-500">R$ ${item.price.toFixed(2).replace(".", ",")} x ${item.quantity}</p>
      </div>
      <div class="flex items-center space-x-2">
        <button class="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center">-</button>
        <span class="font-semibold">${item.quantity}</span>
        <button class="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center">+</button>
      </div>
    `;

    card.querySelectorAll("button")[0].addEventListener("click", () => updateItemQuantity(item.id, -1));
    card.querySelectorAll("button")[1].addEventListener("click", () => updateItemQuantity(item.id, 1));

    container.appendChild(card);
  });

  document.getElementById("cart-total").textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  document.getElementById("cart-count").textContent = cart.length;
};

