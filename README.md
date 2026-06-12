# Frontend — Sistema de Informatización (UHO)

Este documento describe la arquitectura, alcance y pasos prácticos para el frontend del proyecto de informatización de la Universidad de Holguín (UHO).

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

- [ ] auth — Flujos de login/logout, gestión de tokens, protección de rutas
- [ ] users — Interfaces de perfil, administración de usuarios y roles
- [ ] students — Páginas de matrícula, historial académico y gestión de expedientes
- [ ] academics — Páginas para cursos, horarios, asignación de profesores
- [ ] hr — Interfaces para personal, control de asistencia y nóminas
- [ ] maintenance — Panel de incidencias y formularios para solicitudes
- [ ] research — Módulo para registro de proyectos y publicaciones
- [ ] analytics — Dashboards, visualizaciones y endpoints de agregación
- [ ] storage — Integración con MinIO para subida/descarga, previews y políticas
- [ ] ci-cd — Tests de integración y pipelines para build/deploy
- [ ] accessibility — Auditoría y corrección de accesibilidad (WCAG básico)

Notas:
- Cada ítem debe incluir: componentes reutilizables, rutas protegidas por permisos, tests y documentación de uso.
- Prioridad inicial alineada con backend: `users`, `students`, `academics`.
- Se recomienda vincular tareas de frontend a los milestones del backend para entregas coordinadas.

---
Este README debe servir como documento de arquitectura y alcance del frontend; mantenlo actualizado para reflejar cambios en la integración con el backend.
