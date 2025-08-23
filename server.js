const express = require("express")
const { createClient } = require("@supabase/supabase-js")
require("dotenv").config()

// 1. Conexão com Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// 2. Criar app Express
const app = express()
const PORT = 3000

// 3. Endpoint para listar restaurantes + menus
app.get("/restaurants", async (req, res) => {
  try {
    // Buscar restaurantes em ordem alfabética
    const { data: restaurants, error: errorRestaurants } = await supabase
      .from("restaurants")
      .select("*")
      .order("name", { ascending: true })

    if (errorRestaurants) throw errorRestaurants

    // Buscar itens de menu
    const { data: items, error: errorItems } = await supabase
      .from("menu_items")
      .select("*")

    if (errorItems) throw errorItems

    // Juntar cada restaurante com seus itens
    const result = restaurants.map(r => ({
      ...r,
      menu: items.filter(i => i.restaurant_id === r.id)
    }))

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 4. Rodar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
