const express = require('express');
const router = express.Router();
const {
  obtenerClientes,
  crearCliente,
  eliminarCliente,
  modificarCliente
} = require('./clientes.controller');

router.get('/', obtenerClientes);
router.post('/', crearCliente);
router.delete('/:id', eliminarCliente);
router.put('/:id', modificarCliente);

module.exports = router;
