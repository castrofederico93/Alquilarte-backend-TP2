const express = require('express');
const router = express.Router();
const {
  obtenerClientes,
  crearCliente,
  eliminarCliente
} = require('./clientes.controller');

router.get('/', obtenerClientes);
router.post('/', crearCliente);
router.delete('/:id', eliminarCliente);

module.exports = router;
