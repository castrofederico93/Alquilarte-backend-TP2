// models/propiedad.js
const mongoose = require('mongoose');

const propiedadSchema = new mongoose.Schema({
  direccion: { type: String, required: true },
  tipo: {
    type: String,
    enum: ['Casa', 'Departamento', 'Local'],
    required: true
  },
  ambientes: { type: Number, required: true },
  superficie: { type: Number, required: true },
  descripcion: { type: String },
  estado: {
    type: String,
    enum: ['disponible', 'reservada', 'alquilada'],
    default: 'disponible'
  },
  precio: { type: Number, required: true },
  observaciones: { type: String }
}, {
  collection: 'propiedades',
  timestamps: true
});

module.exports = mongoose.model('Propiedad', propiedadSchema);
