/**
 * Servidor MSW para Node.js (usado en tests)
 */
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * Configura un servidor MSW para interceptar peticiones en el entorno de Node.js
 * Usado durante la ejecución de tests con Jest
 */
export const server = setupServer(...handlers);
