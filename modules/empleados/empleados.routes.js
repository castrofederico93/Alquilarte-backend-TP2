const express = require('express');
const router = express.Router();

const {
  obtenerEmpleados,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
  obtenerSectoresRoles,
} = require('./empleados.controller');

// Rutas de empleados
router.get('/', obtenerEmpleados);
router.post('/', crearEmpleado);
router.put('/:id', actualizarEmpleado);
router.delete('/:id', eliminarEmpleado);

// Ruta para sectores y roles
router.get('/sectores-roles', obtenerSectoresRoles);

module.exports = router;