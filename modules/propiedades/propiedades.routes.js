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

  // Ruta que devuelve JSON para cuando hacemos una API mas que nada
  router.get('/', verificarToken, obtenerPropiedadJSON);

  // Ruta que devuelve la vista Pug - esta es para el navegador
  router.get('/vista', obtenerPropiedadVista);

  router.post('/', verificarToken, crearPropiedad);
  router.put('/:id', verificarToken, modificarPropiedad);
  router.delete('/:id', verificarToken, eliminarPropiedad);

  module.exports = router;
