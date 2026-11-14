# Frontend BiblioUHO

Interfaz web multipágina construida con Vite. Incluye páginas HTML con módulos JavaScript y una página de catálogo React. El cliente API se configura desde una sola variable de entorno, compartida por todas las páginas.

## Requisitos

- Node.js 18 o superior.
- npm (incluido con Node.js).
- Backend BiblioUHO en ejecución para las funciones conectadas a la API.

## Instalación local

Desde la raíz del repositorio:

```powershell
cd frontend\src
npm ci
Copy-Item .env.example .env
```

En Linux/macOS, usa `cd frontend/src` y `cp .env.example .env`.

Edita `frontend/src/.env`:

```dotenv
VITE_API_URL=http://localhost:8000
```

Debe ser la URL base completa del backend, sin `/api` y sin barra final. No es un secreto: Vite incorpora esta URL al frontend.

## Ejecutar en desarrollo

Inicia primero el backend en `http://localhost:8000` y luego, desde `frontend/src`:

```bash
npm run dev
```

Vite normalmente sirve el sitio en `http://localhost:5173`. Las rutas principales incluyen `/`, `/login.html` y páginas en `/pages/`, como `/pages/catalogo.html` y `/pages/bibliotecario.html`.

Al cambiar `.env`, reinicia Vite para que cargue la nueva configuración.

## Acceso desde otras computadoras

Para que otros equipos de la red abran el frontend y contacten al backend:

1. Usa la IP o nombre DNS del equipo que ejecuta Django, por ejemplo `192.168.1.25`.
2. En `frontend/src/.env`, configura `VITE_API_URL=http://192.168.1.25:8000`.
3. En `backend/.env`, agrega el origen exacto del frontend a `CORS_ALLOWED_ORIGINS`, por ejemplo `http://192.168.1.25:5173`, y la IP del servidor a `DJANGO_ALLOWED_HOSTS`.
4. Inicia Django escuchando en la red: `python backend/manage.py runserver 0.0.0.0:8000`.
5. Inicia Vite para la red: `npm run dev -- --host 0.0.0.0`.
6. Abre `http://192.168.1.25:5173` desde otro equipo. Asegúrate de permitir los puertos en el firewall dentro de una red de confianza.

No publiques el servidor de desarrollo de Vite en Internet. Para producción, sirve el build estático con un servidor web HTTPS y despliega la API por separado.

## Build y publicación

Vite captura `VITE_API_URL` durante el build. Para producir los archivos con otra dirección de API, actualiza esa variable antes de compilar:

```bash
npm run build
```

El resultado queda en `frontend/src/dist/`. Publica el contenido de ese directorio en un hosting de archivos estáticos. Configura en Django `CORS_ALLOWED_ORIGINS` con el origen HTTPS del sitio publicado y `DJANGO_ALLOWED_HOSTS` con los dominios del backend. Si cambia la URL del backend, vuelve a generar y publicar el build.

## Scripts disponibles

```bash
npm run dev       # servidor local de desarrollo
npm run build     # build de producción
npm run preview   # vista previa local del build
npm test          # pruebas Vitest
npm run lint      # análisis ESLint
```

## Configuración

- `.env.example`: ejemplo versionado de la URL local del backend.
- `.env`: configuración local ignorada por Git.
- `VITE_API_URL`: URL base pública de la API Django. No colocar aquí claves, contraseñas ni tokens.

La configuración se inyecta tanto en scripts inline de las páginas HTML como en los módulos React para evitar URLs de API codificadas en el código fuente.

## Roadmap del frontend

Estado contrastado con el documento [Sistema Integrado de Gestión de Préstamos Bibliotecarios (BiblioUHO)_Requerimientos.pdf](../Sistema%20Integrado%20de%20Gesti%C3%B3n%20de%20Pr%C3%A9stamos%20Bibliotecarios%28BiblioUHO%29_Requerimientos.pdf) y las páginas actuales. `[x]` significa completado en el alcance descrito; `[ ] Parcial` indica que hay una pantalla o flujo implementado pero falta completar parte del requisito; `[ ] Pendiente` indica trabajo no implementado.

### E1-E2: Acceso y perfil

- [x] Catálogo público multipágina y navegación a detalle de libro (RF-01, RF-02).
- [ ] Parcial: pantalla de login integrada al endpoint institucional/local; falta experiencia OAuth2/OIDC con PKCE y mensajes/flujo de recuperación institucional (RF-03).
- [x] Panel personal para completar perfil de estudiante y consultar sus préstamos (RF-04, RF-09).
- [x] Visualización y descarga del carnet QR en PDF desde el panel (RF-04).
- [ ] Pendiente: mostrar procedencia/última sincronización de datos SIGENU o ASSET y permitir solicitar rectificación según política institucional.

### E3: Catálogo y administración

- [x] Búsqueda y filtros de catálogo por texto, categoría, biblioteca y disponibilidad (RF-01).
- [x] Ficha con autores, editorial, edición, resumen y disponibilidad de ejemplares (RF-02).
- [x] Administración de libros, ejemplares, autores, categorías, editoriales y bibliotecas (RF-10).
- [x] Descarga de plantilla Excel, carga y visualización del resultado de importación (RF-11).
- [ ] Parcial: completar interfaces CRUD para facultades, carreras, cargos, departamentos y demás nomencladores académicos/laborales (RF-12).
- [ ] Pendiente: gestión de portadas subidas al sistema y ubicación física detallada desde la interfaz, además de la URL actual (RF-02, RF-10).

### E4-E5: Préstamos y atención bibliotecaria

- [x] Solicitud del usuario desde catálogo y seguimiento de estados pendiente, listo, activo y devuelto (RF-05, RF-09).
- [x] Panel bibliotecario para aprobar/rechazar, marcar listo, definir fecha de devolución al registrar entrega y registrar devolución (RF-06, RF-08).
- [x] Préstamo presencial con búsqueda de usuario, escáner QR, selección de libro/sede y fecha pactada (RF-07).
- [x] Panel de préstamos activos y vencimientos, con aviso visual de vencidos y próximos a vencer (RF-08).
- [ ] Pendiente: experiencia para anotarse en lista de espera y consultar/cancelar la posición (RF-18).
- [ ] Pendiente: solicitar renovación y mostrar aprobación/rechazo (RF-19).
- [ ] Pendiente: mostrar sanciones, bloqueo y estado de habilitación de préstamos (RF-20).
- [ ] Parcial: bandeja de notificaciones in-app y acciones de lectura; falta correo y actualización en tiempo real (RF-08, RNF-14).

### E6: Reportes y administración global

- [x] Panel de reportes con filtros y exportaciones PDF/XLSX (RF-14).
- [x] Panel Super-Admin para crear roles, configurar permisos y asignarlos a usuarios (RF-13).
- [ ] Parcial: administración de personal por biblioteca; falta el panel unificado con indicadores del estado de las cuatro sedes (RF-17).
- [x] Consulta de auditoría desde la interfaz para perfiles autorizados (RF-16).
- [ ] Parcial: ampliar visualizaciones comparativas e indicadores agregados de estado para las cuatro bibliotecas (RF-17).

### E7-E9: Calidad y entrega

- [x] Diseño institucional UHO aplicado en páginas principales y layouts adaptados a móvil/escritorio.
- [ ] Parcial: revisar y documentar accesibilidad WCAG 2.1 AA con pruebas de teclado, contraste y lector de pantalla (RNF-05, RNF-06).
- [ ] Pendiente: pruebas automatizadas de componentes y flujos de navegador; actualmente la validación principal del frontend es el build de Vite (RNF-08).
- [ ] Pendiente: medición de rendimiento de catálogo con 200 usuarios y objetivo menor de 3 segundos (RNF-01).
- [x] Configuración de `VITE_API_URL`, build multipágina y pasos de ejecución/publicación documentados en este README.
