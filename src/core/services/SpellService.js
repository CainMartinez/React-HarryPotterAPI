import { hpAPIClient } from './apiClient';
import { SpellDTO } from '../dtos/SpellDTO';

/**
 * Servicio para gestionar peticiones relacionadas con hechizos
 */
export class SpellService {
  static async getAll() {
    const { data, error } = await hpAPIClient.get('/spells');
    if (error) throw new Error(error);
    return SpellDTO.fromAPIArray(data);
  }
}
