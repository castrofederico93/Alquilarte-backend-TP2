const express = require('express');
const router = express.Router();

const {
  obtenerPropiedad,
  crearPropiedad,
  modificarPropiedad,
  eliminarPropiedad,
} = require('./propiedades.controller');
const verificarToken = require('../../middlewares/auth');

// Rutas protegidas con JWT
router.get('/', /* verificarToken, */ obtenerPropiedad);
router.post('/', verificarToken, crearPropiedad);
router.put('/:id', verificarToken, modificarPropiedad);
router.delete('/:id', verificarToken, eliminarPropiedad);




module.exports = router;