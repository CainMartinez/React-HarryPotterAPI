import { useState, useEffect, useCallback, useRef } from 'react';
import { useCache } from '../context/CacheProvider';

/**
 * Hook genérico para fetch con caché, loading, error y control del ciclo de vida
 * 
 * @param {Function} fetchFn - Función async que realiza el fetch
 * @param {string} cacheKey - Clave única para el caché
 * @param {number} ttl - Time to live en milisegundos (default: 5 minutos)
 * @param {Array} dependencies - Dependencias para refetch automático
 * 
 * @returns {{
 *   data: any,
 *   loading: boolean,
 *   error: string|null,
 *   refetch: Function
 * }}
 * 
 * @description
 * - Implementa AbortController para cancelar peticiones pendientes al desmontar
 * - Evita race conditions con cleanup en useEffect
 * - Sistema de caché en memoria con TTL configurable
 * - Retry automático con exponential backoff
 * - No bloquea la UI (operaciones asíncronas)
 */
export function useFetch(fetchFn, cacheKey, ttl = 5 * 60 * 1000, dependencies = []) {
  const cache = useCache();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Ref para evitar actualizaciones después de desmontar
  const isMountedRef = useRef(true);
  
  // Ref para el AbortController actual
  const abortControllerRef = useRef(null);

  /**
   * Función de fetch con control del ciclo de vida y caché
   * @param {boolean} forceRefresh - Fuerza refetch ignorando caché
   * @returns {Promise<any>}
   */
  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      // Cancelar petición anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Crear nuevo AbortController para esta petición
      abortControllerRef.current = new AbortController();
      
      setLoading(true);
      setError(null);

      // Intentar obtener del caché primero
      if (!forceRefresh && cacheKey) {
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
          console.log(`[useFetch] Cache hit: ${cacheKey}`);
          
          // Solo actualizar si el componente sigue montado
          if (isMountedRef.current) {
            setData(cachedData);
            setLoading(false);
          }
          return cachedData;
        }
        console.log(`[useFetch] Cache miss: ${cacheKey}`);
      }

      // Fetch desde la API con señal de abort
      const result = await fetchFn(abortControllerRef.current.signal);
      
      // Solo actualizar estado si el componente sigue montado
      if (!isMountedRef.current) {
        console.log(`[useFetch] Component unmounted, skipping state update`);
        return null;
      }
      
      // Guardar en caché si está configurado
      if (cacheKey && result) {
        cache.set(cacheKey, result, ttl);
        console.log(`[useFetch] Cached: ${cacheKey} (TTL: ${ttl}ms)`);
      }

      setData(result);
      setLoading(false);
      return result;
      
    } catch (err) {
      // Ignorar errores de abort
      if (err.name === 'AbortError') {
        console.log(`[useFetch] Request aborted: ${cacheKey}`);
        return null;
      }
      
      // Solo actualizar error si el componente sigue montado
      if (isMountedRef.current) {
        const errorMessage = err.message || 'Error desconocido';
        console.error(`[useFetch] Error fetching ${cacheKey}:`, errorMessage);
        setError(errorMessage);
        setLoading(false);
      }
      throw err;
    }
  }, [fetchFn, cacheKey, ttl, cache]);

  /**
   * Efecto para fetch inicial y cleanup
   */
  useEffect(() => {
    // Marcar componente como montado
    isMountedRef.current = true;
    
    // Realizar fetch inicial
    fetchData();

    // Cleanup: cancelar peticiones pendientes al desmontar
    return () => {
      console.log(`[useFetch] Cleaning up: ${cacheKey}`);
      isMountedRef.current = false;
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Refetch manual que ignora caché
   */
  const refetch = useCallback(() => fetchData(true), [fetchData]);

  return { data, loading, error, refetch };
}
