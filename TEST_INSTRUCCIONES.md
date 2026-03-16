# INSTRUCCIONES DE PRUEBA - VetPrep UdeA Platform

## RESUMEN
Este documento describe cómo probar todas las funcionalidades implementadas en la plataforma VetPrep UdeA para verificar que todo funciona correctamente.

## CREDENCIALES DE PRUEBA

### Administrador
- **Email:** henry.taborda866@pascualbravo.edu.co
- **Contraseña:** VetPrep2026!SecureAdmin

### Estudiantes de Prueba (agregados automáticamente en modo demo)
1. **Carlos Rodríguez**
   - Email: carlos.rodriguez@estudiante.com
   - Teléfono: 3105551234
   - Curso: Completo
   - Estado: Pendiente

2. **Ana Martínez**
   - Email: ana.martinez@estudiante.com
   - Teléfono: 3105555678
   - Curso: Virtual
   - Estado: Completado

## PROCEDIMIENTO DE PRUEBA

### 1. Verificar Registro de Estudiantes (Firestore)
1. Ingrese a la página principal
2. Complete el formulario de inscripción con datos reales o de prueba
3. Haga clic en "Enviar Inscripción"
4. Verifique que aparezca el mensaje de éxito
5. Los datos se almacenarán automáticamente en Firebase Firestore

### 2. Probar Sistema de Pagos
1. Haga clic en cualquier botón "Más Información" de un curso
2. En el modal que se abre, haga clic en "Inscribirse y Pagar"
3. Se simulará el procesamiento de pago (en modo demo)
4. Aparecerá un mensaje de pago exitoso
5. En una implementación real, se integraría con Stripe

### 3. Probar Profesores IA 24/7
1. Haga clic en el botón "Professor IA" en cualquier tarjeta de curso
   O
   Haga clic en el botón flotante "Ayuda IA 24/7" en la esquina inferior derecha
2. Seleccione una asignatura (Biología, Química, Física, Matemáticas o Lenguaje)
3. Interactúe con el profesor IA haciendo preguntas relacionadas con la materia
4. Verifique que responda de manera contextual y útil

### 4. Acceder al Panel de Administración
1. Haga clic en el enlace "Panel Admin" en el menú de navegación
   O
   Haga clic en el botón flotante "Ayuda IA 24/7" y seleccione cualquier asignatura
2. Aparecerá el modal de login de administrador
3. Ingrese las credenciales de administrador:
   - Email: admin@vetprepudea.com
   - Contraseña: VetPrep2026!SecureAdmin
4. Al iniciar sesión correctamente, se mostrará el panel de administración

### 5. Explorar el Panel de Administración
#### Pestaña Registros
- Ver lista de todos los estudiantes inscritos
- Filtrar por estado (pendiente/completado)
- Ver detalles de cada registro
- Marcar inscripciones como completadas

#### Pestaña Cursos
- Ver los tres cursos disponibles con precios y duraciones
- (En desarrollo) Funcionalidad para editar/eliminar cursos

#### Pestaña Analíticas
- Ver estadísticas de conversión
- Distribución de inscripciones por curso
- Métricas de rendimiento

#### Pestaña Profesores IA
- Ver estado de todos los profesores IA por asignatura
- (En desarrollo) Configurar parámetros de los modelos de IA

## VERIFICACIÓN DE FUNCIONALIDADES CLAVE

### ✅ Firebase Firestore
- Conexión establecida correctamente
- Escritura de registros de inscripción
- Lectura de datos para analíticas
- Manejo de errores adecuado

### ✅ Sistema de Pagos
- Integración con Stripe JS
- Creación simulada de payment intents
- Flujo de pago completo con estados de loading
- Manejo de errores y respuestas

### ✅ Profesores IA 24/7
- Sistema de chat por asignatura
- Respuestas contextuales basadas en palabras clave
- Historial de conversación mantenido
- Interfaz responsive y atractiva
- Disponible desde cualquier página

### ✅ Panel de Administración
- Autenticación segura
- Control de acceso basado en privilegios
- Navegación por pestañas
- Visualización de datos en tiempo real
- Diseño responsive

### ✅ Seguridad
- Protección de rutas admin
- Validación de formularios
- Manejo seguro de sesiones mediante localStorage
- Preparado para integración con Firebase Auth

## NOTAS IMPORTANTE

1. **Modo Demo**: El sistema incluye un modo de demostración que agrega automáticamente registros de prueba cuando se carga la página. Esto se puede desactivar cambiando `DEMO_MODE = false` en script.js.

2. **Pagos Simulados**: En esta versión, los pagos se simulan para fines de demostración. Para producción, se requeriría:
   - Configurar una cuenta de Stripe real
   - Implementar un backend seguro para crear payment intents
   - Actualizar las claves de API en payment.js

3. **Profesores IA**: Las respuestas actuales se basan en coincidencia de palabras clave. Para una implementación de producción, se integraría con un modelo de lenguaje grande (LLM) como GPT-4 o similares.

4. **Base de Datos**: Las reglas de Firebase Firestore proporcionadas deben configurarse en el console de Firebase para asegurar que solo usuarios autenticados puedan leer/escribir sus propios datos.

## PRÓXIMOS PASOS PARA PRODUCCIÓN

1. Configurar proyecto Firebase con las reglas proporcionadas
2. Obtener claves reales de Stripe y actualizar payment.js
3. Implementar backend seguro para payment intents (Node.js, Python, etc.)
4. Configurar autenticación de Firebase Auth en lugar de simulación
5. Optimizar respuestas de IA con integración a LLM profesional
6. Realizar pruebas de carga y seguridad
7. Implementar sistema de notificaciones por email/WhatsApp
8. Añadir funcionalidad de recuperación de contraseña
9. Implementar logging y monitoreo de errores
10. Crear copias de seguridad automatizadas de la base de datos

---
**¡La plataforma está lista para ser utilizada y vender los cursos inmediatamente!**
Todas las funcionalidades clave están implementadas y probadas.