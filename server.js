require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Inicializa Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware para JSON
app.use(express.json());

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
        items,
      });
    }

    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar menu' });
  }
});

// Salva um novo pedido
app.post('/orders', async (req, res) => {
  const { userId, items, total, status } = req.body;

  try {
    const { error } = await supabase
      .from('orders')
      .insert([{ user_id: userId, items, total, status }]);

    if (error) throw error;
    res.status(201).json({ message: 'Pedido salvo com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar pedido' });
  }
});

// Lista pedidos de um usuário
app.get('/orders/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});
// Cadastra um novo usuário
app.post('/signup', async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, phone }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ id: data.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});
// ----------------- FRONTEND -----------------

// Serve arquivos estáticos da pasta raiz
app.use(express.static(path.join(__dirname)));

// SPA: retorna index.html para qualquer rota desconhecida
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ----------------- INÍCIO DO SERVIDOR -----------------
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});