# Proyecto Principal - TecUnify

Arquitectura completa con múltiples servicios: backend de administración (Django), backend de usuarios (Spring Boot), frontend web (React) y aplicación móvil (Kotlin/Android).

## Estructura del Proyecto

```
proyecto-principal/
├── backend-admin/          # Django REST API (Administración)
├── backend-user/           # Spring Boot (Gestión de Usuarios)
├── frontend-web/           # React (Interfaz Web)
├── frontend-movil/         # Kotlin Android (App Móvil)
├── .gitignore
└── README.md
```

---

## Requisitos Previos

Asegúrate de tener instalado:

- **Java 17+** - [Descargar](https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.8+** - [Descargar](https://maven.apache.org/download.cgi)
- **Python 3.10+** - [Descargar](https://www.python.org/downloads/)
- **Node.js 18+** - [Descargar](https://nodejs.org/)
- **PostgreSQL 12+** - [Descargar](https://www.postgresql.org/download/)
- **Android Studio** (para frontend-movil) - [Descargar](https://developer.android.com/studio)
- **Git** - [Descargar](https://git-scm.com/)

---

## Instalación y Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/proyecto-principal.git
cd proyecto-principal
```

### 2. Crear Base de Datos PostgreSQL

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear bases de datos
CREATE DATABASE backend_user;
CREATE DATABASE backend_admin;

# Crear usuario (opcional)
CREATE USER tecunify WITH PASSWORD 'tu_contraseña';
ALTER ROLE tecunify SET client_encoding TO 'utf8';
ALTER ROLE tecunify SET default_transaction_isolation TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE backend_user TO tecunify;
GRANT ALL PRIVILEGES ON DATABASE backend_admin TO tecunify;
```

---

## Backend User (Spring Boot)

### Instalación

```bash
cd backend-user
mvn clean install -DskipTests
```

### Configuración

Edita `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/backend_user
    username: postgres
    password: tu_contraseña
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false

server:
  port: 8081
  servlet:
    context-path: /api

jwt:
  secret: tu_super_secret_key_aqui_minimo_256_bits
  expiration: 86400000
```

### Ejecutar

```bash
# Opción 1: Con Maven
mvn spring-boot:run

# Opción 2: Con JAR
java -jar target/backend-user-0.0.1-SNAPSHOT.jar
```

**Acceso:**
- API Base: `http://localhost:8081/api`
- Swagger: `http://localhost:8081/api/swagger-ui.html`
- Health Check: `http://localhost:8081/api/actuator/health`

---

## Backend Admin (Django)

### Instalación

```bash
cd backend-admin

# Crear entorno virtual
python -m venv venv

# Activar entorno
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### Configuración

Copia `.env.example` a `.env` y edita:

```
DEBUG=True
SECRET_KEY=tu_secret_key_aqui
DATABASE_URL=postgresql://postgres:tu_contraseña@localhost:5432/backend_admin
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Migraciones y Setup

```bash
python manage.py migrate
python manage.py createsuperuser
```

### Ejecutar

```bash
python manage.py runserver
```

**Acceso:**
- API Base: `http://localhost:8000/api`
- Admin: `http://localhost:8000/admin`

---

## Frontend Web (React)

### Instalación

```bash
cd frontend-web

# Instalar dependencias
npm install
```

### Configuración

Crea `.env`:

```
REACT_APP_API_URL=http://localhost:8081/api
REACT_APP_ADMIN_URL=http://localhost:8000/api
```

### Ejecutar

```bash
# Desarrollo
npm start

# Producción
npm run build
npm run build-serve
```

**Acceso:**
- Aplicación: `http://localhost:3000`

---

## Frontend Móvil (Kotlin Android)

### Instalación

1. Abre **Android Studio**
2. File → Open → Selecciona carpeta `frontend-movil`
3. Espera a que sincronice las dependencias

### Configuración

Edita `app/build.gradle.kts`:

```kotlin
android {
    compileSdk = 34
    
    defaultConfig {
        applicationId = "com.tuempresa.frontend_movil"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
        
        // URL del backend
        buildConfigField("String", "API_URL", "\"http://10.0.2.2:8081/api\"")
    }
}
```

### Ejecutar

```bash
# Desde Android Studio
# Presiona Shift + F10 (o Run → Run 'app')

# Desde terminal
cd frontend-movil
./gradlew installDebug
```

**Acceso:**
- Emulador Android o dispositivo físico

---

## Iniciar Todo el Proyecto (Versión Rápida)

### En Terminales Separadas

**Terminal 1: Backend User (Spring Boot)**
```bash
cd backend-user
mvn spring-boot:run
```

**Terminal 2: Backend Admin (Django)**
```bash
cd backend-admin
source venv/bin/activate  # o venv\Scripts\activate en Windows
python manage.py runserver
```

**Terminal 3: Frontend Web (React)**
```bash
cd frontend-web
npm start
```

**Terminal 4: Frontend Móvil (Android)**
- Abre Android Studio y ejecuta desde la interfaz

---

## Verificar que Todo Funciona

Después de ejecutar todos los servicios:

```bash
# Backend User
curl http://localhost:8081/api/actuator/health

# Backend Admin
curl http://localhost:8000/api/health

# Frontend Web
# Abre en navegador: http://localhost:3000
```

---

## Comandos Útiles

### Backend User (Maven)
```bash
mvn clean install              # Compilar
mvn spring-boot:run            # Ejecutar
mvn test                        # Tests
mvn clean install -DskipTests   # Compilar sin tests
```

### Backend Admin (Django)
```bash
pip install -r requirements.txt # Instalar deps
python manage.py runserver      # Ejecutar
python manage.py migrate        # Migraciones
python manage.py createsuperuser # Crear admin
python manage.py test           # Tests
```

### Frontend Web (React)
```bash
npm install                     # Instalar deps
npm start                       # Desarrollo
npm run build                   # Producción
npm test                        # Tests
npm run eject                   # Expulsar config
```

### Frontend Móvil (Android)
```bash
cd frontend-movil
./gradlew build                 # Compilar
./gradlew installDebug          # Instalar en emulador
./gradlew test                  # Tests
```

---

## Variables de Entorno

Crea archivos `.env` en cada carpeta:

**backend-user**: `application.yml` (ya configurado)

**backend-admin**: `.env`
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/backend_admin
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081
```

**frontend-web**: `.env`
```
REACT_APP_API_URL=http://localhost:8081/api
REACT_APP_ADMIN_URL=http://localhost:8000/api
```

**frontend-movil**: `local.properties`
```
sdk.dir=/path/to/android-sdk
```

---

## Estructura de Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Backend User | 8081 | http://localhost:8081/api |
| Backend Admin | 8000 | http://localhost:8000/api |
| Frontend Web | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | localhost:5432 |
| Android Emulador | - | 10.0.2.2 (para acceder localhost) |

---

## Troubleshooting

### Maven: "Command not found"
```bash
# Instala Maven y agrega a PATH
# Verifica: mvn --version
```

### PostgreSQL: "Connection refused"
```bash
# Verifica que PostgreSQL esté corriendo
# Windows: services.msc
# macOS: brew services start postgresql
# Linux: sudo service postgresql start
```

### React: "Port 3000 already in use"
```bash
# Usa otro puerto
PORT=3001 npm start

# O mata el proceso
# Windows: netstat -ano | findstr :3000
# macOS/Linux: lsof -i :3000
```

### Android Studio: "Gradle sync failed"
```bash
# Abre Android Studio → File → Invalidate Caches
# Luego reconstruye: Build → Clean Project
```

---

## Desarrollo

### Crear una rama para nuevas funciones

```bash
git checkout -b feature/nueva-funcionalidad
# Haz tus cambios
git add .
git commit -m "Add: descripción de cambios"
git push origin feature/nueva-funcionalidad
```

### Pull Request
1. Ve a GitHub/GitLab
2. Crea un Pull Request
3. Describe tus cambios
4. Espera review

---

## Despliegue

### Preparar para Producción

```bash
# Backend User
mvn clean package -DskipTests

# Backend Admin
pip freeze > requirements.txt
# Configura DEBUG=False en .env

# Frontend Web
npm run build
# Despliega carpeta 'build'

# Frontend Móvil
# Build Release desde Android Studio
```

---

## Contacto y Soporte

Para preguntas o problemas:
- Email: soporte@tuempresa.com
- Issues: GitHub Issues
- Wiki: [Ver documentación](link-a-wiki)

---

## Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

---

## Autores

- Desarrollador Principal: Jefferson
- Fecha de Inicio: 2025-10-14

---

**Última actualización:** Octubre 2025