const express = require('express');
const router = express.Router();
const {
  getAllTareas,
  getTareaById,
  createTarea,
  updateTarea,
  deleteTarea,
  obtenerTareas
} = require('./tareas.controller');
const verificarToken = require('../../middlewares/auth');

// Vista con Pug protegida por JWT
router.get('/vista', verificarToken, async (req, res) => {
  try {
    const tareas = await obtenerTareas();
    const empleados = await require('../../models/Empleado').find();
    res.render('tareas', { tareas, empleados, usuario: req.usuario });
  } catch (error) {
    res.status(500).send('Error al cargar la vista');
  }
});

// Rutas CRUD para Thunder Client
router.get('/', verificarToken, getAllTareas);
router.get('/:id', verificarToken, getTareaById);
router.post('/', verificarToken, createTarea);
router.put('/:id', verificarToken, updateTarea);
router.delete('/:id', verificarToken, deleteTarea);

module.exports = router;