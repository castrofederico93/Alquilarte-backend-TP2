const mongoose = require('mongoose');

const EmpleadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  usuario: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sector: { type: String, required: true },
  rol: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Empleado', EmpleadoSchema);