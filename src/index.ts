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

app.post('/clientes', async (c) => {
    const { nombre, email } = await c.req.json()
    try {
        const result = await pool.query(`
            INSERT INTO clientes (nombre, email)
            VALUES ($1, $2)
            RETURNING *
        `, [nombre, email])
        return c.json(result.rows[0])
    } catch (error) {
        console.error('Error adding client:', error)
        return c.json({ error: 'Failed to add client' }, 500)
    }
})

app.get('/clientes', async (c) => {
    try {
        const result = await pool.query(`
            SELECT * FROM clientes
        `)
        return c.json(result.rows)
    } catch (error) {
        console.error('Error fetching clients:', error)
        return c.json({ error: 'Failed to fetch clients' }, 500)
    }
})

app.post('/productos', async (c) => {
    const { nombre_producto, precio, stock } = await c.req.json()
    try {
        const result = await pool.query(`
            INSERT INTO productos (nombre_producto, precio, stock)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [nombre_producto, precio, stock])
        return c.json(result.rows[0])
    } catch (error) {
        console.error('Error adding product:', error)
        return c.json({ error: 'Failed to add product' }, 500)
    }
})

app.get('/productos', async (c) => {
    try {
        const result = await pool.query(`
            SELECT * FROM productos
        `)
        return c.json(result.rows)
    } catch (error) {
        console.error('Error fetching products:', error)
        return c.json({ error: 'Failed to fetch products' }, 500)
    }
})

app.post('/pedidos', async (c) => {
    const { id_cliente, id_producto, cantidad } = await c.req.json()
    try {
        const result = await pool.query(`
            INSERT INTO pedidos (id_cliente, id_producto, cantidad)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [id_cliente, id_producto, cantidad])
        return c.json(result.rows[0])
    } catch (error) {
        console.error('Error adding order:', error)
        return c.json({ error: 'Failed to add order' }, 500)
    }
})

// Reportes

app.get('/pedidos', async (c) => {
    try {
        const result = await pool.query(`
            SELECT 
                pe.id_pedido as id,
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

app.get('/productos/ventas', async (c) => {
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
