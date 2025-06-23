const { leerEmpleados } = require('../empleados/empleados.model');

async function login(req, res, next) {
  const { usuario, password } = req.body;

  if (typeof usuario !== 'string' || typeof password !== 'string') {
    const err = new Error('Debe enviar usuario y contraseña válidos');
    err.status = 400;
    return next(err);
  }

  try {
    const empleados = await leerEmpleados();
    const empleado = empleados.find(e => e.usuario === usuario && e.password === password);

     if (empleado) {
      if (req.accepts('html')) {
      // Renderizamos directamente la vista 'menu' con el mensaje y el empleado
        return res.render('menu', {
          mensaje: 'Login exitoso',
          empleado
        });
      } else {
        return res.json({ mensaje: 'Login exitoso', empleado });
      }
    } else {
      // Credenciales inválidas
      return res.status(400).json({ mensaje: 'Usuario no valido' });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { login };