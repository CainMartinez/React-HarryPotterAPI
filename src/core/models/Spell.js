/**
 * Spell Entity Model
 * Representa un hechizo del mundo mágico
 */
export class Spell {
  constructor({
    id,
    name,
    description
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  get displayName() {
    return this.name || 'Hechizo Desconocido';
  }

  get hasDescription() {
    return Boolean(this.description);
  }
}
