// modules/visitas/visitas.controller.js
const { json } = require('express');
const Visita    = require('../../models/Visitas');
const Propiedad = require('../../models/Propiedades');
const Empleado  = require('../../models/Empleado');
const Cliente   = require('../../models/Cliente');
const mongoose = require('mongoose');
const { DateTime } = require('luxon');

function formatearFecha(fechaISO) {
  if (!fechaISO) return '';
  const isoString = typeof fechaISO === 'string' ? fechaISO : fechaISO.toISOString();
  const [anio, mes, dia] = isoString.slice(0, 10).split('-');
  return `${dia}-${mes}-${anio}`;
}

// Devuelve todas las visitas en JSON, con datos poblados - Método GET
async function mostrarVisitasJSON(req, res) {
  try {
    const visitas = await Visita.find()
      .populate('cliente')
      .populate('propiedad')
      .populate('agente');
    if (!visitas) return res.status(404).json({ error: 'Visita no encontrada' });
    res.status(200).json(visita);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Listar propiedades y devolver la vista PUG - Método GET
async function mostrarAgendaVisitas(req, res) {
  try {
    const visitas = await Visita.find()
      .populate('cliente', 'nombre apellido')
      .populate('propiedad', 'direccion')
      .populate('agente', 'nombre apellido');
    const propiedadesDisponibles = await Propiedad.find({ estado: 'Disponible' });
    const empleadosRRHH = await Empleado.find({rol: 'Responsable de RRHH'});
    const clientes = await Cliente.find();

    res.render('visitas', {
      visitas,
      usuario: req.usuario,
      propiedadesDisponibles,
      formatearFecha,
      empleadosRRHH,
      clientes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error cargando la agenda de visitas');
  }
}


// Crear nueva visita - Método POST
async function crearVisita(req,res) {
    try{
    const datos = req.body;
    const nuevaVisita = new Visita(datos)

    await nuevaVisita.save();
    res.redirect('/visitas/vista');

    }catch (error) {

        res.status(400).json({error: error.message});
        ;
        }
}


// Actualizar visita existente - Método PUT
async function editarVisita(req, res) {
  try {
    const {id} = req.params;
    const datosActualizados = req.body;
    const visitaActualizada = await Visita.findByIdAndUpdate(id,datosActualizados, { new: true });
    if (!visitaActualizada){
      return res.status(404).json({ error: 'Visita no encontrada' });
    } 
    res.status(200).json({
      mensaje: 'Visita actualizada correctamente',
      visita: visitaActualizada
    })
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Eliminar visita - Método DELETE
async function eliminarVisita(req, res) {
  try {
    const {id} = req.params;
    const visitaEliminada = await Visita.findByIdAndDelete(id);
    if (!visitaEliminada){
      return res.status(404).json({ error: 'Visita no encontrada' });
    } 
    res.json({ mensaje: 'Visita eliminada correctamente' });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  mostrarAgendaVisitas,
  mostrarVisitasJSON,
  crearVisita,
  editarVisita,
  eliminarVisita
};
