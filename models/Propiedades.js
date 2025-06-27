const mongoose = require("mongoose");

const PropiedadSchema = new mongoose.Schema({

    direccion:    { tipe: String, required: true },
    tipo:         { tipe: String, required: true },
    ambientes:    { tipe: Number, required: true },
    superficie:   { tipe: Number, required: true },
    descripcion:  { tipe: String, required: true },
    estado:       { tipe: String, required: true },
    precio:       { tipe: Number, required: true },
    observaciones:{ tipe: String, required: false },
},{
    timestamps: true
});

module.exports = mongoose.model('Propiedad', PropiedadSchema);