/**
 * Tests unitarios para apiClient
 * 
 * Verifica:
 * - Peticiones GET exitosas
 * - Manejo de errores HTTP (4xx, 5xx)
 * - Manejo de timeouts
 * - Manejo de falta de conexión
 * - Retry logic con exponential backoff
 */
import APIClient from '../apiClient';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

describe('APIClient', () => {
  let client;

  beforeEach(() => {
    client = new APIClient('https://hp-api.onrender.com/api', {}, 5000, 2);
  });

  describe('request()', () => {
    test('debe realizar peticiones GET exitosas', async () => {
      const { data, error } = await client.get('/characters');
      
      expect(error).toBeNull();
      expect(data).toHaveLength(2);
      expect(data[0]).toHaveProperty('name', 'Harry Potter');
    });

    test('debe manejar errores 404', async () => {
      const { data, error } = await client.get('/notfound');
      
      expect(data).toBeNull();
      expect(error).toContain('Error del cliente 404');
    });

    test('debe manejar errores 500', async () => {
      const { data, error } = await client.get('/servererror');
      
      expect(data).toBeNull();
      expect(error).toContain('Error del servidor 500');
    });

    test('debe cancelar peticiones con AbortController', async () => {
      const controller = new AbortController();
      
      // Cancelar inmediatamente
      controller.abort();
      
      const { data, error } = await client.request('/characters', {
        signal: controller.signal
      });
      
      expect(data).toBeNull();
      expect(error).toContain('cancelada');
    });

    test('debe aplicar timeout a peticiones lentas', async () => {
      const shortTimeoutClient = new APIClient(
        'https://hp-api.onrender.com/api', 
        {}, 
        100 // 100ms timeout
      );
      
      // Mock de endpoint lento
      server.use(
        http.get('https://hp-api.onrender.com/api/slow', async () => {
          await new Promise(resolve => setTimeout(resolve, 200));
          return HttpResponse.json({ data: 'slow' });
        })
      );
      
      const { data, error } = await shortTimeoutClient.get('/slow');
      
      expect(data).toBeNull();
      expect(error).toContain('cancelada');
    }, 10000);
  });

  describe('get() with retry', () => {
    test('debe reintentar peticiones fallidas con errores de servidor', async () => {
      let attemptCount = 0;
      
      // Mock que falla 2 veces y luego tiene éxito
      server.use(
        http.get('https://hp-api.onrender.com/api/flaky', () => {
          attemptCount++;
          if (attemptCount < 3) {
            return new HttpResponse(null, { status: 500 });
          }
          return HttpResponse.json({ success: true });
        })
      );
      
      const { data, error } = await client.get('/flaky');
      
      expect(attemptCount).toBe(3);
      expect(error).toBeNull();
      expect(data).toEqual({ success: true });
    }, 15000);

    test('no debe reintentar errores 4xx', async () => {
      let attemptCount = 0;
      
      server.use(
        http.get('https://hp-api.onrender.com/api/bad-request', () => {
          attemptCount++;
          return new HttpResponse(null, { status: 400 });
        })
      );
      
      const { data, error } = await client.get('/bad-request');
      
      expect(attemptCount).toBe(1); // Solo 1 intento, no retry
      expect(data).toBeNull();
      expect(error).toContain('Error del cliente 400');
    });
  });

  describe('post()', () => {
    test('debe realizar peticiones POST con body', async () => {
      server.use(
        http.post('https://hp-api.onrender.com/api/test', async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({ received: body });
        })
      );
      
      const testData = { name: 'Test', value: 123 };
      const { data, error } = await client.post('/test', testData);
      
      expect(error).toBeNull();
      expect(data.received).toEqual(testData);
    });
  });
});
