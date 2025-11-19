# Configuración de Google OAuth para TecUnify

## Pasos para configurar el inicio de sesión con Google

### 1. Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.developers.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Nombra tu proyecto (ej: "TecUnify")

### 2. Habilitar las APIs necesarias

1. En el menú lateral, ve a "APIs y servicios" > "Biblioteca"
2. Busca y habilita las siguientes APIs:
   - Google+ API
   - Google Identity API

### 3. Configurar la pantalla de consentimiento OAuth

1. Ve a "APIs y servicios" > "Pantalla de consentimiento OAuth"
2. Selecciona "Externo" (a menos que tengas una cuenta de Google Workspace)
3. Completa la información requerida:
   - Nombre de la aplicación: TecUnify
   - Email de soporte: tu-email@tecsup.edu.pe
   - Dominio autorizado: tecsup.edu.pe (opcional)

### 4. Crear credenciales OAuth 2.0

1. Ve a "APIs y servicios" > "Credenciales"
2. Haz clic en "Crear credenciales" > "ID de cliente OAuth 2.0"
3. Selecciona "Aplicación web"
4. Configura los orígenes autorizados:
   - `http://localhost:5173` (para desarrollo)
   - `https://tu-dominio.com` (para producción)
5. Configura las URIs de redirección autorizadas:
   - `http://localhost:5173` (para desarrollo)
   - `https://tu-dominio.com` (para producción)

### 5. Configurar el Client ID en la aplicación

1. Copia el Client ID generado
2. Abre el archivo `src/config/google.js`
3. Reemplaza `'TU_CLIENT_ID_AQUI'` con tu Client ID real

```javascript
export const GOOGLE_CLIENT_ID = 'tu-client-id-real-aqui.apps.googleusercontent.com';
```

### 6. Configurar el backend (si es necesario)

Si tu backend necesita validar el token de Google, asegúrate de que el endpoint `/api/auth/google` esté configurado para:

1. Recibir el token JWT de Google
2. Validar el token con Google
3. Extraer la información del usuario
4. Crear o actualizar el usuario en tu base de datos
5. Devolver un token JWT propio para tu aplicación

### 7. Probar la funcionalidad

1. Inicia tu aplicación con `npm run dev`
2. Ve a la página de login
3. Haz clic en "Iniciar sesión con Google"
4. Completa el proceso de autenticación
5. Verifica que el usuario se loguee correctamente

## Solución de problemas

### Error: "Invalid client"
- Verifica que el Client ID sea correcto
- Asegúrate de que los orígenes autorizados incluyan tu dominio

### Error: "Redirect URI mismatch"
- Verifica que las URIs de redirección en Google Console coincidan con tu dominio

### Error: "Access blocked"
- La pantalla de consentimiento puede estar en modo de prueba
- Agrega tu email como usuario de prueba o publica la aplicación

## Notas importantes

- El Client ID es público y puede estar en el código frontend
- Nunca expongas el Client Secret en el frontend
- Para producción, usa HTTPS
- Considera implementar rate limiting en el backend
