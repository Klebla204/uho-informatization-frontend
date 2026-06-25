# Frontend — Sistema de Gestion de Préstamos Bibliotecarios (BiblioUHO)

Este documento describe la arquitectura, alcance y pasos prácticos para el frontend del proyecto de informatización de la gestión de préstamos bibliotecarios en la Universidad de Holguín (UHO).

## Visión general
El frontend es una aplicación SPA (Single Page Application) construida con React y Vite, estilizada con TailwindCSS. Está organizada en módulos que corresponden a las apps del backend (students, academics, hr, etc.).

Objetivos principales:
- Proveer interfaces accesibles y responsivas para usuarios institucionales.
- Consumir APIs del backend de manera segura (JWT).
- Mantener un diseño modular para facilitar despliegue por módulos.

## Alcance
Incluye:
- Interfaces principales para estudiantes, docentes, personal administrativo y mantenimiento.
- Componentes reutilizables (formularios, tablas, autenticación, notificaciones).
- Integración con endpoints de backend para datos y almacenamiento (MinIO).

## Estructura del proyecto
- `src/` — código fuente principal
	- `pages/` — páginas principales por módulo
	- `services/` — clientes API (axios) y lógica de integración
	- `components/` — componentes reutilizables

## Autenticación y Autorización
- Uso de JWT (token almacenado de forma segura — preferentemente httpOnly cookies o almacenamiento seguro).
- El frontend respeta el modelo RBAC del backend; sólo muestra acciones según permisos del usuario.

## Desarrollo local
Requisitos: Node.js 18+ y npm.

1) Instalar dependencias:
```powershell
cd frontend\src
npm ci
```

2) Ejecutar servidor de desarrollo:
```powershell
npm run dev
```

3) Build de producción:
```powershell
npm run build
```

4) Tests (si están definidos):
```powershell
npm test
```

## CI / CD
- El workflow de GitHub Actions `.github/workflows/ci.yml` instala dependencias y ejecuta build/tests del frontend en `frontend/src`.

## Buenas prácticas
- Usar ramas `feature/*` y abrir PRs a `develop`.
- Mantener `package-lock.json` para builds reproducibles.
- Añadir ESLint/Prettier para calidad de código; ya hay scripts `lint` y `format` en `package.json`.

## Design tokens y estilos
- TailwindCSS está configurado; modifica `tailwind.config.js` para añadir variables y temas compartidos.

## Roadmap

A continuación hay un mapa de ruta (roadmap) con la lista de verificación de los módulos lógicos pendientes y las tareas de frontend que estructurarán el trabajo. Marca cada ítem cuando esté implementado (componentes, rutas, integración con APIs, tests y documentación).


## 🚀 Fase 1: Fundamentos y Acceso Público
- [ ] **[Landing Page](ca://s?q=Implementar_Landing_Page)** – catálogo público navegable por categorías, autores y bibliotecas  
- [ ] **[Buscador en tiempo real](ca://s?q=Desarrollar_Buscador_en_tiempo_real)** – resultados instantáneos con portada, título y disponibilidad  
- [ ] **[Detalle de libro](ca://s?q=Construir_Detalle_de_Libro)** – ficha completa con portada, autor, ISBN y botón de “Solicitar préstamo”  
- [ ] **[Diseño responsivo](ca://s?q=Aplicar_Diseño_Responsivo)** – adaptación a móvil, tablet y escritorio siguiendo identidad visual UHO  


## 🔑 Fase 2: Autenticación y Perfil de Usuario
- [ ] **[Integración con auth.uho.edu.cu](ca://s?q=Integrar_auth_uho_edu_cu)** – login institucional vía OAuth2/LDAP  
- [ ] **[Panel de usuario](ca://s?q=Construir_Panel_de_Usuario)** – historial de préstamos, solicitudes pendientes y carnet QR descargable  
- [ ] **[Carnet digital QR](ca://s?q=Generar_Carnet_Digital_QR)** – generación automática en PDF con datos del perfil  


## 📚 Fase 3: Flujo de Préstamos
- [ ] **[Solicitud en línea](ca://s?q=Implementar_Solicitud_en_Línea)** – verificación de disponibilidad y estado “Pendiente”  
- [ ] **[Lista de espera](ca://s?q=Desarrollar_Lista_de_Espera)** – opción de anotarse cuando no hay ejemplares disponibles  
- [ ] **[Notificaciones](ca://s?q=Configurar_Notificaciones_Automáticas)** – recordatorios de vencimiento y alertas de disponibilidad  
- [ ] **[Renovación de préstamo](ca://s?q=Implementar_Renovación_de_Préstamo)** – solicitud desde el panel del usuario  


## 🛠️ Fase 4: Panel del Bibliotecario y Administración
- [ ] **[Gestión de préstamos](ca://s?q=Construir_Gestión_de_Préstamos)** – aceptar/rechazar solicitudes, registrar devoluciones y renovaciones  
- [ ] **[Gestión del catálogo](ca://s?q=Implementar_Gestión_del_Catálogo)** – CRUD de títulos, ejemplares y portadas  
- [ ] **[Importación Excel](ca://s?q=Desarrollar_Importación_Excel)** – carga masiva de colecciones con validación de datos  
- [ ] **[Reportes y estadísticas](ca://s?q=Generar_Reportes_y_Estadísticas)** – exportables a PDF y Excel  


## 🌐 Fase 5: Interoperabilidad y API
- [ ] **[API REST](ca://s?q=Construir_API_REST)** – consulta de catálogo, disponibilidad y estado de préstamos  
- [ ] **[Integración con SIGENU/ASSET](ca://s?q=Integrar_SIGENU_y_ASSET)** – sincronización de datos académicos y laborales  
- [ ] **[Panel multibiblioteca](ca://s?q=Implementar_Panel_Multibiblioteca)** – vista consolidada para el super-admin  


## 🎨 Fase 6: Optimización y Experiencia de Usuario
- [ ] **[Accesibilidad WCAG 2.1](ca://s?q=Aplicar_WCAG_2.1)** – cumplimiento nivel AA  
- [ ] **[Performance](ca://s?q=Optimizar_Performance)** – carga de catálogo < 3 segundos con 200 usuarios concurrentes  
- [ ] **[Usabilidad](ca://s?q=Mejorar_Usabilidad)** – flujo de préstamo en máximo 5 pasos  
- [ ] **[Identidad visual UHO](ca://s?q=Aplicar_Identidad_Visual_UHO)** – colores, tipografía y logotipo institucional


Notas:
- Cada ítem debe incluir: componentes reutilizables, rutas protegidas por permisos, tests y documentación de uso.
- Prioridad inicial alineada con backend: `users`, `students`, `academics`.
- Se recomienda vincular tareas de frontend a los milestones del backend para entregas coordinadas.

Este README debe servir como documento de arquitectura y alcance del frontend; mantenlo actualizado para reflejar cambios en la integración con el backend.
