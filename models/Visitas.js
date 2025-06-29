// models/Visita.js
const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const VisitaSchema = new Schema({
  cliente: { type: Types.ObjectId, ref: 'Cliente', required: true },
  propiedad: { type: Types.ObjectId, ref: 'Propiedad', required: true },
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  estado: { type: String, enum: ['pendiente', 'realizada', 'cancelada'], default: 'pendiente' },
  agente: { type: Types.ObjectId, ref: 'Empleado' },
  observaciones: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Visita', VisitaSchema);


