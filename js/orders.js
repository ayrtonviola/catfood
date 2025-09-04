export const loadOrders = async () => {
  const container = document.getElementById("order-list");
  container.innerHTML = `<p class="text-gray-600">Carregando pedidos...</p>`;

  try {
    const res = await fetch("/orders/anon"); // ou ID real
    const orders = await res.json();

    container.innerHTML = "";

    if (!orders || orders.length === 0) {
      container.innerHTML = `<p class="text-gray-600">Você ainda não fez nenhum pedido.</p>`;
      return;
    }

    orders.forEach((order) => {
      const orderCard = document.createElement("div");
      orderCard.className = "bg-white p-4 rounded-xl shadow-md mb-4";

      const itemsHtml = order.items
        .map(
          (item) => `
            <div class="flex justify-between">
              <span>${item.name} x ${item.quantity}</span>
              <span>R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
            </div>`
        )
        .join("");

      orderCard.innerHTML = `
        <h4 class="font-semibold mb-2">Pedido - ${order.status}</h4>
        <div class="space-y-1 mb-2">${itemsHtml}</div>
        <div class="flex justify-between font-bold border-t pt-2">
          <span>Total:</span>
          <span>R$ ${order.total.toFixed(2).replace(".", ",")}</span>
        </div>
      `;

      container.appendChild(orderCard);
    });
  } catch (error) {
    console.error("Erro ao carregar pedidos:", error);
    container.innerHTML = `<p class="text-gray-600">Erro ao carregar pedidos.</p>`;
  }
};