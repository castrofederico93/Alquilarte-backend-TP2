# Alquilarte - Backend

Proyecto grupal de desarrollo backend con Node.js, Express y vistas Pug.

## Estructura del proyecto

- `modules/`
  - `tareas/`: CRUD de tareas, controlador, modelo y rutas (Sabri)
  - `empleados/`: CRUD de empleados, controlador, modelo y rutas. Incluye asignación de sector y rol (Fede)
  - `filtros/`: Funcionalidad de filtros por estado, prioridad, fecha y área funcional (Ale)
  - `middlewares/`: Middlewares personalizados para validación y control de flujo (Joaquín)
  - `login/`: Validación de usuario y contraseña desde archivo `empleados.json` con vista y lógica asociada
- `data/`: Archivos JSON persistentes (`empleados.json`, `tareas.json`, `sectores_roles.json`, etc.) (Damian)
- `views/`: Vistas Pug centralizadas
- `public/`: Archivos estáticos como CSS
- `app.js`: Configuración principal del servidor

## Comandos

```bash
npm install
npm start
```

El servidor correrá por defecto en `http://localhost:3000/`

## Vistas disponibles

- `/login-vista`: Vista inicial de inicio de sesión. Valida usuario y contraseña contra `empleados.json`.
- `/empleados-vista`: Vista interactiva con tabla, alta, edición y baja de empleados usando `fetch`. Permite asignar sector (Ventas, Administración, Contabilidad, Mantenimiento) y rol, con datos cargados dinámicamente desde archivo JSON externo.
- `/tareas/vista`: Vista de tareas renderizada desde backend usando datos de archivo JSON. Incluye filtros por estado, prioridad y fecha.

## Sectores funcionales y roles

Cada empleado puede pertenecer a uno de los siguientes sectores:

- **Ventas**: Agente inmobiliario, Coordinador comercial
- **Administración**: Recepcionista, Secretario/a administrativo, Responsable de RRHH
- **Contabilidad**: Contador/a, Auxiliar contable, Encargado/a de cobranzas
- **Mantenimiento**: Coordinador/a, Técnico/a de mantenimiento, Auxiliar

Esto permite organizar y asignar tareas con mayor precisión.

## Notas importantes

- Las vistas fueron centralizadas en la carpeta `/views/`
- Se usa `express.static('public')` para servir archivos como CSS
- Se agregó `express.urlencoded()` para permitir lectura de formularios desde `req.body`
- Las rutas API (`/empleados`, `/tareas`, `/login`) permanecen separadas de las vistas
- La vista de login redirige al menú en caso de ingreso exitoso, o muestra un error si falla