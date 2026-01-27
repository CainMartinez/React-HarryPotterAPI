/**
 * House Entity Model
 * Representa una casa de Hogwarts
 */
export class House {
  constructor({
    name,
    founder,
    colors,
    traits,
    animal,
    element,
    description
  }) {
    this.name = name;
    this.founder = founder;
    this.colors = colors || [];
    this.traits = traits;
    this.animal = animal;
    this.element = element;
    this.description = description;
  }

  get primaryColor() {
    return this.colors[0] || '#2a2a2a';
  }

  get secondaryColor() {
    return this.colors[1] || '#4a4a4a';
  }

  get colorGradient() {
    return `linear-gradient(135deg, ${this.primaryColor} 0%, ${this.secondaryColor} 100%)`;
  }
}
