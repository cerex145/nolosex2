# =====================================================
# CONFIGURACIÓN DEL BACKEND TECUNIFY
# =====================================================

# 1. INSTALAR DEPENDENCIAS NECESARIAS
# Asegúrate de tener instalado:
# - Java 17 o superior
# - Maven 3.6 o superior
# - PostgreSQL 13 o superior

# 2. CONFIGURAR BASE DE DATOS
# Ejecutar el script database_setup.sql en PostgreSQL:
# psql -U postgres -f database_setup.sql

# 3. VERIFICAR CONFIGURACIÓN
# El archivo application.yml ya está configurado correctamente

# 4. COMPILAR Y EJECUTAR
# Desde la carpeta backend-user:
# mvn clean compile
# mvn spring-boot:run

# 5. VERIFICAR QUE EL BACKEND ESTÉ FUNCIONANDO
# El backend estará disponible en: http://localhost:8081
# Puedes probar los endpoints:
# - GET http://localhost:8081/api/espacios
# - GET http://localhost:8081/api/tipos-espacios
# - GET http://localhost:8081/api/motivos-reserva
# - POST http://localhost:8081/api/reservas

# 6. LOGS DEL BACKEND
# Los logs se mostrarán en la consola donde ejecutes mvn spring-boot:run
# También puedes ver logs en: backend-user/logs/

# =====================================================
# ENDPOINTS DISPONIBLES
# =====================================================

# AUTENTICACIÓN
# POST /api/auth/register - Registrar usuario
# POST /api/auth/login - Iniciar sesión
# POST /api/auth/google - Login con Google
# GET /api/auth/validate - Validar token

# ESPACIOS
# GET /api/espacios - Obtener todos los espacios
# GET /api/espacios/{id} - Obtener espacio por ID
# GET /api/espacios/tipo/{tipo} - Obtener espacios por tipo
# GET /api/espacios/search?nombre=... - Buscar espacios
# GET /api/espacios/{id}/horarios-disponibles?fecha=... - Horarios disponibles
# POST /api/espacios - Crear espacio (admin)
# PUT /api/espacios/{id} - Actualizar espacio (admin)

# RESERVAS
# GET /api/reservas/mis-reservas - Mis reservas (con token)
# GET /api/reservas/{id} - Obtener reserva por ID
# GET /api/reservas/espacio/{espacioId} - Reservas de un espacio
# POST /api/reservas - Crear reserva (con token)
# POST /api/reservas/verificar-disponibilidad - Verificar disponibilidad
# PUT /api/reservas/{id}/cancelar - Cancelar reserva
# PUT /api/reservas/{id} - Actualizar reserva

# TIPOS DE ESPACIOS
# GET /api/tipos-espacios - Obtener todos los tipos
# GET /api/tipos-espacios/{id} - Obtener tipo por ID

# MOTIVOS DE RESERVA
# GET /api/motivos-reserva - Obtener todos los motivos
# GET /api/motivos-reserva/{id} - Obtener motivo por ID

# =====================================================
# DATOS DE PRUEBA INCLUIDOS
# =====================================================

# USUARIOS:
# - admin@tecunify.com (Administrador)
# - estudiante1@tecunify.com (Juan Pérez)
# - estudiante2@tecunify.com (María González)
# - estudiante3@tecunify.com (Carlos López)
# - profesor1@tecunify.com (Ana Martínez)

# ESPACIOS (20 espacios):
# - 4 Laboratorios de Computación
# - 4 Canchas Deportivas
# - 3 Salas de Estudio
# - 3 Auditorios
# - 3 Aulas
# - 3 Talleres

# RESERVAS DE EJEMPLO (5 reservas):
# - Reservas confirmadas y pendientes
# - Diferentes tipos de espacios
# - Diferentes usuarios

# =====================================================
# SOLUCIÓN DE PROBLEMAS
# =====================================================

# Si hay errores de conexión a la base de datos:
# 1. Verificar que PostgreSQL esté ejecutándose
# 2. Verificar credenciales en application.yml
# 3. Verificar que la base de datos tecunify_db exista

# Si hay errores de compilación:
# 1. Verificar que Java 17 esté instalado
# 2. Ejecutar: mvn clean compile
# 3. Verificar que todas las dependencias estén en pom.xml

# Si hay errores de CORS:
# 1. Verificar configuración CORS en application.yml
# 2. Verificar que el frontend esté en http://localhost:5173

# =====================================================
# PRÓXIMOS PASOS
# =====================================================

# 1. Ejecutar el script de base de datos
# 2. Iniciar el backend con: mvn spring-boot:run
# 3. Verificar que los endpoints respondan correctamente
# 4. Iniciar el frontend y probar la funcionalidad
# 5. Crear más datos de prueba si es necesario
