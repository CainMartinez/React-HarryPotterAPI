import { hpAPIClient } from './apiClient';
import { CharacterDTO } from '../dtos/CharacterDTO';

/**
 * Servicio para gestionar peticiones relacionadas con personajes
 */
export class CharacterService {
  static async getAll() {
    const { data, error } = await hpAPIClient.get('/characters');
    if (error) throw new Error(error);
    return CharacterDTO.fromAPIArray(data);
  }

  static async getById(id) {
    const { data, error } = await hpAPIClient.get(`/character/${id}`);
    if (error) throw new Error(error);
    return CharacterDTO.fromAPI(data);
  }

  static async getStudents() {
    const { data, error } = await hpAPIClient.get('/characters/students');
    if (error) throw new Error(error);
    return CharacterDTO.fromAPIArray(data);
  }

  static async getStaff() {
    const { data, error } = await hpAPIClient.get('/characters/staff');
    if (error) throw new Error(error);
    return CharacterDTO.fromAPIArray(data);
  }

  static async getByHouse(houseName) {
    const { data, error } = await hpAPIClient.get(`/characters/house/${houseName.toLowerCase()}`);
    if (error) throw new Error(error);
    return CharacterDTO.fromAPIArray(data);
  }
}
