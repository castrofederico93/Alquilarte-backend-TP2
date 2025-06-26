const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  dni: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  telefono: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cliente', ClienteSchema);
