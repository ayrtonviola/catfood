import { db, appId } from "./firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { fetchAndRenderMenu } from "./menu.js";

export const loadRestaurants = () => {
  if (!db) return;
  const restaurantsRef = collection(db, `artifacts/${appId}/public/data/restaurants`);

  onSnapshot(restaurantsRef, (snapshot) => {
    const restaurants = [];
    snapshot.forEach((doc) => restaurants.push({ id: doc.id, ...doc.data() }));
    renderRestaurants(restaurants);
  });
};

const renderRestaurants = (restaurants) => {
  const container = document.getElementById("local-restaurants");
  container.innerHTML = "";

  if (restaurants.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-500 mt-8">Nenhum restaurante encontrado.</p>`;
    return;
  }

  restaurants.forEach((restaurant) => {
    const statusColor = restaurant.status === "open" ? "bg-green-500" : "bg-red-500";
    const statusText = restaurant.status === "open" ? "Aberto" : "Fechado";

    const card = document.createElement("div");
    card.className =
      "w-full p-4 bg-white rounded-xl shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow flex items-center space-x-4";
    card.innerHTML = `
      <div class="relative">
        <img src="${restaurant.image}" onerror="this.src='https://placehold.co/100x100/CCCCCC/333333?text=${restaurant.name.charAt(
          0
        )}'" alt="Imagem ${restaurant.name}" class="w-24 h-24 object-cover rounded-xl flex-shrink-0">
        <div class="absolute bottom-1 right-1 px-2 py-1 rounded-full text-xs font-semibold text-white ${statusColor}">
          ${statusText}
        </div>
      </div>
      <div class="flex-grow">
        <h3 class="text-lg font-semibold truncate">${restaurant.name}</h3>
        <p class="text-sm text-gray-500 mt-1">${restaurant.type}</p>
        <p class="text-sm text-gray-500 mt-1">Tempo de entrega: ${restaurant.time}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      document.getElementById("menu-restaurant-name").textContent = restaurant.name;
      document.getElementById("menu-restaurant-type").textContent = restaurant.type;
      fetchAndRenderMenu(restaurant.id);
      window.showPage("menu");
    });

    container.appendChild(card);
  });
};

