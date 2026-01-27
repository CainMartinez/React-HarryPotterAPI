import { HouseDTO } from '../dtos/HouseDTO';

// Datos estáticos de las casas (no vienen de API)
const housesData = [
  {
    name: 'Gryffindor',
    founder: 'Godric Gryffindor',
    colors: ['#8B1A1A', '#E6B84D'],
    traits: 'Valentía, osadía, temple y caballerosidad',
    animal: '🦁',
    element: '🔥',
    description: 'Los miembros de Gryffindor son conocidos por su valentía y determinación.'
  },
  {
    name: 'Hufflepuff',
    founder: 'Helga Hufflepuff',
    colors: ['#E6C75E', '#3A3A3A'],
    traits: 'Trabajo duro, dedicación, paciencia, lealtad y juego limpio',
    animal: '🦡',
    element: '🌍',
    description: 'Los tejones de Hufflepuff son leales, pacientes y valoran el trabajo duro.'
  },
  {
    name: 'Ravenclaw',
    founder: 'Rowena Ravenclaw',
    colors: ['#2E4E7C', '#B58A3E'],
    traits: 'Inteligencia, conocimiento, curiosidad y creatividad',
    animal: '🦅',
    element: '💨',
    description: 'Los Ravenclaw son conocidos por su sabiduría y amor por el aprendizaje.'
  },
  {
    name: 'Slytherin',
    founder: 'Salazar Slytherin',
    colors: ['#2A6F3F', '#B8B8B8'],
    traits: 'Ambición, astucia, liderazgo y determinación',
    animal: '🐍',
    element: '💧',
    description: 'Los Slytherin son astutos, ambiciosos y saben conseguir lo que quieren.'
  }
];

/**
 * Servicio para gestionar información de las casas
 */
export class HouseService {
  static async getAll() {
    // Simula async para consistencia
    return Promise.resolve(HouseDTO.fromLocalArray(housesData));
  }

  static async getByName(name) {
    const house = housesData.find(h => h.name.toLowerCase() === name.toLowerCase());
    return Promise.resolve(house ? HouseDTO.fromLocal(house) : null);
  }
}
