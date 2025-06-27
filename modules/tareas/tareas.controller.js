const Tarea = require('../../models/Tarea');
const Empleado = require('../../models/Empleado');

async function getAllTareas(req, res) {
  try {
    const filtros = {};
    if (req.query.estado) filtros.estado = req.query.estado;
    if (req.query.prioridad) filtros.prioridad = req.query.prioridad;
    if (req.query.area) filtros.area = req.query.area;

    const tareas = await Tarea.find(filtros).populate('asignadoA');
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las tareas' });
  }
}

async function getTareaById(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id).populate('asignadoA');
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
    const datosTarea = { ...req.body };

    if (datosTarea.asignadoA) {
      const empleado = await Empleado.findById(datosTarea.asignadoA);
      if (!empleado) {
        return res.status(400).json({ mensaje: 'Empleado asignado no válido' });
      }
    } else {
      datosTarea.asignadoA = null;
    }

    const nuevaTarea = new Tarea(datosTarea);
    await nuevaTarea.save();
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear tarea', error });
  }
}

async function updateTarea(req, res) {
  try {
    const datosTarea = { ...req.body };

    if (datosTarea.asignadoA) {
      const empleado = await Empleado.findById(datosTarea.asignadoA);
      if (!empleado) {
        return res.status(400).json({ mensaje: 'Empleado asignado no válido' });
      }
    } else {
      datosTarea.asignadoA = null;
    }

    const tarea = await Tarea.findByIdAndUpdate(req.params.id, datosTarea, { new: true }).populate('asignadoA');
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
  return await Tarea.find().populate('asignadoA');
}

module.exports = {
  getAllTareas,
  getTareaById,
  createTarea,
  updateTarea,
  deleteTarea,
  obtenerTareas
};