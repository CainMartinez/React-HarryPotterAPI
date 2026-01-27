/**
 * Cat Entity Model
 * Representa un gato de The Cat API
 */
export class Cat {
  constructor({
    id,
    url,
    width,
    height,
    breeds = []
  }) {
    this.id = id;
    this.url = url;
    this.width = width;
    this.height = height;
    this.breeds = breeds;
  }

  get mainBreed() {
    return this.breeds[0] || null;
  }

  get breedName() {
    return this.mainBreed?.name || 'Gato Mágico';
  }

  get temperament() {
    return this.mainBreed?.temperament || '';
  }

  get lifeSpan() {
    return this.mainBreed?.life_span || '';
  }

  get description() {
    return this.mainBreed?.description || '';
  }

  get origin() {
    return this.mainBreed?.origin || '';
  }

  get hasBreedInfo() {
    return this.breeds.length > 0;
  }
}
