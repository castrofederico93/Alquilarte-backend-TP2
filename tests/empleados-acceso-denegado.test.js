const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

let tokenComun;
let idEmpleadoComun;

beforeAll(async () => {
  const res = await request(app)
    .post('/login')
    .set('Accept', 'application/json')
    .send({ usuario: 'mperez', password: 'maria123' });

  tokenComun = res.body.token;

  // Obtener ID propio
  const me = await request(app)
    .get('/empleados')
    .set('Authorization', `Bearer ${tokenComun}`);
  
  idEmpleadoComun = me.body[0]._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Control de acceso - Empleados', () => {
  test('Empleado común NO puede crear un empleado', async () => {
    const res = await request(app)
      .post('/empleados')
      .set('Authorization', `Bearer ${tokenComun}`)
      .send({
        nombre: 'Test',
        apellido: 'Usuario',
        usuario: 'testuser',
        password: 'abc123',
        sector: 'Ventas',
        rol: 'Agente inmobiliario'
      });

    expect(res.statusCode).toBe(403);
  });

  test('Empleado común NO puede eliminar un empleado', async () => {
    const res = await request(app)
      .delete('/empleados/000000000000000000000000')
      .set('Authorization', `Bearer ${tokenComun}`);

    expect(res.statusCode).toBe(403);
  });

  test('Empleado común solo puede ver su propio perfil', async () => {
    const res = await request(app)
      .get('/empleados')
      .set('Authorization', `Bearer ${tokenComun}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].usuario).toBe('mperez');

    const otros = res.body.filter(emp => emp.usuario !== 'mperez');
    expect(otros.length).toBe(0);
  });

  test('Empleado común NO puede editar su nombre, sector o rol', async () => {
    const res = await request(app)
      .put(`/empleados/${idEmpleadoComun}`)
      .set('Authorization', `Bearer ${tokenComun}`)
      .send({
        nombre: 'NuevoNombre',
        apellido: 'Apellido',
        sector: 'Contabilidad',
        rol: 'Jefe'
      });

    expect(res.statusCode).toBe(403);
  });

  test('Empleado común PUEDE cambiar su contraseña', async () => {
    // Cambiar la contraseña
    const res = await request(app)
      .put(`/empleados/${idEmpleadoComun}`)
      .set('Authorization', `Bearer ${tokenComun}`)
      .send({
        passwordActual: 'maria123',
        passwordNueva: 'maria456'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.usuario).toBe('mperez');

    // Restaurar la contraseña original para futuros tests
    await request(app)
      .put(`/empleados/${idEmpleadoComun}`)
      .set('Authorization', `Bearer ${tokenComun}`)
      .send({
        passwordActual: 'maria456',
        passwordNueva: 'maria123'
      });
  });
});