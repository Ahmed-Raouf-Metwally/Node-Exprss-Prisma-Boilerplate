const request = require('supertest');
const app = require('../src/app');

describe('Health Check API', () => {
  describe('GET /api/status', () => {
    it('should return 200 and server status', async () => {
      const response = await request(app).get('/api/status').expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('code', 200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status', 'healthy');
      expect(response.body.data).toHaveProperty('environment');
      expect(response.body.data).toHaveProperty('timestamp');
    });

    it('should have correct response structure', async () => {
      const response = await request(app).get('/api/status');

      expect(response.body.success).toBe(true);
      expect(response.body.code).toBe(200);
      expect(typeof response.body.message).toBe('string');
      expect(typeof response.body.data).toBe('object');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app).get('/api/non-existent-route').expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('code', 404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Cannot find');
    });
  });
});
