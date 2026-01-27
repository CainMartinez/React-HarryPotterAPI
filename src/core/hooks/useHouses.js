import { useFetch } from './useFetch';
import { HouseService } from '../services/HouseService';

/**
 * Hook para obtener todas las casas
 */
export function useHouses() {
  return useFetch(
    () => HouseService.getAll(),
    'houses:all',
    30 * 60 * 1000 // 30 minutos (datos estáticos)
  );
}
