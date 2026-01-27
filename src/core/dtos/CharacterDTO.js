import { Character } from '../models/Character';
import { House } from '../models/House';

// Datos de casas inline para evitar dependencia circular
const HOUSES_DATA = {
  'Gryffindor': {
    name: 'Gryffindor',
    founder: 'Godric Gryffindor',
    colors: ['#8B1A1A', '#E6B84D'],
    traits: 'Valentía, osadía, temple y caballerosidad',
    animal: '🦁',
    element: '🔥',
    description: 'Los miembros de Gryffindor son conocidos por su valentía y determinación.'
  },
  'Hufflepuff': {
    name: 'Hufflepuff',
    founder: 'Helga Hufflepuff',
    colors: ['#E6C75E', '#3A3A3A'],
    traits: 'Trabajo duro, dedicación, paciencia, lealtad y juego limpio',
    animal: '🦡',
    element: '🌍',
    description: 'Los tejones de Hufflepuff son leales, pacientes y valoran el trabajo duro.'
  },
  'Ravenclaw': {
    name: 'Ravenclaw',
    founder: 'Rowena Ravenclaw',
    colors: ['#2E4E7C', '#B58A3E'],
    traits: 'Inteligencia, conocimiento, curiosidad y creatividad',
    animal: '🦅',
    element: '💨',
    description: 'Los Ravenclaw son conocidos por su sabiduría y amor por el aprendizaje.'
  },
  'Slytherin': {
    name: 'Slytherin',
    founder: 'Salazar Slytherin',
    colors: ['#2A6F3F', '#B8B8B8'],
    traits: 'Ambición, astucia, liderazgo y determinación',
    animal: '🐍',
    element: '💧',
    description: 'Los Slytherin son astutos, ambiciosos y saben conseguir lo que quieren.'
  }
};

/**
 * DTO para transformar datos de la API a modelo Character
 */
export class CharacterDTO {
  static fromAPI(data) {
    if (!data) return null;

    // Crear objeto House si existe
    let house = null;
    if (data.house && HOUSES_DATA[data.house]) {
      house = new House(HOUSES_DATA[data.house]);
    }

    return new Character({
      id: data.id,
      name: data.name,
      alternateNames: data.alternate_names || [],
      species: data.species,
      gender: data.gender,
      house: house,
      dateOfBirth: data.dateOfBirth,
      yearOfBirth: data.yearOfBirth,
      wizard: data.wizard,
      ancestry: data.ancestry,
      eyeColour: data.eyeColour,
      hairColour: data.hairColour,
      wand: data.wand,
      patronus: data.patronus,
      hogwartsStudent: data.hogwartsStudent,
      hogwartsStaff: data.hogwartsStaff,
      actor: data.actor,
      alternateActors: data.alternate_actors || [],
      alive: data.alive,
      image: data.image
    });
  }

  static fromAPIArray(dataArray) {
    if (!Array.isArray(dataArray)) return [];
    return dataArray.map(item => this.fromAPI(item)).filter(Boolean);
  }
}
