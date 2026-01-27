import { useFetch } from './useFetch';
import { SpellService } from '../services/SpellService';

/**
 * Hook para obtener todos los hechizos
 */
export function useSpells() {
  return useFetch(
    () => SpellService.getAll(),
    'spells:all',
    15 * 60 * 1000 // 15 minutos
  );
}
