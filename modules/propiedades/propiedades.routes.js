const express = require('express');
const router = express.Router();

const {
  obtenerPropiedadJSON,
  obtenerPropiedadVista,
  crearPropiedad,
  modificarPropiedad,
  eliminarPropiedad,
} = require('./propiedades.controller');

const verificarToken = require('../../middlewares/auth');

// Ruta que devuelve JSON (API)
router.get('/', verificarToken, obtenerPropiedadJSON);

// Ruta que devuelve la vista Pug (navegador)
router.get('/vista', obtenerPropiedadVista);

router.post('/', verificarToken, crearPropiedad);
router.put('/:id', verificarToken, modificarPropiedad);
router.delete('/:id', verificarToken, eliminarPropiedad);

module.exports = router;
