# Configuración Paso a Paso - Google Console

## 🚨 URGENTE: Configurar Orígenes Autorizados

El error `The given origin is not allowed for the given client ID` significa que necesitas configurar los orígenes autorizados en Google Console.

### Pasos Exactos:

1. **Ve a Google Cloud Console**
   - URL: https://console.developers.google.com/
   - Inicia sesión con tu cuenta de Google

2. **Selecciona tu proyecto**
   - Busca el proyecto que contiene tu Client ID: `492272775133-75ial1p72ju2v535tfknjpibb7tnn5ni.apps.googleusercontent.com`

3. **Ve a Credenciales**
   - En el menú lateral izquierdo, haz clic en "APIs y servicios" > "Credenciales"

4. **Edita tu Client ID**
   - Busca tu Client ID OAuth 2.0 en la lista
   - Haz clic en el ícono de edición (lápiz) a la derecha

5. **Configura Orígenes Autorizados de JavaScript**
   - En la sección "Orígenes autorizados de JavaScript", agrega estas URLs:
     ```
     http://localhost:5173
     http://localhost:3000
     http://127.0.0.1:5173
     ```

6. **Configura URIs de Redirección Autorizados**
   - En la sección "URIs de redirección autorizados", agrega estas URLs:
     ```
     http://localhost:5173
     http://localhost:3000
     http://127.0.0.1:5173
     ```

7. **Guarda los cambios**
   - Haz clic en "Guardar" al final de la página
   - **IMPORTANTE**: Los cambios pueden tardar unos minutos en aplicarse

## 🔧 Configuración del Backend (Para más adelante)

Cuando quieras conectar con tu backend real, necesitarás configurar CORS en tu aplicación Java Spring Boot:

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 🧪 Testing Actual

Con la configuración temporal que implementé:

1. **El botón de Google funcionará** una vez que configures los orígenes
2. **Capturará el token** y mostrará la información del usuario
3. **Simulará el login** sin necesidad del backend
4. **Podrás ver en la consola** toda la información que Google envía

## ⚡ Próximos Pasos

1. **Configura los orígenes en Google Console** (pasos arriba)
2. **Espera 2-3 minutos** para que los cambios se apliquen
3. **Refresca tu aplicación** en el navegador
4. **Prueba el botón de Google**
5. **Revisa la consola** para ver la información del usuario

## 🐛 Si sigues teniendo problemas

1. **Verifica que estés en el proyecto correcto** en Google Console
2. **Asegúrate de que el Client ID sea exactamente**: `492272775133-75ial1p72ju2v535tfknjpibb7tnn5ni.apps.googleusercontent.com`
3. **Espera unos minutos** después de guardar los cambios
4. **Limpia la caché del navegador** (Ctrl+F5)
5. **Verifica que tu aplicación esté corriendo en** `http://localhost:5173`

¿Necesitas ayuda con algún paso específico?
