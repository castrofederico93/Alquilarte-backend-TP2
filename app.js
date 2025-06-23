const express = require("express");
// Middlewares
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');


const app = express();
const port = 3000;

// Configuración del motor de vistas
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// Middleware propio
app.use(requestLogger);

// Rutas modulares
const tareasRoutes = require("./modules/tareas/tareas.routes");
const empleadosRoutes = require("./modules/empleados/empleados.routes");
const filtrosRoutes = require("./modules/filtros/filtros.routes");
const loginRoutes = require('./modules/login/login.routes'); 

app.use("/login", loginRoutes);
app.use("/tareas", tareasRoutes);
app.use("/empleados", empleadosRoutes);
app.use("/filtros", filtrosRoutes);


// Vistas Pug
app.get('/menu', (req, res) => {
  res.render('menu');
});

app.get('/login-vista', (req, res) => {
  res.render('login', { error: null });
});

app.get('/empleados-vista', (req, res) => {
  res.render('empleados');
});

app.get('/filtros/vista', (req, res) => {
  res.render('filtros');
});

app.get('/tareas/vista', (req, res) => {
  res.render('tareas');
});

// Ruta raíz
app.get('/', (req, res) => {
  res.redirect('/login-vista');
});





// Ruta para probar errores
app.get('/error', (req, res) => {
  throw new Error('¡Este es un error de prueba!');
});

/* Middleware 404 personalizado (opcional)
app.use((req, res, next) => {
  const err = new Error('Ruta no encontrada');
  err.status = 404;
  next(err);
});
*/

// Middleware de errores (siempre al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
