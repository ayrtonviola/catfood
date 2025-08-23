import { addToCart } from "./cart.js";

const SERVER_IP = "192.168.3.61:3000"; // IP do seu PC na rede

export const fetchAndRenderMenu = async (restaurantId) => {
  try {
    const res = await fetch(`http://${SERVER_IP}/restaurants/${restaurantId}/menu`);
    const categories = await res.json(); // array de categorias com itens
    renderMenu(categories);
  } catch (err) {
    console.error("Erro ao carregar menu:", err);
    const container = document.getElementById("menu-products");
    container.innerHTML = `<p class="text-center text-gray-500 mt-8">Erro ao carregar produtos.</p>`;
  }
};

const renderMenu = (categories) => {
  const container = document.getElementById("menu-products");
  container.innerHTML = "";

  if (!categories || categories.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-500 mt-8">Nenhum produto disponível.</p>`;
    return;
  }

  categories.forEach((cat) => {
    const catTitle = document.createElement("h3");
    catTitle.textContent = cat.category;
    catTitle.className = "text-xl font-semibold mt-6 mb-2";
    container.appendChild(catTitle);

    cat.items.forEach((product) => {
      const card = document.createElement("div");
      card.className =
        "w-full p-4 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col space-y-2";
      card.innerHTML = `
        <img src="${product.image || 'https://placehold.co/150x150/CCCCCC/333333?text=Produto'}" 
             alt="Imagem ${product.name}" class="w-full h-32 object-cover rounded-xl">
        <h4 class="text-lg font-semibold">${product.name}</h4>
        <p class="text-sm text-gray-500">${product.description || ""}</p>
        <div class="flex justify-between items-center">
          <span class="font-bold text-lg text-purple-600">R$ ${product.price.toFixed(2).replace(".", ",")}</span>
          <button class="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5v14m-7-7h14"/>
            </svg>
          </button>
        </div>
      `;
      card.querySelector("button").addEventListener("click", () => addToCart(product));
      container.appendChild(card);
    });
  });
};
