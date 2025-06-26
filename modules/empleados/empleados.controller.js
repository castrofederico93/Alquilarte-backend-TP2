const Empleado = require('../../models/Empleado');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { isValidObjectId } = require('mongoose');

// Lee sectores del JSON
const leerSectoresRoles = () => {
  const ruta = path.join(__dirname, '../../data/sectores_roles.json');
  return JSON.parse(fs.readFileSync(ruta, 'utf-8'));
};

// GET /empleados
async function obtenerEmpleados(req, res, next) {
  try {
    const { sector, rol, id } = req.usuario;

    const esRRHH = sector === 'Administración' && rol === 'Responsable de RRHH';

    if (esRRHH) {
      // Puede ver todos
      const empleados = await Empleado.find();
      return res.json(empleados);
    }

    // Solo puede ver su propio perfil
    const empleado = await Empleado.findById(id);
    if (!empleado) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    res.json([empleado]);
  } catch (err) {
    next(err);
  }
}

// POST /empleados
async function crearEmpleado(req, res, next) {
  try {
    const { sector, rol } = req.usuario || {};

    if (sector !== 'Administración' || rol !== 'Responsable de RRHH') {
      return res.status(403).json({ mensaje: 'No tiene permiso para crear empleados' });
    }

    const existe = await Empleado.findOne({ usuario: req.body.usuario });
    if (existe) {
      const err = new Error('El nombre de usuario ya está en uso');
      err.status = 400;
      throw err;
    }

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
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ mensaje: 'ID inválido' });
    }

    const empleado = await Empleado.findById(req.params.id);
    if (!empleado) {
      const err = new Error('Empleado no encontrado');
      err.status = 404;
      throw err;
    }

    const { id: usuarioId, sector, rol } = req.usuario;
    const esRRHH = sector === 'Administración' && rol === 'Responsable de RRHH';
    const esElMismo = usuarioId === req.params.id;

    // Verificar permisos
    if (!esRRHH && !esElMismo) {
      const err = new Error('No tiene permiso para editar este empleado');
      err.status = 403;
      throw err;
    }

    // Si no es RRHH, solo puede cambiar contraseña
    if (!esRRHH) {
      const { passwordActual, passwordNueva } = req.body;

      if (!passwordActual || !passwordNueva) {
        const err = new Error('Solo puede cambiar su contraseña');
        err.status = 403;
        throw err;
      }

      const coincide = await bcrypt.compare(passwordActual, empleado.password);
      if (!coincide) {
        const err = new Error('La contraseña actual es incorrecta');
        err.status = 400;
        throw err;
      }

      empleado.password = await bcrypt.hash(passwordNueva, 10);
    } else {
      // RRHH puede editar todo
      empleado.nombre = req.body.nombre;
      empleado.apellido = req.body.apellido;
      empleado.usuario = req.body.usuario;
      empleado.sector = req.body.sector;
      empleado.rol = req.body.rol;

      // Cambio de contraseña si se solicita
      if (req.body.passwordNueva && req.body.passwordNueva.trim().length >= 4) {
        empleado.password = await bcrypt.hash(req.body.passwordNueva, 10);
      }
    }

    await empleado.save();
    res.json(empleado);
  } catch (err) {
    next(err);
  }
}

// DELETE /empleados/:id
async function eliminarEmpleado(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ mensaje: 'ID inválido' });
    }

    // Verificar permisos antes de buscar en la base
    const { sector, rol } = req.usuario || {};
    const esRRHH = sector === 'Administración' && rol === 'Responsable de RRHH';

    if (!esRRHH) {
      return res.status(403).json({ mensaje: 'No tiene permiso para eliminar empleados' });
    }

    // Buscar y eliminar solo si tiene permisos
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