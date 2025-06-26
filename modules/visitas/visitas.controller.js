// modules/visitas/visitas.controller.js
const Visita = require('../../models/Visita');

// Listar todas las visitas
async function listVisitas() {
 return await Visita.find()
    .populate('cliente', 'nombre')
    .populate('propiedad', 'direccion')
    .populate('agente', 'nombre');
  }


// Obtener una visita por ID
async function getVisita(req, res) {
  try {
    const visita = await Visita.findById(req.params.id)
      .populate('cliente', 'nombre')
      .populate('propiedad', 'direccion')
      .populate('agente', 'nombre');
    if (!visita) return res.status(404).json({ error: 'Visita no encontrada' });
    res.json(visita);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Crear nueva visita
async function createVisita(req, res) {
  try {
    const { cliente, propiedad, fecha, hora, estado, agente, observaciones } = req.body;
    const nuevaVisita = new Visita({ cliente, propiedad, fecha, hora, estado, agente, observaciones });
    const guardada = await nuevaVisita.save();
    res.status(201).json(guardada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Actualizar visita existente
async function updateVisita(req, res) {
  try {
    const { cliente, propiedad, fecha, hora, estado, agente, observaciones } = req.body;
    const actualizada = await Visita.findByIdAndUpdate(
      req.params.id,
      { cliente, propiedad, fecha, hora, estado, agente, observaciones },
      { new: true, runValidators: true }
    );
    if (!actualizada) return res.status(404).json({ error: 'Visita no encontrada' });
    res.json(actualizada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Eliminar visita
async function deleteVisita(req, res) {
  try {
    const borrada = await Visita.findByIdAndDelete(req.params.id);
    if (!borrada) return res.status(404).json({ error: 'Visita no encontrada' });
    res.json({ message: 'Visita eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { listVisitas, getVisita, createVisita, updateVisita, deleteVisita };
