-- =====================================================
-- SCRIPT RÁPIDO PARA CREAR LA BASE DE DATOS
-- Ejecutar en pgAdmin4 en la base de datos 'postgres'
-- =====================================================

-- Crear la base de datos si no existe
CREATE DATABASE tecunify_db 
WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Spain.1252'
    LC_CTYPE = 'Spanish_Spain.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- Conectar a la nueva base de datos
\c tecunify_db;

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Mensaje de confirmación
SELECT 'Base de datos tecunify_db creada exitosamente!' as mensaje;
