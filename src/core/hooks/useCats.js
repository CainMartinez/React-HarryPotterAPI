import { useState, useCallback } from 'react';
import { CatService } from '../services/CatService';

/**
 * Hook para obtener gatos con paginación
 * No usa caché porque cada llamada debe traer gatos diferentes
 */
export function useCats(initialLimit = 10) {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const loadCats = useCallback(async (append = false) => {
    try {
      setLoading(true);
      setError(null);

      const newCats = await CatService.getCats(initialLimit);
      
      setCats(prev => append ? [...prev, ...newCats] : newCats);
      setHasMore(newCats.length === initialLimit);
      setLoading(false);
      
      return newCats;
    } catch (err) {
      setError(err.message || 'Error al cargar gatos');
      setLoading(false);
      throw err;
    }
  }, [initialLimit]);

  const loadMore = useCallback(() => loadCats(true), [loadCats]);
  const refresh = useCallback(() => loadCats(false), [loadCats]);

  return { cats, loading, error, loadMore, refresh, hasMore };
}
