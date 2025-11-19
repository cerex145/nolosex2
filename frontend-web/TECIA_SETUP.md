# 🤖 Configuración de TecIA

## 📋 Pasos para Configurar TecIA

### 1. 🔑 Obtener Token de Hugging Face

1. Ve a [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Crea una cuenta si no tienes una
3. Haz clic en "New token"
4. Dale un nombre descriptivo (ej: "TecUnify-TecIA")
5. Selecciona el tipo de token: **Read**
6. Copia el token generado

### 2. 🔧 Configurar Variables de Entorno

#### Opción A: Variables de Entorno (Recomendado para producción)

Crea un archivo `.env.local` en la raíz del proyecto `frontend-web/`:

```env
# Token de Hugging Face
VITE_HUGGINGFACE_TOKEN=tu_token_aqui

# Modelo de IA preferido
VITE_AI_MODEL=gpt2

# Configuración adicional
VITE_USE_FALLBACK=true
```

#### Opción B: Modificar Configuración Directa

Edita el archivo `src/config/ai.js` y cambia:

```javascript
HUGGINGFACE_TOKEN: 'tu_token_aqui',
```

### 3. 🧪 Modelos Disponibles

TecIA intentará usar estos modelos en orden de preferencia:

1. **GPT-2** - Modelo básico y confiable
2. **DistilGPT-2** - Versión más ligera
3. **DialoGPT Small** - Optimizado para conversaciones

Si ningún modelo está disponible, TecIA usará simulación local inteligente.

### 4. 🚀 Verificar Configuración

1. Inicia la aplicación: `npm run dev`
2. Ve a la sección TecIA
3. Verifica que el indicador de estado muestre:
   - 🟢 **IA: [Modelo]** - Si está usando IA real
   - 🟠 **Modo: Simulación Local** - Si está usando respaldo

### 5. 🧪 Probar TecIA

Envía estos mensajes de prueba:

- "Hola" - Debería responder con saludo
- "¿Qué laboratorios tienen?" - Información de espacios
- "¿Cómo hago una reserva?" - Proceso de reservas
- "¿Cuáles son los horarios?" - Horarios de atención

## 🔒 Seguridad

### ✅ Mejores Prácticas

- **Nunca** subas tokens a repositorios públicos
- Usa variables de entorno para tokens
- Considera usar un backend proxy para mayor seguridad
- Rota tokens periódicamente

### ⚠️ Consideraciones de Seguridad

- Los tokens están expuestos en el frontend
- Para producción, considera usar un backend proxy
- Implementa rate limiting en el backend
- Monitorea el uso de tokens

## 🛠️ Solución de Problemas

### Error 401 - No autorizado
- Verifica que el token sea correcto
- Asegúrate de que el token tenga permisos de lectura

### Error 404 - Modelo no encontrado
- El modelo puede estar temporalmente no disponible
- TecIA automáticamente usará simulación local

### Error 429 - Demasiadas solicitudes
- Has alcanzado el límite de rate limiting
- Espera unos minutos antes de continuar

### TecIA no responde
- Verifica la conexión a internet
- Revisa la consola del navegador para errores
- TecIA debería usar simulación local como respaldo

## 🔄 Actualizaciones

Para actualizar la configuración:

1. Modifica `src/config/ai.js` para cambiar modelos
2. Actualiza `.env.local` para cambiar tokens
3. Reinicia la aplicación

## 📞 Soporte

Si tienes problemas:

1. Revisa la consola del navegador
2. Verifica que el token sea válido
3. Prueba con simulación local (sin token)
4. Contacta al equipo de desarrollo

---

**¡TecIA está listo para ayudarte con TecUnify!** 🤖✨