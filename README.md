# Alquilarte - Backend

Proyecto grupal de desarrollo backend con Node.js, Express y vistas Pug.

Actualmente desplegado en:  
🔗 [https://alquilarte-backend-tp2.onrender.com](https://alquilarte-backend-tp2.onrender.com)

## Estructura del proyecto

- `modules/`
  - `tareas/`: CRUD de tareas, controlador, modelo y rutas (Sabri)
  - `empleados/`: CRUD de empleados, controlador, modelo y rutas. Incluye asignación de sector y rol (Fede)
  - `filtros/`: Funcionalidad de filtros por estado, prioridad, fecha y área funcional (Ale)
  - `middlewares/`: Middlewares personalizados para validación y control de flujo (Joaquín)
  - `login/`: Validación de usuario y contraseña desde archivo `empleados.json` con vista y lógica asociada
  - `clientes/` y `propiedades/`: CRUD básico para gestión de clientes y propiedades
- `data/`: Archivos JSON persistentes (`empleados.json`, `tareas.json`, `sectores_roles.json`, etc.) (Damian)
- `views/`: Vistas Pug centralizadas
- `public/`: Archivos estáticos como CSS y JS
- `app.js`: Configuración principal de middlewares, vistas y rutas
- `server.js`: Punto de entrada para levantar el servidor

## Comandos

```bash
npm install
npm start