-- Tabla Clientes
CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla Productos
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL
);

-- Tabla Pedidos
CREATE TABLE pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    fecha_pedido DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Insertar datos de ejemplo
INSERT INTO clientes (nombre, email) VALUES
('Carlos Gómez', 'carlos@mail.com'),
('Ana Torres', 'ana@mail.com');

INSERT INTO productos (nombre_producto, precio, stock) VALUES
('Laptop', 1200.00, 10),
('Smartphone', 800.00, 20);

INSERT INTO pedidos (id_cliente, id_producto, cantidad) VALUES
(1, 1, 1),  -- Carlos compra 1 laptop
(2, 2, 2);  -- Ana compra 2 smartphones

-- Ver todos los pedidos con información del cliente y producto
SELECT 
	pe.id_pedido as id,
    c.nombre,
    p.nombre_producto,
    pe.cantidad,
    p.precio * pe.cantidad as total,
    pe.fecha_pedido
FROM pedidos pe
JOIN clientes c ON pe.id_cliente = c.id_cliente
JOIN productos p ON pe.id_producto = p.id_producto;

--Total de productos vendidos por cada producto
SELECT 
    p.nombre_producto,
    SUM(pe.cantidad) AS total_vendido,
    p.precio AS precio_unitario,
    SUM(pe.cantidad * p.precio) AS total_ventas
FROM pedidos pe
JOIN productos p ON pe.id_producto = p.id_producto
GROUP BY p.nombre_producto, p.precio;