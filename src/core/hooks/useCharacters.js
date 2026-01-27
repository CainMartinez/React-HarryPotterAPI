import { useFetch } from './useFetch';
import { CharacterService } from '../services/CharacterService';

/**
 * Hook para obtener todos los personajes con caché
 */
export function useCharacters() {
  return useFetch(
    () => CharacterService.getAll(),
    'characters:all',
    10 * 60 * 1000 // 10 minutos
  );
}

/**
 * Hook para obtener estudiantes con caché
 */
export function useStudents() {
  return useFetch(
    () => CharacterService.getStudents(),
    'characters:students',
    10 * 60 * 1000
  );
}

/**
 * Hook para obtener staff con caché
 */
export function useStaff() {
  return useFetch(
    () => CharacterService.getStaff(),
    'characters:staff',
    10 * 60 * 1000
  );
}

/**
 * Hook para obtener personajes por casa
 */
export function useCharactersByHouse(houseName) {
  return useFetch(
    () => CharacterService.getByHouse(houseName),
    `characters:house:${houseName}`,
    10 * 60 * 1000,
    [houseName]
  );
}
