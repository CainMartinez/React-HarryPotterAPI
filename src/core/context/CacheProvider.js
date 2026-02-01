import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Character } from '../models/Character';
import { Spell } from '../models/Spell';

/**
 * Contexto para el sistema de caché
 */
const CacheContext = createContext(null);

const STORAGE_KEY = 'hp-app-cache';
const STORAGE_VERSION = '1.0';

/**
 * Reconstruye objetos desde JSON plano a clases
 */
function reconstructObjects(data, key) {
  if (!data || !Array.isArray(data)) return data;
  
  try {
    // Reconstruir personajes
    if (key.startsWith('characters:')) {
      return data.map(item => new Character(item));
    }
    
    // Reconstruir hechizos
    if (key.startsWith('spells:')) {
      return data.map(item => new Spell(item));
    }
    
    // Para otros tipos, devolver como están
    return data;
  } catch (error) {
    console.error('[CacheProvider] Error reconstructing objects:', error);
    return data;
  }
}

/**
 * Proveedor de caché con almacenamiento en memoria y persistencia en localStorage
 * 
 * @component
 * @description
 * - Caché en memoria (Map) para acceso ultrarrápido
 * - Persistencia en localStorage para mantener datos entre sesiones
 * - TTL (Time To Live) configurable por entrada
 * - Limpieza automática de entradas expiradas
 * - Versionado de caché para invalidar datos antiguos
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos
 * 
 * @example
 * // Usar en App.js
 * <CacheProvider>
 *   <App />
 * </CacheProvider>
 */
export function CacheProvider({ children }) {
  const [cache, setCache] = useState(() => {
    // Cargar caché desde localStorage al iniciar
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Verificar versión del caché
        if (parsed.version === STORAGE_VERSION) {
          console.log('[CacheProvider] Loaded cache from localStorage:', Object.keys(parsed.data).length, 'entries');
          return new Map(Object.entries(parsed.data));
        } else {
          console.log('[CacheProvider] Cache version mismatch, clearing old cache');
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('[CacheProvider] Error loading cache from localStorage:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
    
    return new Map();
  });

  /**
   * Persiste el caché en localStorage
   */
  const persistCache = useCallback((cacheMap) => {
    try {
      const data = Object.fromEntries(cacheMap.entries());
      const toStore = {
        version: STORAGE_VERSION,
        timestamp: Date.now(),
        data
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      console.log('[CacheProvider] Cache persisted to localStorage');
    } catch (error) {
      console.error('[CacheProvider] Error persisting cache:', error);
      // Si falla (ej: QuotaExceededError), limpiar storage
      if (error.name === 'QuotaExceededError') {
        console.warn('[CacheProvider] localStorage quota exceeded, clearing cache');
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  /**
   * Obtener valor del caché
   * @param {string} key - Clave del caché
   * @returns {any|null} - Valor almacenado o null si no existe o expiró
   */
  const get = useCallback((key) => {
    const entry = cache.get(key);
    if (!entry) return null;

    // Verificar si ha expirado
    const now = Date.now();
    if (entry.expires && entry.expires < now) {
      console.log(`[CacheProvider] Cache expired: ${key}`);
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(key);
        persistCache(newCache);
        return newCache;
      });
      return null;
    }

    console.log(`[CacheProvider] Cache hit: ${key}`);
    
    // Reconstruir objetos si es necesario
    const reconstructed = reconstructObjects(entry.data, key);
    return reconstructed;
  }, [cache, persistCache]);

  /**
   * Guardar en caché con TTL opcional
   * @param {string} key - Clave única
   * @param {any} data - Datos a almacenar
   * @param {number|null} ttl - Time to live en milisegundos (null = sin expiración)
   */
  const set = useCallback((key, data, ttl = null) => {
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.set(key, {
        data,
        expires: ttl ? Date.now() + ttl : null,
        timestamp: Date.now()
      });
      persistCache(newCache);
      console.log(`[CacheProvider] Cache set: ${key} (TTL: ${ttl || 'infinite'}ms)`);
      return newCache;
    });
  }, [persistCache]);

  /**
   * Eliminar una entrada específica
   * @param {string} key - Clave a eliminar
   */
  const remove = useCallback((key) => {
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(key);
      persistCache(newCache);
      console.log(`[CacheProvider] Cache removed: ${key}`);
      return newCache;
    });
  }, [persistCache]);

  /**
   * Limpiar todo el caché (memoria + localStorage)
   */
  const clear = useCallback(() => {
    setCache(new Map());
    localStorage.removeItem(STORAGE_KEY);
    console.log('[CacheProvider] Cache cleared completely');
  }, []);

  /**
   * Verificar si existe y no ha expirado
   * @param {string} key - Clave a verificar
   * @returns {boolean}
   */
  const has = useCallback((key) => {
    return get(key) !== null;
  }, [get]);

  /**
   * Limpieza automática de entradas expiradas cada 5 minutos
   */
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      console.log('[CacheProvider] Running cleanup of expired entries');
      const now = Date.now();
      let hasChanges = false;
      
      setCache(prev => {
        const newCache = new Map(prev);
        
        for (const [key, entry] of newCache.entries()) {
          if (entry.expires && entry.expires < now) {
            newCache.delete(key);
            hasChanges = true;
            console.log(`[CacheProvider] Cleaned up expired entry: ${key}`);
          }
        }
        
        if (hasChanges) {
          persistCache(newCache);
        }
        
        return hasChanges ? newCache : prev;
      });
    }, 5 * 60 * 1000); // Cada 5 minutos

    return () => clearInterval(cleanupInterval);
  }, [persistCache]);

  const value = {
    get,
    set,
    remove,
    clear,
    has,
    size: cache.size
  };

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
}

/**
 * Hook para acceder al sistema de caché
 * @returns {{
 *   get: (key: string) => any,
 *   set: (key: string, data: any, ttl?: number) => void,
 *   remove: (key: string) => void,
 *   clear: () => void,
 *   has: (key: string) => boolean,
 *   size: number
 * }}
 * @throws {Error} Si se usa fuera de CacheProvider
 */
export function useCache() {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache debe usarse dentro de CacheProvider');
  }
  return context;
}
