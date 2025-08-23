import { db, appId } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const restaurants = [
  {
    name: "Dheli Burger",
    type: "Hambúrguer",
    modality: "hamburguer",
    status: "open",
    time: "30-45 min",
    image: "https://placehold.co/150x150?text=Dheli+Burger",
  },
  {
    name: "Crhis Hamburgueria e Pastelaria",
    type: "Hambúrguer",
    modality: "hamburguer",
    status: "open",
    time: "30-45 min",
    image: "https://placehold.co/150x150?text=Crhis",
  },
  {
    name: "Bom Bar",
    type: "Hambúrguer",
    modality: "hamburguer",
    status: "open",
    time: "25-40 min",
    image: "https://placehold.co/150x150?text=Bom+Bar",
  },
  {
    name: "Lanche Caatiba",
    type: "Hambúrguer",
    modality: "hamburguer",
    status: "open",
    time: "20-35 min",
    image: "https://placehold.co/150x150?text=Lanche+Caatiba",
  },
  {
    name: "Mr. Açaí",
    type: "Açaí",
    modality: "acai",
    status: "open",
    time: "20-30 min",
    image: "https://placehold.co/150x150?text=Mr+Acai",
  },
  {
    name: "Azevedo Pizzaria",
    type: "Pizza",
    modality: "pizza",
    status: "open",
    time: "40-60 min",
    image: "https://placehold.co/150x150?text=Azevedo",
  },
  {
    name: "Casa da Pizza",
    type: "Pizza",
    modality: "pizza",
    status: "open",
    time: "40-60 min",
    image: "https://placehold.co/150x150?text=Casa+da+Pizza",
  },
];

export const seedRestaurants = async () => {
  try {
    for (const r of restaurants) {
      await addDoc(collection(db, `artifacts/${appId}/public/data/restaurants`), r);
    }
    window.showMessage("Restaurantes cadastrados com sucesso!");
  } catch (e) {
    console.error("Erro ao cadastrar restaurantes:", e);
    window.showMessage("Erro ao cadastrar restaurantes.");
  }
};
