 Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(10) CHECK (role IN ('cliente', 'mandadero')) NOT NULL,
    lat DECIMAL(9,6),
    lng DECIMAL(9,6),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mandadero_id UUID REFERENCES users(id) ON DELETE SET NULL,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('pendiente', 'aceptado', 'en_ruta', 'entregado', 'cancelado')) DEFAULT 'pendiente',
    price DECIMAL(10,2),
    distance_km DECIMAL(5,2),
    estimated_time_minutes INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla locations (ubicaciones en tiempo real)
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lat DECIMAL(9,6) NOT NULL,
    lng DECIMAL(9,6) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    method VARCHAR(20) CHECK (method IN ('tarjeta', 'efectivo', 'saldo')),
    status VARCHAR(20) CHECK (status IN ('pendiente', 'completado', 'fallido')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);