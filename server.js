require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

// Inicializa Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ----------------- ENDPOINTS -----------------

// Lista restaurantes em ordem alfabética
app.get('/restaurants', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar restaurantes' });
  }
});

// Retorna itens de um restaurante separados por categoria
app.get('/restaurants/:id/menu', async (req, res) => {
  const restaurantId = req.params.id;

  try {
    const { data: categories, error: catError } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('name', { ascending: true });

    if (catError) throw catError;

    const menu = [];
    for (const cat of categories) {
      const { data: items, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('category_id', cat.id)
        .order('name', { ascending: true });

      if (itemsError) throw itemsError;

      menu.push({
        category: cat.name,
        items
      });
    }

    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar menu' });
  }
});

// ----------------- FRONTEND -----------------

// Serve arquivos estáticos da pasta "catfood"
app.use(express.static(path.join(__dirname)));

// Para todas as outras rotas, retorna o index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ----------------- INÍCIO DO SERVIDOR -----------------
app.listen(port, () => {
  console.log(`Servidor rodando na rede na porta ${port}`);
});
