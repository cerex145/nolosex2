-- =====================================================
-- SCRIPT SQL PARA PGADMIN4 - TECUNIFY COMPLETO
-- Sistema de Reservas con Relaciones Completas
-- =====================================================

-- Eliminar tablas existentes si existen (en orden correcto por dependencias)
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS horarios_disponibilidad CASCADE;
DROP TABLE IF EXISTS espacios CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS tipos_espacios CASCADE;
DROP TABLE IF EXISTS motivos_reserva CASCADE;

-- Eliminar secuencias si existen
DROP SEQUENCE IF EXISTS usuarios_id_seq CASCADE;
DROP SEQUENCE IF EXISTS tipos_espacios_id_seq CASCADE;
DROP SEQUENCE IF EXISTS motivos_reserva_id_seq CASCADE;
DROP SEQUENCE IF EXISTS espacios_id_seq CASCADE;
DROP SEQUENCE IF EXISTS horarios_disponibilidad_id_seq CASCADE;
DROP SEQUENCE IF EXISTS reservas_id_seq CASCADE;

-- =====================================================
-- TABLA: tipos_espacios
-- =====================================================
CREATE TABLE tipos_espacios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: motivos_reserva
-- =====================================================
CREATE TABLE motivos_reserva (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    activo BOOLEAN DEFAULT TRUE,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint para validar email
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    
    -- Constraint para validar teléfono
    CONSTRAINT chk_telefono_format CHECK (telefono IS NULL OR telefono ~ '^[0-9+\-\s()]+$')
);

-- =====================================================
-- TABLA: espacios
-- =====================================================
CREATE TABLE espacios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(200) NOT NULL,
    capacidad INTEGER NOT NULL CHECK (capacidad > 0),
    tipo_espacio_id BIGINT NOT NULL REFERENCES tipos_espacios(id) ON DELETE RESTRICT,
    precio_por_hora DECIMAL(10,2) DEFAULT 0.00 CHECK (precio_por_hora >= 0),
    equipamiento TEXT,
    imagen_url VARCHAR(500),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint para validar URL de imagen
    CONSTRAINT chk_imagen_url CHECK (imagen_url IS NULL OR imagen_url ~ '^https?://.*')
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
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint para validar que hora_fin > hora_inicio
    CONSTRAINT chk_horario_valido CHECK (hora_fin > hora_inicio),
    
    -- Constraint para evitar horarios duplicados en el mismo día
    CONSTRAINT uk_espacio_dia_horario UNIQUE (espacio_id, dia_semana, hora_inicio, hora_fin)
);

-- =====================================================
-- TABLA: reservas
-- =====================================================
CREATE TABLE reservas (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    espacio_id BIGINT NOT NULL REFERENCES espacios(id) ON DELETE CASCADE,
    fecha_reserva DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    motivo VARCHAR(200),
    estado VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA')),
    precio_total DECIMAL(10,2) CHECK (precio_total >= 0),
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint para validar que hora_fin > hora_inicio
    CONSTRAINT chk_reserva_horario_valido CHECK (hora_fin > hora_inicio),
    
    -- Constraint para validar que la fecha no sea en el pasado
    CONSTRAINT chk_fecha_futura CHECK (fecha_reserva >= CURRENT_DATE),
    
    -- Constraint para evitar reservas duplicadas en el mismo espacio y horario
    CONSTRAINT uk_reserva_espacio_fecha_hora UNIQUE (espacio_id, fecha_reserva, hora_inicio, hora_fin)
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_google_id ON usuarios(google_id);
CREATE INDEX idx_usuarios_carnet ON usuarios(carnet_estudiantil);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- Índices para espacios
CREATE INDEX idx_espacios_tipo ON espacios(tipo_espacio_id);
CREATE INDEX idx_espacios_activo ON espacios(activo);
CREATE INDEX idx_espacios_nombre ON espacios(nombre);
CREATE INDEX idx_espacios_ubicacion ON espacios(ubicacion);

-- Índices para horarios
CREATE INDEX idx_horarios_espacio ON horarios_disponibilidad(espacio_id);
CREATE INDEX idx_horarios_dia ON horarios_disponibilidad(dia_semana);
CREATE INDEX idx_horarios_espacio_dia ON horarios_disponibilidad(espacio_id, dia_semana);

-- Índices para reservas
CREATE INDEX idx_reservas_usuario ON reservas(usuario_id);
CREATE INDEX idx_reservas_espacio ON reservas(espacio_id);
CREATE INDEX idx_reservas_fecha ON reservas(fecha_reserva);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_reservas_fecha_espacio ON reservas(fecha_reserva, espacio_id);
CREATE INDEX idx_reservas_usuario_fecha ON reservas(usuario_id, fecha_reserva);

-- =====================================================
-- TRIGGERS PARA ACTUALIZAR fecha_actualizacion
-- =====================================================

-- Función para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para cada tabla
CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tipos_espacios_updated_at 
    BEFORE UPDATE ON tipos_espacios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_motivos_reserva_updated_at 
    BEFORE UPDATE ON motivos_reserva 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_espacios_updated_at 
    BEFORE UPDATE ON espacios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservas_updated_at 
    BEFORE UPDATE ON reservas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para verificar disponibilidad de un espacio
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

-- Función para calcular precio total de una reserva
CREATE OR REPLACE FUNCTION calcular_precio_reserva(
    p_espacio_id BIGINT,
    p_hora_inicio TIME,
    p_hora_fin TIME
) RETURNS DECIMAL(10,2) AS $$
DECLARE
    precio_por_hora DECIMAL(10,2);
    horas_reservadas DECIMAL(10,2);
    precio_total DECIMAL(10,2);
BEGIN
    -- Obtener precio por hora del espacio
    SELECT e.precio_por_hora INTO precio_por_hora
    FROM espacios e
    WHERE e.id = p_espacio_id AND e.activo = TRUE;
    
    IF precio_por_hora IS NULL THEN
        RETURN 0.00;
    END IF;
    
    -- Calcular horas reservadas
    horas_reservadas := EXTRACT(EPOCH FROM (p_hora_fin - p_hora_inicio)) / 3600;
    
    -- Calcular precio total
    precio_total := precio_por_hora * horas_reservadas;
    
    RETURN precio_total;
END;
$$ LANGUAGE plpgsql;

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
('profesor1@tecunify.com', 'Ana', 'Martínez', '987654324', 'PROF001'),
('estudiante4@tecunify.com', 'Laura', 'Rodríguez', '987654325', 'EST004'),
('estudiante5@tecunify.com', 'Diego', 'Fernández', '987654326', 'EST005'),
('profesor2@tecunify.com', 'Roberto', 'Silva', '987654327', 'PROF002');

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
('Taller de Carpintería', 'Taller para trabajos de carpintería y madera', 'Campus Norte - Edificio C - Piso 2', 15, 6, 65.00, 'Sierras, Taladros, Bancos de trabajo'),
('Taller de Soldadura', 'Taller especializado en soldadura y metalurgia', 'Campus Norte - Edificio C - Piso 3', 12, 6, 80.00, 'Soldadoras, Equipos de protección, Bancos de trabajo');

-- Insertar horarios de disponibilidad para algunos espacios
-- Laboratorio de Computación A (Lunes a Viernes 8:00-22:00, Sábado 8:00-18:00)
INSERT INTO horarios_disponibilidad (espacio_id, dia_semana, hora_inicio, hora_fin) VALUES
(1, 1, '08:00', '22:00'), -- Lunes
(1, 2, '08:00', '22:00'), -- Martes
(1, 3, '08:00', '22:00'), -- Miércoles
(1, 4, '08:00', '22:00'), -- Jueves
(1, 5, '08:00', '22:00'), -- Viernes
(1, 6, '08:00', '18:00'); -- Sábado

-- Cancha de Fútbol 1 (Todos los días 6:00-22:00)
INSERT INTO horarios_disponibilidad (espacio_id, dia_semana, hora_inicio, hora_fin) VALUES
(5, 0, '06:00', '22:00'), -- Domingo
(5, 1, '06:00', '22:00'), -- Lunes
(5, 2, '06:00', '22:00'), -- Martes
(5, 3, '06:00', '22:00'), -- Miércoles
(5, 4, '06:00', '22:00'), -- Jueves
(5, 5, '06:00', '22:00'), -- Viernes
(5, 6, '06:00', '22:00'); -- Sábado

-- Sala de Estudio Silenciosa (Todos los días 6:00-23:00)
INSERT INTO horarios_disponibilidad (espacio_id, dia_semana, hora_inicio, hora_fin) VALUES
(9, 0, '06:00', '23:00'), -- Domingo
(9, 1, '06:00', '23:00'), -- Lunes
(9, 2, '06:00', '23:00'), -- Martes
(9, 3, '06:00', '23:00'), -- Miércoles
(9, 4, '06:00', '23:00'), -- Jueves
(9, 5, '06:00', '23:00'), -- Viernes
(9, 6, '06:00', '23:00'); -- Sábado

-- Auditorio Principal (Lunes a Viernes 8:00-20:00)
INSERT INTO horarios_disponibilidad (espacio_id, dia_semana, hora_inicio, hora_fin) VALUES
(13, 1, '08:00', '20:00'), -- Lunes
(13, 2, '08:00', '20:00'), -- Martes
(13, 3, '08:00', '20:00'), -- Miércoles
(13, 4, '08:00', '20:00'), -- Jueves
(13, 5, '08:00', '20:00'); -- Viernes

-- Insertar algunas reservas de ejemplo con relaciones completas
INSERT INTO reservas (usuario_id, espacio_id, fecha_reserva, hora_inicio, hora_fin, motivo, estado, precio_total) VALUES
-- Reservas de Juan Pérez (estudiante1)
(2, 1, CURRENT_DATE + INTERVAL '1 day', '09:00', '11:00', 'Clase Académica', 'CONFIRMADA', 100.00),
(2, 5, CURRENT_DATE + INTERVAL '2 days', '14:00', '16:00', 'Deporte', 'PENDIENTE', 80.00),
(2, 9, CURRENT_DATE + INTERVAL '3 days', '18:00', '20:00', 'Estudio Grupal', 'CONFIRMADA', 40.00),

-- Reservas de María González (estudiante2)
(3, 2, CURRENT_DATE + INTERVAL '1 day', '15:00', '17:00', 'Proyecto de Investigación', 'CONFIRMADA', 110.00),
(3, 6, CURRENT_DATE + INTERVAL '4 days', '10:00', '12:00', 'Deporte', 'PENDIENTE', 80.00),
(3, 13, CURRENT_DATE + INTERVAL '5 days', '10:00', '12:00', 'Evento Académico', 'CONFIRMADA', 200.00),

-- Reservas de Carlos López (estudiante3)
(4, 3, CURRENT_DATE + INTERVAL '2 days', '08:00', '10:00', 'Práctica', 'CONFIRMADA', 120.00),
(4, 7, CURRENT_DATE + INTERVAL '3 days', '16:00', '18:00', 'Deporte', 'PENDIENTE', 90.00),

-- Reservas de Ana Martínez (profesor1)
(5, 13, CURRENT_DATE + INTERVAL '1 day', '14:00', '16:00', 'Evento Académico', 'CONFIRMADA', 200.00),
(5, 1, CURRENT_DATE + INTERVAL '6 days', '10:00', '12:00', 'Clase Académica', 'PENDIENTE', 100.00),

-- Reservas de Laura Rodríguez (estudiante4)
(6, 9, CURRENT_DATE + INTERVAL '2 days', '19:00', '21:00', 'Estudio Grupal', 'CONFIRMADA', 40.00),
(6, 10, CURRENT_DATE + INTERVAL '4 days', '15:00', '17:00', 'Estudio Grupal', 'PENDIENTE', 50.00),

-- Reservas de Diego Fernández (estudiante5)
(7, 4, CURRENT_DATE + INTERVAL '3 days', '09:00', '11:00', 'Práctica', 'CONFIRMADA', 130.00),
(7, 8, CURRENT_DATE + INTERVAL '5 days', '17:00', '19:00', 'Deporte', 'PENDIENTE', 70.00),

-- Reservas de Roberto Silva (profesor2)
(8, 14, CURRENT_DATE + INTERVAL '2 days', '11:00', '13:00', 'Clase Académica', 'CONFIRMADA', 80.00),
(8, 15, CURRENT_DATE + INTERVAL '7 days', '14:00', '16:00', 'Clase Académica', 'PENDIENTE', 50.00);

-- =====================================================
-- VISTAS ÚTILES CON RELACIONES COMPLETAS
-- =====================================================

-- Vista para reservas con información completa del usuario y espacio
CREATE VIEW vista_reservas_completa AS
SELECT 
    r.id as reserva_id,
    r.fecha_reserva,
    r.hora_inicio,
    r.hora_fin,
    r.motivo,
    r.estado,
    r.precio_total,
    r.observaciones,
    r.fecha_creacion as fecha_reserva_creada,
    r.fecha_actualizacion as fecha_reserva_actualizada,
    
    -- Información del usuario
    u.id as usuario_id,
    u.email as usuario_email,
    u.nombre as usuario_nombre,
    u.apellido as usuario_apellido,
    u.telefono as usuario_telefono,
    u.carnet_estudiantil as usuario_carnet,
    u.fecha_registro as usuario_registrado,
    
    -- Información del espacio
    e.id as espacio_id,
    e.nombre as espacio_nombre,
    e.descripcion as espacio_descripcion,
    e.ubicacion as espacio_ubicacion,
    e.capacidad as espacio_capacidad,
    e.precio_por_hora as espacio_precio_hora,
    e.equipamiento as espacio_equipamiento,
    e.imagen_url as espacio_imagen,
    
    -- Información del tipo de espacio
    te.id as tipo_espacio_id,
    te.nombre as tipo_espacio_nombre,
    te.descripcion as tipo_espacio_descripcion,
    te.icono as tipo_espacio_icono
FROM reservas r
JOIN usuarios u ON r.usuario_id = u.id
JOIN espacios e ON r.espacio_id = e.id
JOIN tipos_espacios te ON e.tipo_espacio_id = te.id;

-- Vista para espacios disponibles con información completa
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
    e.activo,
    e.fecha_creacion,
    
    -- Información del tipo
    te.id as tipo_id,
    te.nombre as tipo_nombre,
    te.descripcion as tipo_descripcion,
    te.icono as tipo_icono,
    
    -- Contar reservas activas
    (SELECT COUNT(*) FROM reservas r 
     WHERE r.espacio_id = e.id 
     AND r.estado IN ('PENDIENTE', 'CONFIRMADA')
     AND r.fecha_reserva >= CURRENT_DATE) as reservas_activas
FROM espacios e
JOIN tipos_espacios te ON e.tipo_espacio_id = te.id
WHERE e.activo = TRUE AND te.activo = TRUE;

-- Vista para usuarios con estadísticas de reservas
CREATE VIEW vista_usuarios_estadisticas AS
SELECT 
    u.id,
    u.email,
    u.nombre,
    u.apellido,
    u.telefono,
    u.carnet_estudiantil,
    u.fecha_registro,
    u.activo,
    
    -- Estadísticas de reservas
    COUNT(r.id) as total_reservas,
    COUNT(CASE WHEN r.estado = 'CONFIRMADA' THEN 1 END) as reservas_confirmadas,
    COUNT(CASE WHEN r.estado = 'PENDIENTE' THEN 1 END) as reservas_pendientes,
    COUNT(CASE WHEN r.estado = 'CANCELADA' THEN 1 END) as reservas_canceladas,
    COUNT(CASE WHEN r.estado = 'COMPLETADA' THEN 1 END) as reservas_completadas,
    COALESCE(SUM(r.precio_total), 0) as total_gastado,
    COALESCE(AVG(r.precio_total), 0) as promedio_por_reserva
FROM usuarios u
LEFT JOIN reservas r ON u.id = r.usuario_id
GROUP BY u.id, u.email, u.nombre, u.apellido, u.telefono, u.carnet_estudiantil, u.fecha_registro, u.activo;

-- =====================================================
-- CONSULTAS DE EJEMPLO PARA PROBAR RELACIONES
-- =====================================================

-- Consulta para ver todas las reservas de un usuario específico
-- SELECT * FROM vista_reservas_completa WHERE usuario_email = 'estudiante1@tecunify.com';

-- Consulta para ver espacios disponibles con sus tipos
-- SELECT * FROM vista_espacios_disponibles ORDER BY tipo_nombre, nombre;

-- Consulta para ver estadísticas de usuarios
-- SELECT * FROM vista_usuarios_estadisticas ORDER BY total_reservas DESC;

-- Consulta para verificar disponibilidad de un espacio
-- SELECT verificar_disponibilidad(1, CURRENT_DATE + INTERVAL '1 day', '10:00', '12:00');

-- Consulta para calcular precio de una reserva
-- SELECT calcular_precio_reserva(1, '10:00', '12:00');

-- =====================================================
-- PERMISOS Y USUARIOS
-- =====================================================

-- Crear usuario para la aplicación
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'tecunify_app') THEN
        CREATE USER tecunify_app WITH PASSWORD 'TecUnify2024!';
    END IF;
END
$$;

-- Otorgar permisos
GRANT CONNECT ON DATABASE postgres TO tecunify_app;
GRANT USAGE ON SCHEMA public TO tecunify_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO tecunify_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO tecunify_app;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO tecunify_app;

-- =====================================================
-- MENSAJE FINAL CON ESTADÍSTICAS
-- =====================================================
SELECT '🎉 BASE DE DATOS TECUNIFY CREADA EXITOSAMENTE!' as mensaje;

SELECT 
    '📊 RESUMEN DE DATOS CREADOS:' as resumen,
    (SELECT COUNT(*) FROM tipos_espacios) as tipos_espacios,
    (SELECT COUNT(*) FROM motivos_reserva) as motivos_reserva,
    (SELECT COUNT(*) FROM usuarios) as usuarios,
    (SELECT COUNT(*) FROM espacios) as espacios,
    (SELECT COUNT(*) FROM horarios_disponibilidad) as horarios_disponibilidad,
    (SELECT COUNT(*) FROM reservas) as reservas;

SELECT 
    '👥 USUARIOS CREADOS:' as usuarios_info,
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN activo = TRUE THEN 1 END) as usuarios_activos
FROM usuarios;

SELECT 
    '🏢 ESPACIOS CREADOS:' as espacios_info,
    COUNT(*) as total_espacios,
    COUNT(CASE WHEN activo = TRUE THEN 1 END) as espacios_activos,
    COUNT(DISTINCT tipo_espacio_id) as tipos_diferentes
FROM espacios;

SELECT 
    '📅 RESERVAS CREADAS:' as reservas_info,
    COUNT(*) as total_reservas,
    COUNT(CASE WHEN estado = 'CONFIRMADA' THEN 1 END) as confirmadas,
    COUNT(CASE WHEN estado = 'PENDIENTE' THEN 1 END) as pendientes,
    COUNT(CASE WHEN estado = 'CANCELADA' THEN 1 END) as canceladas
FROM reservas;

SELECT '✅ ¡SISTEMA LISTO PARA USAR!' as final;
