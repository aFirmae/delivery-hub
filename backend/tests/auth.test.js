const request = require('supertest');
const app = require('../app');
const db = require('../db/db');

describe('Auth Endpoints', () => {
    
  const testUser = {
    email: `test_auth_${Date.now()}@example.com`,
    password: 'password123',
    name: 'Test Auth User',
    phone: '1234567890',
    user_type: 'sender'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toEqual(testUser.email);
  });

  it('should not register user with existing email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser);
      
    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toEqual('Email already exists');
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });

    expect(res.statusCode).toEqual(401);
  });
  
  afterAll(async () => {
    await db.end();
  });
});
