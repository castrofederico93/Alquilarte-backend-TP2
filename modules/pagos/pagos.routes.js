const express = require('express');
const router = express.Router();
const controller = require('./pagos.controller');

router.post('/', controller.crearPago);
router.get('/buscar/:dni', controller.buscarPorDNI);
router.get('/pdf/:id', controller.descargarPDF);

// ⚠️ ESTA debe ir ANTES de /:id para que funcione correctamente
router.get('/', controller.obtenerPagos);

// 🔴 SIEMPRE al final para evitar conflictos
router.get('/:id', controller.obtenerPagoPorId);

module.exports = router;
