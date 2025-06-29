const mongoose = require("mongoose");

const PropiedadSchema = new mongoose.Schema({
    direccion:    { type: String, required: true },
    tipo:         { type: String, required: true },
    ambientes:    { type: Number, required: true },
    superficie:   { type: Number, required: true },
    descripcion:  { type: String, required: true },
    estado:       { type: String, required: true },
    precio:       { type: Number, required: true },
    observaciones:{ type: String, required: false },
}, {
    timestamps: true,
    collection: 'propiedades'
});

module.exports = mongoose.model('Propiedad', PropiedadSchema);
