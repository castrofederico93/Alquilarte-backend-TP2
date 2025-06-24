const mongoose = require('mongoose');

const TareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  area: { type: String, required: true },
  estado: { type: String, required: true },
  prioridad: { type: String, required: true },
  fecha: { type: Date, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tarea', TareaSchema);