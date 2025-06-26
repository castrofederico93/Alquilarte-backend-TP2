const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Autenticación y seguridad', () => {
  test('Login exitoso devuelve token', async () => {
    const res = await request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({ usuario: 'fcastro', password: 'federico1234' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.mensaje).toMatch(/exitoso/i);
  });

  test('Login con contraseña incorrecta devuelve 400', async () => {
    const res = await request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({ usuario: 'fcastro', password: 'incorrecta' });

    expect(res.statusCode).toBe(400);
  });

  test('Login con usuario inexistente devuelve 400', async () => {
    const res = await request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({ usuario: 'noexiste', password: 'algo' });

    expect(res.statusCode).toBe(400);
  });

  test('Acceso sin token devuelve 401', async () => {
    const res = await request(app).get('/empleados');
    expect(res.statusCode).toBe(401);
  });

  test('Acceso con token inválido devuelve 403', async () => {
    const res = await request(app)
      .get('/empleados')
      .set('Authorization', 'Bearer token_falso');

    expect(res.statusCode).toBe(403);
  });
});