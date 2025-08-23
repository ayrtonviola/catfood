require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Conexão com Supabase via .env
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function seed() {
  try {
    // ---------- RESTAURANTES ----------
    const restaurants = [
      { name: 'Burger House', type: 'burger', address: 'Rua A, 123', phone: '1111-1111' },
      { name: 'Pizza Palace', type: 'pizza', address: 'Rua B, 456', phone: '2222-2222' },
      { name: 'Sushi World', type: 'sushi', address: 'Rua C, 789', phone: '3333-3333' }
    ];

    const { data: restaurantsData, error: restaurantsError } = await supabase
      .from('restaurants')
      .insert(restaurants)
      .select();

    if (restaurantsError) throw restaurantsError;

    console.log('✅ Restaurantes inseridos:', restaurantsData.length);

    // ---------- CATEGORIAS ----------
    const menuCategories = [
      { name: 'Burgers', restaurant_id: restaurantsData[0].id },
      { name: 'Bebidas', restaurant_id: restaurantsData[0].id },
      { name: 'Pizzas', restaurant_id: restaurantsData[1].id },
      { name: 'Bebidas', restaurant_id: restaurantsData[1].id },
      { name: 'Sushi Rolls', restaurant_id: restaurantsData[2].id },
      { name: 'Bebidas', restaurant_id: restaurantsData[2].id }
    ];

    const { data: categoriesData, error: categoriesError } = await supabase
      .from('menu_categories')
      .insert(menuCategories)
      .select();

    if (categoriesError) throw categoriesError;

    console.log('✅ Categorias inseridas:', categoriesData.length);

    // ---------- ITENS ----------
    const menuItems = [
      { 
        name: 'Classic Burger', 
        price: 19.9, 
        category_id: categoriesData.find(c => c.name === 'Burgers').id,
        options: { tamanho: 'M', adicionais: ['queijo', 'bacon'], meioMeio: false }
      },
      { 
        name: 'Coca-Cola 350ml', 
        price: 5.0, 
        category_id: categoriesData.find(c => c.name === 'Bebidas' && c.restaurant_id === restaurantsData[0].id).id,
        options: {}
      },
      { 
        name: 'Margherita', 
        price: 29.9, 
        category_id: categoriesData.find(c => c.name === 'Pizzas').id,
        options: { tamanho: 'G', borda: ['catupiry'], meioMeio: true }
      },
      { 
        name: 'Sushi Combo 10', 
        price: 49.9, 
        category_id: categoriesData.find(c => c.name === 'Sushi Rolls').id,
        options: { adicionais: ['gengibre', 'wasabi'] }
      }
    ];

    const { data: itemsData, error: itemsError } = await supabase
      .from('menu_items')
      .insert(menuItems)
      .select();

    if (itemsError) throw itemsError;

    console.log('✅ Itens inseridos:', itemsData.length);

    console.log('🎉 Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao rodar seed:', error);
  }
}

// Executa o seed
seed();
