import { House } from '../models/House';

/**
 * DTO para transformar datos locales a modelo House
 */
export class HouseDTO {
  static fromLocal(data) {
    if (!data) return null;

    return new House({
      name: data.name,
      founder: data.founder,
      colors: data.colors,
      traits: data.traits,
      animal: data.animal,
      element: data.element,
      description: data.description
    });
  }

  static fromLocalArray(dataArray) {
    if (!Array.isArray(dataArray)) return [];
    return dataArray.map(item => this.fromLocal(item)).filter(Boolean);
  }
}
