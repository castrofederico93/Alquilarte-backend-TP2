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

// la vista con Pug 
router.get('/vista', async (req, res) => {
  try {
    const tareas = await obtenerTareas();
    res.render('tareas', { tareas });
  } catch (error) {
    res.status(500).send('Error al cargar la vista');
  }
});

//  rutas CRUD para thunder client
router.get('/', getAllTareas);
router.get('/:id', getTareaById);
router.post('/', createTarea);
router.put('/:id', updateTarea);
router.delete('/:id', deleteTarea);

module.exports = router;