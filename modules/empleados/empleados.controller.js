const Empleado = require('../../models/Empleado');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Lee sectores del JSON
const leerSectoresRoles = () => {
  const ruta = path.join(__dirname, '../../data/sectores_roles.json');
  return JSON.parse(fs.readFileSync(ruta, 'utf-8'));
};

// GET /empleados
async function obtenerEmpleados(req, res, next) {
  try {
    const empleados = await Empleado.find();
    res.json(empleados);
  } catch (err) {
    next(err);
  }
}

// POST /empleados
async function crearEmpleado(req, res, next) {
  try {
    const existe = await Empleado.findOne({ usuario: req.body.usuario });
    if (existe) {
      const err = new Error('El nombre de usuario ya está en uso');
      err.status = 400;
      throw err;
    }

    // Hashear la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const nuevoEmpleado = new Empleado({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      usuario: req.body.usuario,
      password: hashedPassword,
      sector: req.body.sector,
      rol: req.body.rol
    });

    await nuevoEmpleado.save();
    res.status(201).json(nuevoEmpleado);
  } catch (err) {
    next(err);
  }
}

// PUT /empleados/:id
async function actualizarEmpleado(req, res, next) {
  try {
    const actualizacion = { ...req.body };

    // Si viene una nueva contraseña, la hasheamos
    if (actualizacion.password) {
      actualizacion.password = await bcrypt.hash(actualizacion.password, 10);
    }

    const actualizado = await Empleado.findByIdAndUpdate(
      req.params.id,
      actualizacion,
      { new: true }
    );

    if (!actualizado) {
      const err = new Error('Empleado no encontrado');
      err.status = 404;
      throw err;
    }

    res.json(actualizado);
  } catch (err) {
    next(err);
  }
}

// DELETE /empleados/:id
async function eliminarEmpleado(req, res, next) {
  try {
    const eliminado = await Empleado.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      const err = new Error('Empleado no encontrado');
      err.status = 404;
      throw err;
    }

    const mensaje = 'Usuario eliminado correctamente';

    if (req.accepts('html')) {
      return res.json([mensaje]);
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// GET /empleados/sectores-roles
async function obtenerSectoresRoles(req, res, next) {
  try {
    const data = leerSectoresRoles();
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
  obtenerSectoresRoles
};