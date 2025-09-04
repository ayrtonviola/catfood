import { fetchAndRenderMenu } from "./menu.js";

const SERVER_IP = "192.168.3.61:3000"; // IP do seu PC na rede

export const loadRestaurants = async () => {
  try {
    const res = await fetch(`/restaurants`)`;
    const restaurants = await res.json();
    renderRestaurants(restaurants);
  } catch (err) {
    console.error("Erro ao carregar restaurantes:", err);
    const container = document.getElementById("local-restaurants");
    container.innerHTML = `<p class="text-center text-gray-500 mt-8">Erro ao carregar restaurantes.</p>`;
  }
};

const renderRestaurants = (restaurants) => {
  const container = document.getElementById("local-restaurants");
  container.innerHTML = "";

  if (!restaurants || restaurants.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-500 mt-8">Nenhum restaurante encontrado.</p>`;
    return;
  }

  restaurants.forEach((restaurant) => {
    const card = document.createElement("div");
    card.className =
      "w-full p-4 bg-white rounded-xl shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow flex items-center space-x-4";
    card.innerHTML = `
      <div class="flex-grow">
        <h3 class="text-lg font-semibold truncate">${restaurant.name}</h3>
        <p class="text-sm text-gray-500 mt-1">${restaurant.type}</p>
        <p class="text-sm text-gray-500 mt-1">${restaurant.address}</p>
        <p class="text-sm text-gray-500 mt-1">${restaurant.phone}</p>
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
