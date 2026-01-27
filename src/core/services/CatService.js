import { catAPIClient } from './apiClient';
import { CatDTO } from '../dtos/CatDTO';

/**
 * Servicio para gestionar peticiones relacionadas con gatos
 */
export class CatService {
  static async getCats(limit = 10) {
    const { data, error } = await catAPIClient.get(`/images/search?limit=${limit}&has_breeds=1`);
    if (error) throw new Error(error);
    return CatDTO.fromAPIArray(data);
  }
}
