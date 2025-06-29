// models/pago.js
const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
  cliente: {
    nombre: String,
    apellido: String,
    dni: String,
    email: String,
    telefono: String
  },
  propiedad: {
    direccion: String
  },
  monto: Number,
  periodo: String,
  adicionales: String,
  fechaPago: Date,
  formaPago: String
});

module.exports = mongoose.model('Pago', pagoSchema);
