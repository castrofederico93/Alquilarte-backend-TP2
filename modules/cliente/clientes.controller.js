const Cliente = require('../../models/Cliente');

async function obtenerClientes(req, res, next) {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    next(err);
  }
}


async function crearCliente(req, res, next) {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.status(201).json(cliente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


async function eliminarCliente(req, res, next) {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (err) {
    next(err);
  }
}
const modificarCliente = async (req, res) => {
  try {
    const clienteActualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!clienteActualizado) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(clienteActualizado);
  } catch (error) {
    console.error('Error al modificar cliente:', error);
    res.status(500).json({ error: 'Error al modificar cliente' });
  }
};

module.exports = {
  obtenerClientes,
  crearCliente,
  eliminarCliente,
  modificarCliente
};
