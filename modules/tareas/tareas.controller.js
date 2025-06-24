const Tarea = require('../../models/Tarea');

async function getAllTareas(req, res) {
  try {
    const filtros = {};
    if (req.query.estado) filtros.estado = req.query.estado;
    if (req.query.prioridad) filtros.prioridad = req.query.prioridad;
    if (req.query.area) filtros.area = req.query.area;

    const tareas = await Tarea.find(filtros);
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las tareas' });
  }
}

async function getTareaById(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (tarea) {
      res.json(tarea);
    } else {
      res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }
  } catch (error) {
    res.status(400).json({ mensaje: 'ID inválido' });
  }
}

async function createTarea(req, res) {
  try {
    const nuevaTarea = new Tarea(req.body);
    await nuevaTarea.save();
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear tarea', error });
  }
}

async function updateTarea(req, res) {
  try {
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (tarea) {
      res.json(tarea);
    } else {
      res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar tarea', error });
  }
}

async function deleteTarea(req, res) {
  try {
    const tarea = await Tarea.findByIdAndDelete(req.params.id);
    if (tarea) {
      res.json({ mensaje: 'Tarea eliminada correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar tarea', error });
  }
}

async function obtenerTareas() {
  return await Tarea.find();
}

module.exports = {
  getAllTareas,
  getTareaById,
  createTarea,
  updateTarea,
  deleteTarea,
  obtenerTareas
};