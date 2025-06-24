const Tarea = require('../../models/Tarea');

exports.filtrarYMostrar = async (req, res) => {
  const { estado, prioridad, fecha, area } = req.query;

  const filtros = {};
  if (estado) filtros.estado = new RegExp(`^${estado}$`, 'i');       // insensible a mayúsculas
  if (prioridad) filtros.prioridad = new RegExp(`^${prioridad}$`, 'i');
  if (area) filtros.area = new RegExp(`^${area}$`, 'i');

  if (fecha) {
    try {
      const fechaObj = new Date(fecha);
      if (!isNaN(fechaObj)) {
        // busca tareas con la misma fecha (ignorando la hora)
        const siguienteDia = new Date(fechaObj);
        siguienteDia.setDate(fechaObj.getDate() + 1);
        filtros.fecha = { $gte: fechaObj, $lt: siguienteDia };
      }
    } catch (e) {
      console.warn('Fecha inválida:', fecha);
    }
  }

  try {
    const tareas = await Tarea.find(filtros);
    res.render('filtros', { tareas });
  } catch (error) {
    console.error('Error al filtrar tareas:', error);
    res.status(500).send('Error al cargar los filtros');
  }
};