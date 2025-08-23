
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Variáveis globais vindas do ambiente (pode ajustar depois)
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

export let db;
export let auth;

// Inicializa Firebase e autenticação
export const initFirebase = async (onReady) => {
  if (Object.keys(firebaseConfig).length === 0) {
    document.getElementById('local-restaurants').innerHTML =
      `<p class="text-center text-gray-500 mt-8">Firebase não configurado. Adicione sua configuração.</p>`;
    return;
  }

  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    if (initialAuthToken) {
      await signInWithCustomToken(auth, initialAuthToken);
    } else {
      await signInAnonymously(auth);
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Usuário autenticado:", user.uid);
        if (onReady) onReady();
      } else {
        console.log("Usuário deslogado.");
        document.getElementById('local-restaurants').innerHTML =
          `<p class="text-center text-gray-500 mt-8">Por favor, recarregue a página para autenticar.</p>`;
      }
    });
  } catch (e) {
    console.error("Erro Firebase:", e);
  }
};
