/**
 * Character Entity Model
 * Representa un personaje del universo Harry Potter
 */
export class Character {
  constructor({
    id,
    name,
    alternateNames = [],
    species,
    gender,
    house,
    dateOfBirth,
    yearOfBirth,
    wizard,
    ancestry,
    eyeColour,
    hairColour,
    wand,
    patronus,
    hogwartsStudent,
    hogwartsStaff,
    actor,
    alternateActors = [],
    alive,
    image
  }) {
    this.id = id;
    this.name = name;
    this.alternateNames = alternateNames;
    this.species = species;
    this.gender = gender;
    this.house = house;
    this.dateOfBirth = dateOfBirth;
    this.yearOfBirth = yearOfBirth;
    this.wizard = wizard;
    this.ancestry = ancestry;
    this.eyeColour = eyeColour;
    this.hairColour = hairColour;
    this.wand = wand;
    this.patronus = patronus;
    this.hogwartsStudent = hogwartsStudent;
    this.hogwartsStaff = hogwartsStaff;
    this.actor = actor;
    this.alternateActors = alternateActors;
    this.alive = alive;
    this.image = image;
  }

  get displayName() {
    return this.name || 'Desconocido';
  }

  get hasImage() {
    return Boolean(this.image);
  }

  get isStudent() {
    return this.hogwartsStudent === true;
  }

  get isStaff() {
    return this.hogwartsStaff === true;
  }
}
