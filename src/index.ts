import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import pkg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()
const { Pool } = pkg

const app = new Hono()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

app.get('/', (c) => {
    return c.text('Hello World!')
})

// Get all orders with customer and product information
app.get('/orders', async (c) => {
    try {
        const result = await pool.query(`
            SELECT 
                c.nombre,
                p.nombre_producto,
                pe.cantidad,
                p.precio * pe.cantidad as total,
                pe.fecha_pedido
            FROM pedidos pe
            JOIN clientes c ON pe.id_cliente = c.id_cliente
            JOIN productos p ON pe.id_producto = p.id_producto
        `)
        return c.json(result.rows)
    } catch (error) {
        console.error('Error fetching orders:', error)
        return c.json({ error: 'Failed to fetch orders' }, 500)
    }
})

// Get total products sold by product
app.get('/products/sales', async (c) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.nombre_producto,
                SUM(pe.cantidad) AS total_vendido,
                p.precio AS precio_unitario,
                SUM(pe.cantidad * p.precio) AS total_ventas
            FROM pedidos pe
            JOIN productos p ON pe.id_producto = p.id_producto
            GROUP BY p.nombre_producto, p.precio
        `)
        return c.json(result.rows)
    } catch (error) {
        console.error('Error fetching product sales:', error)
        return c.json({ error: 'Failed to fetch product sales' }, 500)
    }
})

serve({
    fetch: app.fetch,
    port: 3000
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
})
