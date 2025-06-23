const fs = require('fs').promises;
const path = require('path');

// Ruta al archivo tareas.json
const dataPath = path.join(__dirname, '../../data/tareas.json');


async function leerTareas() {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo tareas:', error);
    return [];
  }
}


async function guardarTareas(tareas) {
  try {
    await fs.writeFile(dataPath, JSON.stringify(tareas, null, 2));
  } catch (error) {
    console.error('Error guardando tareas:', error);
  }
}

module.exports = {
  leerTareas,
  guardarTareas,
};
