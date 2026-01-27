/**
 * Configuración de tests para Jest
 * 
 * Este archivo se ejecuta antes de cada test y configura el entorno de testing,
 * incluyendo MSW para mockear peticiones HTTP.
 */
import '@testing-library/jest-dom';
import { server } from './mocks/server';

/**
 * Configurar MSW antes de todos los tests
 * Inicia el servidor de mocks para interceptar peticiones HTTP
 */
beforeAll(() => {
  console.log('[Test Setup] Starting MSW server');
  server.listen({ 
    onUnhandledRequest: 'warn' // Advertir sobre peticiones no mockeadas
  });
});

/**
 * Resetear handlers después de cada test
 * Asegura que los mocks de un test no afecten a otros
 */
afterEach(() => {
  server.resetHandlers();
});

/**
 * Cerrar el servidor después de todos los tests
 * Limpieza de recursos
 */
afterAll(() => {
  console.log('[Test Setup] Stopping MSW server');
  server.close();
});

/**
 * Mock de console.error para evitar spam en tests
 * Solo muestra errores reales, no warnings esperados de React
 */
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
