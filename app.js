require('dotenv').config();
const express = require("express");
const cookieParser = require('cookie-parser');

// CONEXIÓN A MONGODB
const connectDB = require('./config/db');
connectDB();

// Middlewares
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const verificarToken = require('./middlewares/auth');

const app = express();

// Configuración del motor de vistas
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));


// Middleware propio
app.use(requestLogger);

// Rutas modulares
const tareasRoutes = require("./modules/tareas/tareas.routes");
const empleadosRoutes = require("./modules/empleados/empleados.routes");
const filtrosRoutes = require("./modules/filtros/filtros.routes");
const loginRoutes = require('./modules/login/login.routes'); 
const clientesRoutes = require('./modules/cliente/clientes.routes');
const propiedadesRoutes = require('./modules/propiedades/propiedades.routes');
const { mostrarAgendaVisitas } = require('./modules/visitas/visitas.controller');
const pagosRoutes = require('./modules/pagos/pagos.routes');
const Pago = require('./models/Pago'); 

app.get(
  '/visitas/vista',
  verificarToken,
  mostrarAgendaVisitas
);

const visitasRoutes = require('./modules/visitas/visitas.routes');


app.use("/login", loginRoutes);
app.use("/tareas", tareasRoutes);
app.use("/empleados", empleadosRoutes);
app.use("/filtros", filtrosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/propiedades', propiedadesRoutes);
app.use('/visitas', visitasRoutes);
app.use('/pagos', pagosRoutes); 



// Vistas Pug protegidas
app.get('/menu', verificarToken, (req, res) => {
  res.render('menu', { usuario: req.usuario });
});

app.get('/empleados-vista', verificarToken, (req, res) => {
  res.render('empleados', { usuario: req.usuario });
});

app.get('/filtros/vista', verificarToken, (req, res) => {
  res.render('filtros', { usuario: req.usuario });
});

// Tareas/vista pasa tareas y empleados
const Tarea = require('./models/Tarea');
const Empleado = require('./models/Empleado');

app.get('/tareas/vista', verificarToken, async (req, res) => {
  try {
    const tareas = await Tarea.find().populate('asignadoA');
    const empleados = await Empleado.find();
    res.render('tareas', { tareas, empleados, usuario: req.usuario });
  } catch (error) {
    console.error('Error al cargar la vista de tareas:', error);
    res.status(500).send('Error al cargar la vista de tareas');
  }
});

app.get('/clientes/vista', verificarToken, (req, res) => {
  res.render('clientes', { usuario: req.usuario });
});

app.get('/pagos-vista', verificarToken, async (req, res) => {
  try {
    const pagos = await Pago.find();
    res.render('pagos', { pagos, usuario: req.usuario });
  } catch (error) {
    console.error('Error al cargar la vista de pagos:', error);
    res.status(500).send('Error al cargar la vista de pagos');
  }
});


app.get('/propiedad/vista', verificarToken, (req, res) => {
  res.render('propiedades', { usuario: req.usuario });
});

// Cierre de sesión global
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login-vista');
});

// Rutas públicas
app.get('/login-vista', (req, res) => {
  res.render('login', { error: null });
});

app.get('/', (req, res) => {
  res.redirect('/login-vista');
});

// Ruta para probar errores
app.get('/error', (req, res) => {
  throw new Error('¡Este es un error de prueba!');
});

// Middleware de errores
app.use(errorHandler);

module.exports = app;
