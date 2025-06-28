const { json } = require('express');
const Propiedad = require('../../models/Propiedades');
const mongoose = require('mongoose')

//metodo get 
// Para devolver JSON (API)
async function obtenerPropiedadJSON(req, res) {
  try {
    const propiedades = await Propiedad.find();
    res.status(200).json(propiedades);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Para devolver la vista Pug 
async function obtenerPropiedadVista(req, res) {
  try {
    const propiedades = await Propiedad.find();
    res.render('propiedades', { propiedades });
  } catch (error) {
    res.status(400).send('Error al cargar propiedades');
  }
}



//metodo post
async function crearPropiedad(req,res) {
    try{
    const datos = req.body;
    const nuevaPropiedad = new Propiedad(datos)

    await nuevaPropiedad.save();
    res.redirect('/propiedades/vista');

    }catch (error) {

        res.status(400).json({error: error.message});
        ;
        }
    }



//metodo put
 async function modificarPropiedad(req,res) {

    try{
        const {id} = req.params;
        const datosActualizados = req.body;
        const propiedadActualizada = await Propiedad.findByIdAndUpdate(id, datosActualizados, {new:true});
        if(!propiedadActualizada){
            return res.status(404).json({mensaje:'Propiedad no encontrada'});
        }
        res.status(200).json({
            mensaje:'Propiedad actualizada correctamente',
            propiedad: (propiedadActualizada)
        });
       

    }catch(error){
        res.status(400).json({error: error.message});
    }
    
 }



//metodo delete

async function eliminarPropiedad(req,res){
    try{
        const{id} =req.params;
        const propiedadEliminada = await Propiedad.findByIdAndDelete(id);
        if (!propiedadEliminada) {
            return res.status(404).json({mensaje:'No se encontro la propiedad'});
        }
        res.json({mensaje:'Propiedad eliminada correctamente'});



    }catch(error){
        res.status(500).json({error: error.message});
    }
}



module.exports = {
  obtenerPropiedadJSON,
  obtenerPropiedadVista,
  crearPropiedad,
  modificarPropiedad,
  eliminarPropiedad,
};