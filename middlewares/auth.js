const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  throw new Error('Falta definir JWT_SECRET en el archivo .env');
}
const SECRET_KEY = process.env.JWT_SECRET;

function verificarToken(req, res, next) {
  const token = req.cookies.token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);

  if (!token) {
    return res.status(401).render('login', { error: 'Token no proporcionado. Inicie sesión.' });
  }

  jwt.verify(token, SECRET_KEY, (err, usuario) => {
    if (err) {
      return res.status(403).render('login', { error: 'Token inválido o expirado. Inicie sesión nuevamente.' });
    }

    req.usuario = usuario;
    next();
  });
}

module.exports = verificarToken;