-- =====================================================
-- SCRIPT DE BASE DE DATOS TECUNIFY
-- Sistema de Reservas de Espacios Tecnológicos
-- =====================================================

-- Crear base de datos
CREATE DATABASE tecunify_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Spain.1252'
    LC_CTYPE = 'Spanish_Spain.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Conectar a la base de datos
\c tecunify_db;

-- =====================================================
-- TABLA: tipos_espacios
-- =====================================================
CREATE TABLE tipos_espacios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: motivos_reserva
-- =====================================================
CREATE TABLE motivos_reserva (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: usuarios
-- =====================================================
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    carnet_estudiantil VARCHAR(50) UNIQUE,
    google_id VARCHAR(255) UNIQUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- TABLA: espacios
-- =====================================================
CREATE TABLE espacios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(200) NOT NULL,
    capacidad INTEGER NOT NULL,
    tipo_espacio_id BIGINT REFERENCES tipos_espacios(id),
    precio_por_hora DECIMAL(10,2) DEFAULT 0.00,
    equipamiento TEXT,
    imagen_url VARCHAR(500),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: horarios_disponibilidad
-- =====================================================
CREATE TABLE horarios_disponibilidad (
    id BIGSERIAL PRIMARY KEY,
    espacio_id BIGINT NOT NULL REFERENCES espacios(id) ON DELETE CASCADE,
    dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6), -- 0=Domingo, 1=Lunes, etc.
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: reservas
-- =====================================================
CREATE TABLE reservas (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    espacio_id BIGINT NOT NULL REFERENCES espacios(id),
    fecha_reserva DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    motivo VARCHAR(200),
    estado VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA')),
    precio_total DECIMAL(10,2),
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_google_id ON usuarios(google_id);
CREATE INDEX idx_espacios_tipo ON espacios(tipo_espacio_id);
CREATE INDEX idx_espacios_activo ON espacios(activo);
CREATE INDEX idx_reservas_usuario ON reservas(usuario_id);
CREATE INDEX idx_reservas_espacio ON reservas(espacio_id);
CREATE INDEX idx_reservas_fecha ON reservas(fecha_reserva);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_horarios_espacio_dia ON horarios_disponibilidad(espacio_id, dia_semana);

-- =====================================================
-- TRIGGER PARA ACTUALIZAR fecha_actualizacion
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reservas_updated_at 
    BEFORE UPDATE ON reservas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar tipos de espacios
INSERT INTO tipos_espacios (nombre, descripcion, icono) VALUES
('Laboratorio', 'Espacios equipados con computadoras y tecnología para clases prácticas', 'wrench'),
('Cancha Deportiva', 'Espacios deportivos para actividades físicas y deportes', 'dumbbell'),
('Sala de Estudio', 'Espacios silenciosos para estudio individual y grupal', 'book-open'),
('Auditorio', 'Espacios grandes para eventos, conferencias y presentaciones', 'users'),
('Aula', 'Espacios tradicionales para clases teóricas', 'chalkboard'),
('Taller', 'Espacios para trabajos prácticos y proyectos', 'hammer');

-- Insertar motivos de reserva
INSERT INTO motivos_reserva (nombre, descripcion) VALUES
('Clase Académica', 'Reserva para clases regulares del programa académico'),
('Proyecto de Investigación', 'Reserva para trabajos de investigación y tesis'),
('Estudio Grupal', 'Reserva para sesiones de estudio en grupo'),
('Evento Académico', 'Reserva para eventos, conferencias y seminarios'),
('Deporte', 'Reserva para actividades deportivas y físicas'),
('Proyecto Personal', 'Reserva para proyectos personales y extracurriculares'),
('Práctica', 'Reserva para sesiones de práctica y laboratorio'),
('Examen', 'Reserva para exámenes y evaluaciones'),
('Reunión', 'Reserva para reuniones y juntas'),
('Otro', 'Otros motivos no especificados');

-- Insertar usuarios de prueba
INSERT INTO usuarios (email, nombre, apellido, telefono, carnet_estudiantil) VALUES
('admin@tecunify.com', 'Administrador', 'Sistema', '999999999', 'ADMIN001'),
('estudiante1@tecunify.com', 'Juan', 'Pérez', '987654321', 'EST001'),
('estudiante2@tecunify.com', 'María', 'González', '987654322', 'EST002'),
('estudiante3@tecunify.com', 'Carlos', 'López', '987654323', 'EST003'),
('profesor1@tecunify.com', 'Ana', 'Martínez', '987654324', 'PROF001');

-- Insertar espacios de prueba
INSERT INTO espacios (nombre, descripcion, ubicacion, capacidad, tipo_espacio_id, precio_por_hora, equipamiento) VALUES
-- Laboratorios
('Laboratorio de Computación A', 'Laboratorio equipado con 30 computadoras de última generación', 'Campus Norte - Edificio A - Piso 2', 30, 1, 50.00, '30 PCs, Proyector 4K, WiFi, Aire acondicionado'),
('Laboratorio de Computación B', 'Laboratorio con 25 computadoras para programación avanzada', 'Campus Norte - Edificio A - Piso 3', 25, 1, 55.00, '25 PCs, Servidor local, WiFi, Aire acondicionado'),
('Laboratorio de Electrónica', 'Laboratorio especializado en electrónica y robótica', 'Campus Norte - Edificio B - Piso 1', 20, 1, 60.00, 'Osciloscopios, Multímetros, Protoboard, Soldadores'),
('Laboratorio de Redes', 'Laboratorio para prácticas de redes y telecomunicaciones', 'Campus Norte - Edificio B - Piso 2', 15, 1, 65.00, 'Switch, Router, Cableado, Herramientas de red'),

-- Canchas Deportivas
('Cancha de Fútbol 1', 'Cancha de fútbol reglamentaria con césped artificial', 'Campus Norte - Zona Deportiva', 22, 2, 40.00, 'Porterías, Iluminación nocturna, Vestuarios'),
('Cancha de Fútbol 2', 'Cancha de fútbol adicional para uso simultáneo', 'Campus Norte - Zona Deportiva', 22, 2, 40.00, 'Porterías, Iluminación nocturna, Vestuarios'),
('Cancha de Básquet', 'Cancha de básquet cubierta con piso profesional', 'Campus Norte - Polideportivo', 20, 2, 45.00, 'Canastas, Marcador electrónico, Vestuarios'),
('Cancha de Vóley', 'Cancha de vóley con red y medidas oficiales', 'Campus Norte - Polideportivo', 12, 2, 35.00, 'Red, Balones, Marcador'),

-- Salas de Estudio
('Sala de Estudio Silenciosa', 'Sala para estudio individual con ambiente silencioso', 'Campus Norte - Biblioteca - Piso 3', 15, 3, 20.00, 'Mesa individual, Luz LED, WiFi, Silencio'),
('Sala de Estudio Grupal', 'Sala para estudio en grupo con mesas grandes', 'Campus Norte - Biblioteca - Piso 2', 25, 3, 25.00, 'Mesas grandes, Pizarra, WiFi, Proyector'),
('Sala de Estudio 24/7', 'Sala de estudio disponible las 24 horas', 'Campus Norte - Biblioteca - Piso 1', 20, 3, 30.00, 'Mesas, WiFi, Iluminación, Seguridad'),

-- Auditorios
('Auditorio Principal', 'Auditorio principal para eventos grandes', 'Campus Norte - Edificio Central', 200, 4, 100.00, 'Sistema de sonido, Proyector 4K, Escenario, Aire acondicionado'),
('Auditorio Pequeño', 'Auditorio para eventos medianos', 'Campus Norte - Edificio Central', 100, 4, 75.00, 'Sistema de sonido, Proyector, Escenario'),
('Sala de Conferencias', 'Sala para conferencias y presentaciones', 'Campus Norte - Edificio A - Piso 1', 50, 4, 60.00, 'Proyector, Sistema de sonido, Mesas ejecutivas'),

-- Aulas
('Aula Magna', 'Aula principal para clases grandes', 'Campus Norte - Edificio Central', 150, 5, 40.00, 'Proyector, Sistema de sonido, Escenario'),
('Aula 101', 'Aula estándar para clases regulares', 'Campus Norte - Edificio A - Piso 1', 40, 5, 25.00, 'Proyector, Pizarra, WiFi'),
('Aula 102', 'Aula estándar para clases regulares', 'Campus Norte - Edificio A - Piso 1', 40, 5, 25.00, 'Proyector, Pizarra, WiFi'),

-- Talleres
('Taller de Mecánica', 'Taller para trabajos de mecánica y automotriz', 'Campus Norte - Edificio C - Piso 1', 20, 6, 70.00, 'Herramientas, Bancos de trabajo, Compresor'),
('Taller de Carpintería', 'Taller para trabajos de carpintería y madera', 'Campus Norte - Edificio C - Piso 2', 15, 6, 65.00, 'Sierras, Taladros, Bancos de trabajo');

-- Insertar horarios de disponibilidad para algunos espacios
INSERT INTO horarios_disponibilidad (espacio_id, dia_semana, hora_inicio, hora_fin) VALUES
-- Laboratorio de Computación A (Lunes a Viernes 8:00-22:00, Sábado 8:00-18:00)
(1, 1, '08:00', '22:00'), -- Lunes
(1, 2, '08:00', '22:00'), -- Martes
(1, 3, '08:00', '22:00'), -- Miércoles
(1, 4, '08:00', '22:00'), -- Jueves
(1, 5, '08:00', '22:00'), -- Viernes
(1, 6, '08:00', '18:00'), -- Sábado

-- Cancha de Fútbol 1 (Todos los días 6:00-22:00)
(5, 0, '06:00', '22:00'), -- Domingo
(5, 1, '06:00', '22:00'), -- Lunes
(5, 2, '06:00', '22:00'), -- Martes
(5, 3, '06:00', '22:00'), -- Miércoles
(5, 4, '06:00', '22:00'), -- Jueves
(5, 5, '06:00', '22:00'), -- Viernes
(5, 6, '06:00', '22:00'), -- Sábado

-- Sala de Estudio Silenciosa (Todos los días 6:00-23:00)
(9, 0, '06:00', '23:00'), -- Domingo
(9, 1, '06:00', '23:00'), -- Lunes
(9, 2, '06:00', '23:00'), -- Martes
(9, 3, '06:00', '23:00'), -- Miércoles
(9, 4, '06:00', '23:00'), -- Jueves
(9, 5, '06:00', '23:00'), -- Viernes
(9, 6, '06:00', '23:00'), -- Sábado

-- Auditorio Principal (Lunes a Viernes 8:00-20:00)
(13, 1, '08:00', '20:00'), -- Lunes
(13, 2, '08:00', '20:00'), -- Martes
(13, 3, '08:00', '20:00'), -- Miércoles
(13, 4, '08:00', '20:00'), -- Jueves
(13, 5, '08:00', '20:00'); -- Viernes

-- Insertar algunas reservas de ejemplo
INSERT INTO reservas (usuario_id, espacio_id, fecha_reserva, hora_inicio, hora_fin, motivo, estado, precio_total) VALUES
(2, 1, '2024-01-15', '09:00', '11:00', 'Clase Académica', 'CONFIRMADA', 100.00),
(2, 5, '2024-01-16', '14:00', '16:00', 'Deporte', 'PENDIENTE', 80.00),
(3, 9, '2024-01-17', '18:00', '20:00', 'Estudio Grupal', 'CONFIRMADA', 50.00),
(4, 13, '2024-01-18', '10:00', '12:00', 'Evento Académico', 'PENDIENTE', 200.00),
(5, 2, '2024-01-19', '15:00', '17:00', 'Proyecto de Investigación', 'CONFIRMADA', 110.00);

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista para reservas con información completa
CREATE VIEW vista_reservas_completa AS
SELECT 
    r.id,
    r.fecha_reserva,
    r.hora_inicio,
    r.hora_fin,
    r.motivo,
    r.estado,
    r.precio_total,
    r.fecha_creacion,
    u.nombre || ' ' || u.apellido as usuario_nombre,
    u.email as usuario_email,
    e.nombre as espacio_nombre,
    e.ubicacion as espacio_ubicacion,
    te.nombre as tipo_espacio
FROM reservas r
JOIN usuarios u ON r.usuario_id = u.id
JOIN espacios e ON r.espacio_id = e.id
JOIN tipos_espacios te ON e.tipo_espacio_id = te.id;

-- Vista para espacios disponibles
CREATE VIEW vista_espacios_disponibles AS
SELECT 
    e.id,
    e.nombre,
    e.descripcion,
    e.ubicacion,
    e.capacidad,
    e.precio_por_hora,
    e.equipamiento,
    e.imagen_url,
    te.nombre as tipo_espacio,
    te.icono as tipo_icono
FROM espacios e
JOIN tipos_espacios te ON e.tipo_espacio_id = te.id
WHERE e.activo = TRUE AND te.activo = TRUE;

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para verificar disponibilidad
CREATE OR REPLACE FUNCTION verificar_disponibilidad(
    p_espacio_id BIGINT,
    p_fecha DATE,
    p_hora_inicio TIME,
    p_hora_fin TIME
) RETURNS BOOLEAN AS $$
DECLARE
    dia_semana INTEGER;
    horario_existe BOOLEAN;
    conflicto_existe BOOLEAN;
BEGIN
    -- Obtener día de la semana (0=Domingo, 1=Lunes, etc.)
    dia_semana := EXTRACT(DOW FROM p_fecha);
    
    -- Verificar si existe horario de disponibilidad
    SELECT EXISTS(
        SELECT 1 FROM horarios_disponibilidad h
        WHERE h.espacio_id = p_espacio_id
        AND h.dia_semana = dia_semana
        AND h.activo = TRUE
        AND h.hora_inicio <= p_hora_inicio
        AND h.hora_fin >= p_hora_fin
    ) INTO horario_existe;
    
    IF NOT horario_existe THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar conflictos con reservas existentes
    SELECT EXISTS(
        SELECT 1 FROM reservas r
        WHERE r.espacio_id = p_espacio_id
        AND r.fecha_reserva = p_fecha
        AND r.estado IN ('PENDIENTE', 'CONFIRMADA')
        AND r.hora_inicio < p_hora_fin
        AND r.hora_fin > p_hora_inicio
    ) INTO conflicto_existe;
    
    RETURN NOT conflicto_existe;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PERMISOS
-- =====================================================

-- Crear usuario para la aplicación
CREATE USER tecunify_app WITH PASSWORD 'TecUnify2024!';

-- Otorgar permisos
GRANT CONNECT ON DATABASE tecunify_db TO tecunify_app;
GRANT USAGE ON SCHEMA public TO tecunify_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO tecunify_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO tecunify_app;

-- =====================================================
-- MENSAJE FINAL
-- =====================================================
SELECT 'Base de datos TecUnify creada exitosamente!' as mensaje;
SELECT 'Tablas creadas: ' || COUNT(*) as total_tablas FROM information_schema.tables WHERE table_schema = 'public';
SELECT 'Datos insertados en tipos_espacios: ' || COUNT(*) as tipos FROM tipos_espacios;
SELECT 'Datos insertados en motivos_reserva: ' || COUNT(*) as motivos FROM motivos_reserva;
SELECT 'Datos insertados en usuarios: ' || COUNT(*) as usuarios FROM usuarios;
SELECT 'Datos insertados en espacios: ' || COUNT(*) as espacios FROM espacios;
SELECT 'Datos insertados en horarios_disponibilidad: ' || COUNT(*) as horarios FROM horarios_disponibilidad;
SELECT 'Datos insertados en reservas: ' || COUNT(*) as reservas FROM reservas;
