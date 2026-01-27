/**
 * Cliente HTTP base para todas las peticiones a APIs
 * Implementa gestión de errores HTTP, timeouts, retry logic y AbortController
 * 
 * @class APIClient
 * @description Cliente HTTP robusto con manejo de errores HTTP (4xx, 5xx),
 * detección de falta de conexión, timeouts configurables y cancelación de peticiones
 */
class APIClient {
  /**
   * Crea una instancia de APIClient
   * @param {string} baseURL - URL base de la API
   * @param {Object} defaultHeaders - Headers por defecto para todas las peticiones
   * @param {number} timeout - Timeout en ms (default: 30000)
   * @param {number} maxRetries - Número máximo de reintentos (default: 2)
   */
  constructor(baseURL, defaultHeaders = {}, timeout = 30000, maxRetries = 2) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
    this.timeout = timeout;
    this.maxRetries = maxRetries;
  }

  /**
   * Realiza una petición HTTP con manejo completo de errores
   * @param {string} endpoint - Endpoint a consumir
   * @param {Object} options - Opciones de fetch
   * @param {AbortSignal} options.signal - Signal para cancelar la petición
   * @returns {Promise<{data: any, error: string|null}>}
   * 
   * @throws {NetworkError} - Cuando no hay conexión a internet
   * @throws {TimeoutError} - Cuando la petición excede el timeout
   * @throws {HTTPError} - Errores HTTP 4xx, 5xx
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const { signal: externalSignal, ...restOptions } = options;
    
    // Timeout automático
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    // Combinar señales de abort (externa + timeout)
    if (externalSignal) {
      externalSignal.addEventListener('abort', () => controller.abort());
    }

    const config = {
      mode: 'cors',
      cache: 'no-cache',
      signal: controller.signal,
      ...restOptions,
      headers: {
        ...this.defaultHeaders,
        ...restOptions.headers
      }
    };

    try {
      console.log(`[APIClient] Fetching: ${url}`);
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      console.log(`[APIClient] Response status: ${response.status} ${response.statusText}`);
      
      // Manejo específico de códigos HTTP
      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'No error details');
        
        // Errores 4xx - Errores del cliente
        if (response.status >= 400 && response.status < 500) {
          throw new HTTPError(
            `Error del cliente ${response.status}: ${response.statusText}`,
            response.status,
            errorBody
          );
        }
        
        // Errores 5xx - Errores del servidor
        if (response.status >= 500) {
          throw new HTTPError(
            `Error del servidor ${response.status}: ${response.statusText}`,
            response.status,
            errorBody
          );
        }
      }

      const data = await response.json();
      console.log(`[APIClient] Data received from ${endpoint}:`, 
        Array.isArray(data) ? `${data.length} items` : typeof data);
      
      return { data, error: null };
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Error de abort/timeout
      if (error.name === 'AbortError') {
        console.error(`[APIClient] Request aborted/timeout: ${url}`);
        return { 
          data: null, 
          error: 'La petición fue cancelada o excedió el tiempo límite' 
        };
      }
      
      // Error de red (sin conexión)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error(`[APIClient] Network error: Sin conexión a internet`);
        return { 
          data: null, 
          error: 'Sin conexión a internet. Por favor, verifica tu conexión.' 
        };
      }
      
      // Otros errores HTTP
      if (error instanceof HTTPError) {
        console.error(`[APIClient] HTTP Error [${error.status}]:`, error.message);
        return { data: null, error: error.message };
      }
      
      // Error desconocido
      console.error(`[APIClient] Unknown error [${endpoint}]:`, error);
      return { data: null, error: error.message || 'Error desconocido' };
    }
  }

  /**
   * Petición GET con reintentos automáticos
   * @param {string} endpoint - Endpoint a consumir
   * @param {Object} headers - Headers adicionales
   * @param {AbortSignal} signal - Signal para cancelar la petición
   * @param {number} retryCount - Contador interno de reintentos
   * @returns {Promise<{data: any, error: string|null}>}
   */
  async get(endpoint, headers = {}, signal = null, retryCount = 0) {
    const result = await this.request(endpoint, { 
      method: 'GET', 
      headers,
      signal 
    });
    
    // Retry logic para errores 5xx o errores de red
    if (result.error && retryCount < this.maxRetries) {
      const shouldRetry = result.error.includes('servidor') || 
                          result.error.includes('conexión');
      
      if (shouldRetry) {
        console.log(`[APIClient] Retry ${retryCount + 1}/${this.maxRetries} for ${endpoint}`);
        await this._delay(Math.pow(2, retryCount) * 1000); // Exponential backoff
        return this.get(endpoint, headers, signal, retryCount + 1);
      }
    }
    
    return result;
  }

  /**
   * Petición POST
   * @param {string} endpoint - Endpoint a consumir
   * @param {Object} body - Cuerpo de la petición
   * @param {Object} headers - Headers adicionales
   * @param {AbortSignal} signal - Signal para cancelar la petición
   * @returns {Promise<{data: any, error: string|null}>}
   */
  async post(endpoint, body, headers = {}, signal = null) {
    return this.request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(body),
      signal
    });
  }

  /**
   * Delay helper para reintentos
   * @private
   * @param {number} ms - Milisegundos de espera
   * @returns {Promise<void>}
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Error HTTP personalizado con información del código de estado
 */
class HTTPError extends Error {
  /**
   * @param {string} message - Mensaje de error
   * @param {number} status - Código HTTP
   * @param {string} body - Cuerpo de la respuesta de error
   */
  constructor(message, status, body) {
    super(message);
    this.name = 'HTTPError';
    this.status = status;
    this.body = body;
  }
}

// Instancias de clientes para diferentes APIs
export const hpAPIClient = new APIClient('https://hp-api.onrender.com/api');

export const catAPIClient = new APIClient('https://api.thecatapi.com/v1', {
  'x-api-key': process.env.REACT_APP_CAT_API_KEY || ''
});

export default APIClient;
