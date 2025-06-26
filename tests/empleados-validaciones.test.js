const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

let tokenRRHH;
let empleadoCreadoId;

beforeAll(async () => {
  const res = await request(app)
    .post('/login')
    .set('Accept', 'application/json')
    .send({ usuario: 'fcastro', password: 'federico1234' });

  tokenRRHH = res.body.token;

  // Crear un empleado para los tests negativos
  const nuevo = await request(app)
    .post('/empleados')
    .set('Authorization', `Bearer ${tokenRRHH}`)
    .send({
      nombre: 'Empleado',
      apellido: 'Test',
      usuario: 'empleadotest',
      password: 'clave123',
      sector: 'Ventas',
      rol: 'Agente inmobiliario'
    });

  empleadoCreadoId = nuevo.body._id;
});

afterAll(async () => {
  // Eliminar empleado de prueba
  await request(app)
    .delete(`/empleados/${empleadoCreadoId}`)
    .set('Authorization', `Bearer ${tokenRRHH}`);

  await mongoose.connection.close();
});

describe('Validaciones en empleados', () => {
  test('No se puede crear un usuario con nombre duplicado', async () => {
    const res = await request(app)
      .post('/empleados')
      .set('Authorization', `Bearer ${tokenRRHH}`)
      .send({
        nombre: 'Empleado',
        apellido: 'Test',
        usuario: 'empleadotest', // mismo usuario
        password: 'clave123',
        sector: 'Ventas',
        rol: 'Agente inmobiliario'
      });

    expect(res.statusCode).toBe(400);
  });

  test('Editar con ID mal formado devuelve 400', async () => {
    const res = await request(app)
      .put('/empleados/abc123')
      .set('Authorization', `Bearer ${tokenRRHH}`)
      .send({ nombre: 'X' });

    expect(res.statusCode).toBe(400);
  });

  test('Eliminar con ID inexistente devuelve 404', async () => {
    const res = await request(app)
      .delete('/empleados/000000000000000000000999')
      .set('Authorization', `Bearer ${tokenRRHH}`);

    expect(res.statusCode).toBe(404);
  });
});