// modules/propiedades.controller.js
const Propiedad = require('../../models/propiedad');
// si necesitas enlazar con cliente para alguna operación:
// const Cliente = require('../models/cliente');

exports.createPropiedad = async (req, res) => {
  try {
    const propiedad = new Propiedad(req.body);
    await propiedad.save();
    res.status(201).json(propiedad);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPropiedades = async (req, res) => {
  try {
    const props = await Propiedad.find();
    res.json(props);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPropiedadById = async (req, res) => {
  try {
    const prop = await Propiedad.findById(req.params.id);
    if (!prop) return res.status(404).json({ error: 'Propiedad no encontrada' });
    res.json(prop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPropiedadesDisponibles = async (req, res) => {
  try {
    const props = await Propiedad.find({ estado: 'disponible' });
    res.json(props);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPropiedadesAlquiladas = async (req, res) => {
  try {
    const props = await Propiedad.find({ estado: 'alquilada' });
    res.json(props);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePropiedad = async (req, res) => {
  try {
    const prop = await Propiedad.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!prop) return res.status(404).json({ error: 'Propiedad no encontrada' });
    res.json(prop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePropiedad = async (req, res) => {
  try {
    const prop = await Propiedad.findByIdAndDelete(req.params.id);
    if (!prop) return res.status(404).json({ error: 'Propiedad no encontrada' });
    res.json({ message: 'Propiedad eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
