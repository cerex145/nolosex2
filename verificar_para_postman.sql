-- =====================================================
-- SCRIPT DE VERIFICACIÓN RÁPIDA PARA POSTMAN
-- Ejecutar en pgAdmin4 ANTES de probar en Postman
-- =====================================================

-- Verificar que las tablas existen
SELECT 'VERIFICANDO TABLAS:' as verificacion;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar datos básicos
SELECT 'TIPOS DE ESPACIOS:' as verificacion;
SELECT id, nombre, activo FROM tipos_espacios ORDER BY id;

SELECT 'MOTIVOS DE RESERVA:' as verificacion;
SELECT id, nombre, activo FROM motivos_reserva ORDER BY id;

SELECT 'USUARIOS:' as verificacion;
SELECT id, email, nombre, apellido, activo FROM usuarios ORDER BY id;

SELECT 'ESPACIOS:' as verificacion;
SELECT id, nombre, tipo_espacio_id, precio_por_hora, activo FROM espacios ORDER BY id;

-- Verificar datos específicos para Postman
SELECT 'USUARIO PARA POSTMAN:' as verificacion;
SELECT id, email, nombre, apellido FROM usuarios WHERE email = 'estudiante1@tecunify.com';

SELECT 'ESPACIO PARA POSTMAN:' as verificacion;
SELECT id, nombre, tipo_espacio_id, precio_por_hora FROM espacios WHERE id = 1;

SELECT 'TIPO LABORATORIO:' as verificacion;
SELECT id, nombre FROM tipos_espacios WHERE nombre = 'Laboratorio';

-- Verificar horarios de disponibilidad
SELECT 'HORARIOS DISPONIBLES:' as verificacion;
SELECT h.id, h.espacio_id, e.nombre as espacio, h.dia_semana, h.hora_inicio, h.hora_fin 
FROM horarios_disponibilidad h
JOIN espacios e ON h.espacio_id = e.id
ORDER BY h.espacio_id, h.dia_semana;

-- Verificar reservas existentes
SELECT 'RESERVAS EXISTENTES:' as verificacion;
SELECT r.id, u.email, e.nombre as espacio, r.fecha_reserva, r.hora_inicio, r.hora_fin, r.estado
FROM reservas r
JOIN usuarios u ON r.usuario_id = u.id
JOIN espacios e ON r.espacio_id = e.id
ORDER BY r.id;

-- Resumen final
SELECT 'RESUMEN PARA POSTMAN:' as verificacion;
SELECT 
    (SELECT COUNT(*) FROM tipos_espacios) as tipos_espacios,
    (SELECT COUNT(*) FROM motivos_reserva) as motivos_reserva,
    (SELECT COUNT(*) FROM usuarios) as usuarios,
    (SELECT COUNT(*) FROM espacios) as espacios,
    (SELECT COUNT(*) FROM horarios_disponibilidad) as horarios,
    (SELECT COUNT(*) FROM reservas) as reservas;

-- Verificar que los datos de prueba estén correctos
SELECT 'VERIFICACIÓN FINAL:' as verificacion;
SELECT 
    CASE WHEN EXISTS(SELECT 1 FROM usuarios WHERE email = 'estudiante1@tecunify.com') 
         THEN '✅ Usuario estudiante1 existe' 
         ELSE '❌ Usuario estudiante1 NO existe' END as usuario_check,
    CASE WHEN EXISTS(SELECT 1 FROM espacios WHERE id = 1) 
         THEN '✅ Espacio ID 1 existe' 
         ELSE '❌ Espacio ID 1 NO existe' END as espacio_check,
    CASE WHEN EXISTS(SELECT 1 FROM tipos_espacios WHERE nombre = 'Laboratorio') 
         THEN '✅ Tipo Laboratorio existe' 
         ELSE '❌ Tipo Laboratorio NO existe' END as tipo_check;

SELECT 'LISTO PARA POSTMAN!' as resultado;
