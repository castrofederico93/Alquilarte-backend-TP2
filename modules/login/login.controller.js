const Empleado = require('../../models/Empleado');
const bcrypt = require('bcrypt');

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

    // Login exitoso
    if (req.accepts('html')) {
      return res.render('menu', {
        mensaje: 'Login exitoso',
        empleado
      });
    } else {
      return res.json({ mensaje: 'Login exitoso', empleado });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { login };