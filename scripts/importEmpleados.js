const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const connectDB = require('../config/db');
const Empleado = require('../models/Empleado');

const importEmpleados = async () => {
  await connectDB();

  const dataPath = path.join(__dirname, '../data/empleados.json');
  const empleadosJSON = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Hashear contraseñas antes de insertar
  const empleadosHasheados = await Promise.all(
    empleadosJSON.map(async (e) => ({
      nombre: e.nombre,
      apellido: e.apellido,
      usuario: e.usuario,
      password: await bcrypt.hash(e.password, 10),
      sector: e.sector,
      rol: e.rol
    }))
  );

  try {
    await Empleado.deleteMany(); // 💣 Borra todos los empleados anteriores
    await Empleado.insertMany(empleadosHasheados);
    console.log('Empleados importados correctamente con contraseña segura');
    process.exit();
  } catch (err) {
    console.error('Error al importar empleados:', err);
    process.exit(1);
  }
};

importEmpleados();