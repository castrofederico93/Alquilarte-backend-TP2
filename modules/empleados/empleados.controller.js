const {
  leerEmpleados,
  guardarEmpleados,
  leerSectoresRoles,
} = require('./empleados.model');

async function obtenerEmpleados(req, res, next) {
  try {
    const empleados = await leerEmpleados();
    res.json(empleados);
  } catch (err) {
    next(err);
  }
}

async function crearEmpleado(req, res, next) {
  try {
    const empleados = await leerEmpleados();

    const existe = empleados.some(e => e.usuario === req.body.usuario);
    if (existe) {
      const err = new Error('El nombre de usuario ya está en uso');
      err.status = 400;
      throw err;
    }

    const nuevoEmpleado = {
      id: empleados.length > 0 ? Math.max(...empleados.map(e => e.id)) + 1 : 1,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      usuario: req.body.usuario,
      password: req.body.password,
      sector: req.body.sector,
      rol: req.body.rol
    };

    empleados.push(nuevoEmpleado);
    await guardarEmpleados(empleados);
    res.status(201).json(nuevoEmpleado);
  } catch (err) {
    next(err);
  }
}

async function actualizarEmpleado(req, res, next) {
  try {
    const { id } = req.params;
    const empleados = await leerEmpleados();
    const index = empleados.findIndex(e => e.id === Number(id));
    if (index === -1) {
      const err = new Error('Empleado no encontrado');
      err.status = 404;
      throw err;
    }
    empleados[index] = { ...empleados[index], ...req.body };
    await guardarEmpleados(empleados);
    res.json(empleados[index]);
  } catch (err) {
    next(err);
  }
}

async function eliminarEmpleado(req, res, next) {
  try {
    const { id } = req.params;
    let empleados = await leerEmpleados();
    const existe = empleados.find(e => e.id === Number(id));
    if (!existe) {
      const err = new Error('Empleado no encontrado');
      err.status = 404;
      throw err;
    }
    empleados = empleados.filter(e => e.id !== Number(id));
    await guardarEmpleados(empleados);

    
    // Mensaje de confirmación
    const mensaje = 'Usuario eliminado correctamente';

    if(req.accepts('html')){
      return res.json([mensaje])
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function obtenerSectoresRoles(req, res, next) {
  try {
    const data = await leerSectoresRoles();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  obtenerEmpleados,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
  obtenerSectoresRoles,
};