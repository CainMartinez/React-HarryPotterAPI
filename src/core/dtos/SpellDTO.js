import { Spell } from '../models/Spell';

/**
 * DTO para transformar datos de la API a modelo Spell
 */
export class SpellDTO {
  static fromAPI(data) {
    if (!data) return null;

    return new Spell({
      id: data.id,
      name: data.name,
      description: data.description
    });
  }

  static fromAPIArray(dataArray) {
    if (!Array.isArray(dataArray)) return [];
    return dataArray.map(item => this.fromAPI(item)).filter(Boolean);
  }
}
