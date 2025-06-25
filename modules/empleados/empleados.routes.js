const express = require('express');
const router = express.Router();

const {
  obtenerEmpleados,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
  obtenerSectoresRoles,
} = require('./empleados.controller');
const verificarToken = require('../../middlewares/auth');

// Rutas protegidas con JWT
router.get('/', verificarToken, obtenerEmpleados);
router.post('/', verificarToken, crearEmpleado);
router.put('/:id', verificarToken, actualizarEmpleado);
router.delete('/:id', verificarToken, eliminarEmpleado);

// Ruta para sectores y roles
router.get('/sectores-roles', verificarToken, obtenerSectoresRoles);

module.exports = router;