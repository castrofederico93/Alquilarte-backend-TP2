const express = require("express");
const router = express.Router();
const filtrosController = require("./filtros.controller");
const verificarToken = require("../../middlewares/auth");

// Ruta de prueba original
router.get("/", (req, res) => {
  res.send("Ruta funcionando correctamente");
});

// Ruta protegida para mostrar tareas filtradas en Pug
router.get("/vista", verificarToken, filtrosController.filtrarYMostrar);

module.exports = router;