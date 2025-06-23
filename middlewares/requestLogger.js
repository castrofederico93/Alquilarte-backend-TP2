function requestLogger(req, res, next) {
  // Imprimir método HTTP y ruta (path)
  console.log(`${req.method} ${req.path}`);
  next();
}

module.exports = requestLogger;