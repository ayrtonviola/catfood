import { db, auth, appId } from "./firebase.js";
import { collection, query, where, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

export const loadOrders = () => {
  const container = document.getElementById("order-list");
  container.innerHTML = `<p class="text-gray-600">Carregando pedidos...</p>`;

  if (!auth.currentUser) {
    container.innerHTML = `<p class="text-gray-600">Você precisa estar logado para ver seus pedidos.</p>`;
    return;
  }

  const ordersRef = collection(db, `artifacts/${appId}/public/data/orders`);
  const q = query(
    ordersRef,
    where("userId", "==", auth.currentUser.uid),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    container.innerHTML = "";
    if (snapshot.empty) {
      container.innerHTML = `<p class="text-gray-600">Você ainda não fez nenhum pedido.</p>`;
      return;
    }

    snapshot.forEach((doc) => {
      const order = doc.data();
      const orderCard = document.createElement("div");
      orderCard.className = "bg-white p-4 rounded-xl shadow-md mb-4";

      const itemsHtml = order.items
        .map(
          (item) =>
            `<div class="flex justify-between">
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
  }, (error) => {
    console.error("Erro ao carregar pedidos:", error);
    container.innerHTML = `<p class="text-gray-600">Erro ao carregar pedidos.</p>`;
  });
};
