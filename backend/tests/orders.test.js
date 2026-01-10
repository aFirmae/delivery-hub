const request = require('supertest');
const app = require('../app');
const db = require('../db/db');

describe('Order Endpoints', () => {
  let token;
  let senderId;

  const testUser = {
    email: `test_order_${Date.now()}@example.com`,
    password: 'password123',
    name: 'Test Order User',
    phone: '0987654321',
    user_type: 'sender'
  };

  beforeAll(async () => {
    // Register temporary user
    const res = await request(app)
      .post('/auth/register')
      .send(testUser);
      
    token = res.body.token;
    senderId = res.body.id;
  });

  it('should create a new order', async () => {
    const res = await request(app)
      .post('/orders/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        package_description: 'Test Package',
        pickup_address: '123 Pickup St',
        delivery_address: '456 Dropoff Ave',
        amount: 50.00
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toEqual('pending');
  });

  it('should return error for negative amount', async () => {
    const res = await request(app)
      .post('/orders/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        package_description: 'Test Package',
        pickup_address: '123 Pickup St',
        delivery_address: '456 Dropoff Ave',
        amount: -10
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Amount cannot be negative');
  });

  it('should list orders for the sender', async () => {
      // Create one more order
      await request(app)
      .post('/orders/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        package_description: 'Another Package',
        pickup_address: 'A',
        delivery_address: 'B',
        amount: 20
      });

      const res = await request(app)
        .get('/orders')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.orders.length).toBeGreaterThanOrEqual(2);
      // Verify all orders belong to this sender
      res.body.orders.forEach(order => {
          expect(order.sender_id).toEqual(senderId);
      });
  });

  afterAll(async () => {
    await db.end();
  });
});
