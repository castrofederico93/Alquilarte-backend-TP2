const fs = require('fs').promises;
const path = require('path');
const tareasPath = path.join(__dirname, '../../data/tareas.json');

async function leerTareas() {
  const data = await fs.readFile(tareasPath, 'utf-8');
  return JSON.parse(data);
}

exports.filtrarYMostrar = async (req, res) => {
  const { estado, prioridad, fecha, area } = req.query;
  let tareas = await leerTareas();

  if (estado) {
    tareas = tareas.filter(t => t.estado.toLowerCase() === estado.toLowerCase());
  }
  if (prioridad) {
    tareas = tareas.filter(t => t.prioridad.toLowerCase() === prioridad.toLowerCase());
  }
  if (fecha) {
    tareas = tareas.filter(t => t.fecha === fecha);
  }
  if (area) {
    tareas = tareas.filter(t => t.area.toLowerCase() === area.toLowerCase());
  }

  res.render('filtros', { tareas });
};
//Alejandro
