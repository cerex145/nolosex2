-- =====================================================
-- SCRIPT DE VERIFICACIÓN RÁPIDA PARA backend_user
-- Ejecutar en pgAdmin4 para verificar que todo esté bien
-- =====================================================

-- Verificar que las tablas existen
SELECT 'TABLAS CREADAS:' as verificacion;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar datos en cada tabla
SELECT 'TIPOS DE ESPACIOS:' as verificacion;
SELECT COUNT(*) as total FROM tipos_espacios;

SELECT 'MOTIVOS DE RESERVA:' as verificacion;
SELECT COUNT(*) as total FROM motivos_reserva;

SELECT 'USUARIOS:' as verificacion;
SELECT COUNT(*) as total FROM usuarios;

SELECT 'ESPACIOS:' as verificacion;
SELECT COUNT(*) as total FROM espacios;

SELECT 'HORARIOS:' as verificacion;
SELECT COUNT(*) as total FROM horarios_disponibilidad;

SELECT 'RESERVAS:' as verificacion;
SELECT COUNT(*) as total FROM reservas;

-- Verificar algunos datos específicos
SELECT 'USUARIOS DE PRUEBA:' as verificacion;
SELECT email, nombre, apellido FROM usuarios LIMIT 5;

SELECT 'ESPACIOS DE PRUEBA:' as verificacion;
SELECT nombre, ubicacion, capacidad FROM espacios LIMIT 5;

SELECT 'RESERVAS DE PRUEBA:' as verificacion;
SELECT r.id, u.nombre, e.nombre as espacio, r.fecha_reserva, r.estado 
FROM reservas r
JOIN usuarios u ON r.usuario_id = u.id
JOIN espacios e ON r.espacio_id = e.id
LIMIT 5;

-- Verificar conexión
SELECT 'CONEXIÓN EXITOSA A backend_user!' as resultado;
