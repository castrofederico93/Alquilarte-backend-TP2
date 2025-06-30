const express = require('express');
const router = express.Router();
const controller = require('./pagos.controller');

router.post('/', controller.crearPago);
router.get('/buscar/:dni', controller.buscarPorDNI);
router.get('/pdf/:id', controller.descargarPDF);


router.get('/', controller.obtenerPagos);


router.get('/:id', controller.obtenerPagoPorId);

module.exports = router;
