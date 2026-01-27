/**
 * Configuración de MSW (Mock Service Worker)
 * 
 * MSW intercepta las peticiones HTTP a nivel de red y devuelve respuestas mockeadas,
 * permitiendo testing realista sin necesidad de servidores reales.
 * 
 * @see https://mswjs.io/
 */
import { http, HttpResponse } from 'msw';

/**
 * Datos de prueba - Personajes
 */
const mockCharacters = [
  {
    id: '1',
    name: 'Harry Potter',
    alternate_names: ['The Chosen One', 'The Boy Who Lived'],
    species: 'human',
    gender: 'male',
    house: 'Gryffindor',
    dateOfBirth: '31-07-1980',
    yearOfBirth: 1980,
    wizard: true,
    ancestry: 'half-blood',
    eyeColour: 'green',
    hairColour: 'black',
    wand: { wood: 'holly', core: 'phoenix feather', length: 11 },
    patronus: 'stag',
    hogwartsStudent: true,
    hogwartsStaff: false,
    actor: 'Daniel Radcliffe',
    alive: true,
    image: 'https://hp-api.onrender.com/images/harry.jpg'
  },
  {
    id: '2',
    name: 'Hermione Granger',
    alternate_names: [],
    species: 'human',
    gender: 'female',
    house: 'Gryffindor',
    dateOfBirth: '19-09-1979',
    yearOfBirth: 1979,
    wizard: true,
    ancestry: 'muggleborn',
    eyeColour: 'brown',
    hairColour: 'brown',
    wand: { wood: 'vine', core: 'dragon heartstring', length: 10.75 },
    patronus: 'otter',
    hogwartsStudent: true,
    hogwartsStaff: false,
    actor: 'Emma Watson',
    alive: true,
    image: 'https://hp-api.onrender.com/images/hermione.jpeg'
  }
];

/**
 * Datos de prueba - Hechizos
 */
const mockSpells = [
  {
    id: '1',
    name: 'Expelliarmus',
    description: 'Disarming Charm'
  },
  {
    id: '2',
    name: 'Expecto Patronum',
    description: 'Patronus Charm'
  }
];

/**
 * Handlers de MSW - Define las respuestas mockeadas para cada endpoint
 */
export const handlers = [
  // GET /api/characters - Todos los personajes
  http.get('https://hp-api.onrender.com/api/characters', () => {
    console.log('[MSW] Mocked GET /api/characters');
    return HttpResponse.json(mockCharacters);
  }),

  // GET /api/characters/students - Solo estudiantes
  http.get('https://hp-api.onrender.com/api/characters/students', () => {
    console.log('[MSW] Mocked GET /api/characters/students');
    const students = mockCharacters.filter(c => c.hogwartsStudent);
    return HttpResponse.json(students);
  }),

  // GET /api/characters/staff - Solo staff
  http.get('https://hp-api.onrender.com/api/characters/staff', () => {
    console.log('[MSW] Mocked GET /api/characters/staff');
    const staff = mockCharacters.filter(c => c.hogwartsStaff);
    return HttpResponse.json(staff);
  }),

  // GET /api/characters/house/:house - Por casa
  http.get('https://hp-api.onrender.com/api/characters/house/:house', ({ params }) => {
    const { house } = params;
    console.log(`[MSW] Mocked GET /api/characters/house/${house}`);
    const byHouse = mockCharacters.filter(c => 
      c.house?.toLowerCase() === house.toLowerCase()
    );
    return HttpResponse.json(byHouse);
  }),

  // GET /api/spells - Hechizos
  http.get('https://hp-api.onrender.com/api/spells', () => {
    console.log('[MSW] Mocked GET /api/spells');
    return HttpResponse.json(mockSpells);
  }),

  // Simular error 404
  http.get('https://hp-api.onrender.com/api/notfound', () => {
    console.log('[MSW] Mocked 404 error');
    return new HttpResponse(null, { status: 404 });
  }),

  // Simular error 500
  http.get('https://hp-api.onrender.com/api/servererror', () => {
    console.log('[MSW] Mocked 500 error');
    return new HttpResponse(null, { status: 500 });
  }),

  // Simular timeout (delay largo)
  http.get('https://hp-api.onrender.com/api/timeout', async () => {
    console.log('[MSW] Mocked timeout');
    await new Promise(resolve => setTimeout(resolve, 35000)); // > timeout del cliente
    return HttpResponse.json({ data: 'too late' });
  })
];

export { mockCharacters, mockSpells };
