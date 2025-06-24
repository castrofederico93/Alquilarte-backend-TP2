const express = require("express");
const router = express.Router();
const filtrosController = require("./filtros.controller");

// Ruta de prueba original
router.get("/", (req, res) => {
  res.send("Ruta funcionando correctamente");
});

// Nueva ruta para mostrar tareas filtradas en Pug
router.get("/vista", filtrosController.filtrarYMostrar);

module.exports = router;