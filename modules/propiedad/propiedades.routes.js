// modules/propiedades.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const ctrl = require('./propiedades.controller');

router.post('/',auth, ctrl.createPropiedad);
router.get('/', auth, ctrl.getPropiedades);
router.get('/:id',auth, ctrl.getPropiedadById);
router.get('/estado/disponible',auth, ctrl.getPropiedadesDisponibles);
router.get('/estado/alquilada',auth, ctrl.getPropiedadesAlquiladas);
router.put('/:id',auth, ctrl.updatePropiedad);
router.delete('/:id',auth, ctrl.deletePropiedad);

module.exports = router;
