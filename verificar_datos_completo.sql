-- =====================================================
-- SCRIPT DE VERIFICACIÓN RÁPIDA PARA backend_user
-- Ejecutar en pgAdmin4 para verificar que los datos estén correctos
-- =====================================================

-- Verificar que las tablas existen
SELECT 'VERIFICANDO TABLAS:' as verificacion;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar datos en cada tabla
SELECT 'TIPOS DE ESPACIOS:' as verificacion;
SELECT id, nombre, activo FROM tipos_espacios ORDER BY id;

SELECT 'MOTIVOS DE RESERVA:' as verificacion;
SELECT id, nombre, activo FROM motivos_reserva ORDER BY id;

SELECT 'USUARIOS:' as verificacion;
SELECT id, email, nombre, apellido, activo FROM usuarios ORDER BY id;

SELECT 'ESPACIOS:' as verificacion;
SELECT id, nombre, tipo_espacio_id, activo FROM espacios ORDER BY id;

SELECT 'HORARIOS:' as verificacion;
SELECT id, espacio_id, dia_semana, hora_inicio, hora_fin FROM horarios_disponibilidad ORDER BY id;

SELECT 'RESERVAS:' as verificacion;
SELECT id, usuario_id, espacio_id, fecha_reserva, estado FROM reservas ORDER BY id;

-- Verificar datos específicos que usa el frontend
SELECT 'USUARIO ESTUDIANTE1:' as verificacion;
SELECT id, email, nombre, apellido FROM usuarios WHERE email = 'estudiante1@tecunify.com';

SELECT 'ESPACIO LABORATORIO A:' as verificacion;
SELECT id, nombre, tipo_espacio_id, precio_por_hora FROM espacios WHERE id = 1;

SELECT 'TIPO LABORATORIO:' as verificacion;
SELECT id, nombre FROM tipos_espacios WHERE nombre = 'Laboratorio';

-- Verificar relaciones
SELECT 'RELACIONES ESPACIOS-TIPOS:' as verificacion;
SELECT e.id, e.nombre, te.nombre as tipo_nombre 
FROM espacios e 
JOIN tipos_espacios te ON e.tipo_espacio_id = te.id 
ORDER BY e.id;

-- Verificar que no hay datos duplicados
SELECT 'VERIFICANDO DUPLICADOS:' as verificacion;
SELECT 'Usuarios duplicados:', COUNT(*) FROM usuarios GROUP BY email HAVING COUNT(*) > 1;
SELECT 'Espacios duplicados:', COUNT(*) FROM espacios GROUP BY nombre HAVING COUNT(*) > 1;

-- Verificar constraints
SELECT 'VERIFICANDO CONSTRAINTS:' as verificacion;
SELECT 'Usuarios con email válido:', COUNT(*) FROM usuarios WHERE email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
SELECT 'Espacios con capacidad válida:', COUNT(*) FROM espacios WHERE capacidad > 0;
SELECT 'Reservas con fechas válidas:', COUNT(*) FROM reservas WHERE fecha_reserva >= CURRENT_DATE;

-- Resumen final
SELECT 'RESUMEN FINAL:' as verificacion;
SELECT 
    (SELECT COUNT(*) FROM tipos_espacios) as tipos_espacios,
    (SELECT COUNT(*) FROM motivos_reserva) as motivos_reserva,
    (SELECT COUNT(*) FROM usuarios) as usuarios,
    (SELECT COUNT(*) FROM espacios) as espacios,
    (SELECT COUNT(*) FROM horarios_disponibilidad) as horarios,
    (SELECT COUNT(*) FROM reservas) as reservas;

SELECT 'VERIFICACIÓN COMPLETADA!' as resultado;
