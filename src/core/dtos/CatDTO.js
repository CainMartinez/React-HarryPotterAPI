import { Cat } from '../models/Cat';

/**
 * DTO para transformar datos de la API a modelo Cat
 */
export class CatDTO {
  static fromAPI(data) {
    if (!data) return null;

    return new Cat({
      id: data.id,
      url: data.url,
      width: data.width,
      height: data.height,
      breeds: data.breeds || []
    });
  }

  static fromAPIArray(dataArray) {
    if (!Array.isArray(dataArray)) return [];
    return dataArray.map(item => this.fromAPI(item)).filter(Boolean);
  }
}
