const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../config/db');
const Tarea = require('../models/Tarea');

const importTareas = async () => {
  await connectDB();

  const dataPath = path.join(__dirname, '../data/tareas.json');
  const tareasJSON = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Convertir la fecha a tipo Date real
  const tareasFormateadas = tareasJSON.map(t => ({
    ...t,
    fecha: new Date(t.fecha)
  }));

  try {
    await Tarea.deleteMany(); // limpia la colección
    await Tarea.insertMany(tareasFormateadas);
    console.log('Tareas importadas correctamente');
    process.exit();
  } catch (err) {
    console.error('Error al importar tareas:', err);
    process.exit(1);
  }
};

importTareas();