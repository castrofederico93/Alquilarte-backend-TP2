const jwt = require('jsonwebtoken');
const Empleado = require('../../models/Empleado');
const bcrypt = require('bcrypt');

if (!process.env.JWT_SECRET) {
  throw new Error('Falta definir JWT_SECRET en el archivo .env');
}
const SECRET_KEY = process.env.JWT_SECRET;

async function login(req, res, next) {
  const { usuario, password } = req.body;

  if (typeof usuario !== 'string' || typeof password !== 'string') {
    const err = new Error('Debe enviar usuario y contraseña válidos');
    err.status = 400;
    return next(err);
  }

  try {
    const empleado = await Empleado.findOne({ usuario });

    if (!empleado) {
      return res.status(400).render('login', { error: 'Usuario no válido' });
    }

    const coincide = await bcrypt.compare(password, empleado.password);

    if (!coincide) {
      return res.status(400).render('login', { error: 'Contraseña incorrecta' });
    }

    // Generar token
    const payload = {
      id: empleado._id,
      usuario: empleado.usuario,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      rol: empleado.rol,
      sector: empleado.sector
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    // Detectar si es un cliente API (tests o Postman) o navegador
    const aceptaJSON = req.headers.accept && req.headers.accept.includes('application/json');

    if (aceptaJSON) {
      // Para supertest o Postman
      return res.json({ mensaje: 'Login exitoso', token });
    } else {
      // Para el navegador: guardar cookie y redirigir
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000 // 1 hora
      });
      return res.redirect('/menu');
    }

  } catch (err) {
    next(err);
  }
}

module.exports = { login };