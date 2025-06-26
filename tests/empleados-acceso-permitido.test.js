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
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Acceso permitido - RRHH', () => {
  test('RRHH puede crear un empleado', async () => {
    const res = await request(app)
      .post('/empleados')
      .set('Authorization', `Bearer ${tokenRRHH}`)
      .send({
        nombre: 'Empleado',
        apellido: 'Nuevo',
        usuario: 'empleadonuevo',
        password: 'clave123',
        sector: 'Contabilidad',
        rol: 'Auxiliar contable'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.usuario).toBe('empleadonuevo');
    empleadoCreadoId = res.body._id;
  });

  test('RRHH puede editar un empleado', async () => {
    const res = await request(app)
      .put(`/empleados/${empleadoCreadoId}`)
      .set('Authorization', `Bearer ${tokenRRHH}`)
      .send({
        nombre: 'Editado',
        apellido: 'Modificado',
        usuario: 'empleadonuevo',
        sector: 'Contabilidad',
        rol: 'Auxiliar contable'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Editado');
    expect(res.body.apellido).toBe('Modificado');
  });

  test('RRHH puede eliminar un empleado', async () => {
    const res = await request(app)
      .delete(`/empleados/${empleadoCreadoId}`)
      .set('Authorization', `Bearer ${tokenRRHH}`);

    expect(res.statusCode).toBe(200);
  });
});