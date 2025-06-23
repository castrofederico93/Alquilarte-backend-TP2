const fs = require('fs/promises');
const path = require('path');

const empleadosPath = path.join(__dirname, '../../data/empleados.json');
const sectoresRolesPath = path.join(__dirname, '../../data/sectores_roles.json');

async function leerEmpleados() {
  const data = await fs.readFile(empleadosPath, 'utf-8');
  return JSON.parse(data);
}

async function guardarEmpleados(empleados) {
  await fs.writeFile(empleadosPath, JSON.stringify(empleados, null, 2));
}

async function leerSectoresRoles() {
  const data = await fs.readFile(sectoresRolesPath, 'utf-8');
  return JSON.parse(data);
}

module.exports = {
  leerEmpleados,
  guardarEmpleados,
  leerSectoresRoles,
};