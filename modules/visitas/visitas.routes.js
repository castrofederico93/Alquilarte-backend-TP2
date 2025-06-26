// modules/visitas/visitas.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('./visitas.controller');
const verificarToken = require('../../middlewares/auth');


// Vista con Pug protegida por JWT
router.get('/vista', verificarToken, async (req, res) => {
  try {
    const visitas = await ctrl.listVisitas();
    res.render('visitas', { visitas, usuario: req.usuario });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la vista');
  }
});

// GET /visitas - Listar
router.get('/', verificarToken,ctrl.listVisitas);
// GET /visitas/:id - Obtener uno
router.get('/:id',verificarToken,ctrl.getVisita);
// POST /visitas - Crear
router.post('/', verificarToken,ctrl.createVisita);
// PUT /visitas/:id - Actualizar
router.put('/:id', verificarToken,ctrl.updateVisita);
// DELETE /visitas/:id - Eliminar
router.delete('/:id', verificarToken, ctrl.deleteVisita);

module.exports = router;

