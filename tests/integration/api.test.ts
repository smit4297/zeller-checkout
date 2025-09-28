import request from 'supertest';
import app from '../../src/app';

describe('API Integration Tests', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.service).toBe('Zeller Checkout System');
    });
  });

  describe('Products API', () => {
    it('should get all products', async () => {
      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body.products).toHaveLength(4);
      expect(response.body.count).toBe(4);
    });

    it('should get product by SKU', async () => {
      const response = await request(app).get('/api/products/ipd');

      expect(response.status).toBe(200);
      expect(response.body.product.sku).toBe('ipd');
      expect(response.body.product.name).toBe('Super iPad');
    });

    it('should return 400 for invalid SKU', async () => {
      const response = await request(app).get('/api/products/invalid');

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Validation failed');
    });
  });

  describe('Pricing Rules API', () => {
    it('should get pricing rules', async () => {
      const response = await request(app).get('/api/pricing-rules');

      expect(response.status).toBe(200);
      expect(response.body.pricingRules).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });
  });

  describe('Checkout API', () => {
    let sessionId: string;

    beforeEach(async () => {
      const response = await request(app).post('/api/checkout');
      sessionId = response.body.sessionId;
    });

    it('should create checkout session', async () => {
      const response = await request(app).post('/api/checkout');

      expect(response.status).toBe(201);
      expect(response.body.sessionId).toBeDefined();
      expect(response.body.message).toBe('Checkout session created successfully');
    });

    it('should scan item successfully', async () => {
      const response = await request(app)
        .post(`/api/checkout/${sessionId}/scan`)
        .send({ sku: 'ipd' });

      expect(response.status).toBe(200);
      expect(response.body.cartItems).toHaveLength(1);
      expect(response.body.cartItems[0].product.sku).toBe('ipd');
    });

    it('should return 400 for invalid SKU when scanning', async () => {
      const response = await request(app)
        .post(`/api/checkout/${sessionId}/scan`)
        .send({ sku: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Validation failed');
    });

    it('should return 400 for invalid session UUID when scanning', async () => {
      const response = await request(app)
        .post('/api/checkout/invalid-session/scan')
        .send({ sku: 'ipd' });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Validation failed');
    });

    it('should get total correctly', async () => {
      await request(app)
        .post(`/api/checkout/${sessionId}/scan`)
        .send({ sku: 'ipd' });

      const response = await request(app).get(`/api/checkout/${sessionId}/total`);

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(549.99);
      expect(response.body.cartItems).toHaveLength(1);
    });

    it('should delete session successfully', async () => {
      const response = await request(app).delete(`/api/checkout/${sessionId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Checkout session deleted successfully');
    });
  });

  describe('Example Scenarios', () => {
    let sessionId: string;

    beforeEach(async () => {
      const response = await request(app).post('/api/checkout');
      sessionId = response.body.sessionId;
    });

    it('should handle scenario: atv, atv, atv, vga → $249.00', async () => {
      await request(app).post(`/api/checkout/${sessionId}/scan`).send({ sku: 'atv' });
      await request(app).post(`/api/checkout/${sessionId}/scan`).send({ sku: 'atv' });
      await request(app).post(`/api/checkout/${sessionId}/scan`).send({ sku: 'atv' });
      await request(app).post(`/api/checkout/${sessionId}/scan`).send({ sku: 'vga' });

      const response = await request(app).get(`/api/checkout/${sessionId}/total`);

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(249.00);
    });

    it('should handle scenario: atv, ipd, ipd, atv, ipd, ipd, ipd → $2718.95', async () => {
      await request(app).post(`/api/checkout/${sessionId}/scan`).send({ sku: 'atv' });
      await request(app).post(`/api/checkout/${sessionId}/scan`).send({ sku: 'ipd' });
      await request(app).post(`/api/checkout/${sessionId}/scan`).send({ sku: 'ipd' });
      await request(app).post(`/api/checkout/${sessionId}/scan`).send({ sku: 'atv' });
      await request(app).post(`/api/checkout/${sessionId}/scan`).send({ sku: 'ipd' });
      await request(app).post(`/api/checkout/${sessionId}/scan`).send({ sku: 'ipd' });
      await request(app).post(`/api/checkout/${sessionId}/scan`).send({ sku: 'ipd' });

      const response = await request(app).get(`/api/checkout/${sessionId}/total`);

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(2718.95);
    });
  });
});