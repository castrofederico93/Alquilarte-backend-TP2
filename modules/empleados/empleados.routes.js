const express = require('express');
const router = express.Router();
const Empleado = require('../../models/Empleado');

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

router.get('/por-sector/:area', verificarToken, async (req, res) => {
  try {
    const empleados = await Empleado.find({ sector: req.params.area });
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener empleados por sector' });
  }
});

module.exports = router;