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
      return res.status(400).json({ mensaje: 'Usuario no válido' });
    }

    const coincide = await bcrypt.compare(password, empleado.password);

    if (!coincide) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar token
    const payload = {
      id: empleado._id,
      usuario: empleado.usuario,
      rol: empleado.rol,
      sector: empleado.sector,
    };


    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    // Guardar el token como cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // ponelo en true si usás HTTPS
      maxAge: 60 * 60 * 1000 // 1 hora
    });

    // Redirigir al menú
    return res.redirect('/menu');

  } catch (err) {
    next(err);
  }
}

module.exports = { login };