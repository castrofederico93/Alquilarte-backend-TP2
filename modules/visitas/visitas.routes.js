// modules/visitas/visitas.routes.js
const express = require('express');
const router  = express.Router();

const {
  mostrarVisitasJSON,
  mostrarAgendaVisitas,
  crearVisita,
  editarVisita,
  eliminarVisita
} = require('./visitas.controller');

const verificarToken = require('../../middlewares/auth');





// GET /visitas
router.get('/', verificarToken, mostrarVisitasJSON);

// GET /visitas/vista
// Ruta que devuelve la vista Pug - esta es para el navegador
router.get('/vista', verificarToken, mostrarAgendaVisitas);

// GET /visitas/:id
//router.get('/:id', verificarToken, obtenerVisitaJSON);

// POST /visitas
router.post('/', verificarToken, crearVisita);

// PUT /visitas/:id
router.put('/:id', verificarToken, editarVisita);

// DELETE /visitas/:id
router.delete('/:id', verificarToken, eliminarVisita);

module.exports = router;

