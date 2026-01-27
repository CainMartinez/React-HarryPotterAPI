# ⚡ Harry Potter WebApp

> Aplicación web del universo de Harry Potter construida con React, implementando arquitectura profesional, testing completo y dockerización.

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Tests](https://img.shields.io/badge/Tests-Jest%20%2B%20MSW-green.svg)](https://jestjs.io/)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [APIs Utilizadas](#-apis-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Ejecución](#-ejecución)
- [Testing](#-testing)
- [Docker](#-docker)
- [Arquitectura](#-arquitectura)
- [Características Técnicas Avanzadas](#-características-técnicas-avanzadas)
- [Documentación Técnica](#-documentación-técnica)
- [Contribución](#-contribución)

## ✨ Características

### Funcionalidades
- 🏰 **Exploración de Casas de Hogwarts** - Información detallada de Gryffindor, Slytherin, Hufflepuff y Ravenclaw
- 👥 **Base de Datos de Personajes** - Más de 400 personajes con información completa
- 🎓 **Estudiantes y Profesores** - Filtrado por rol en Hogwarts
- ⚡ **Hechizos y Encantamientos** - Catálogo completo de magia
- 🐱 **Sorpresas Mágicas** - Integración con The Cat API para contenido adicional

### Características Técnicas
- ⚡ **Operaciones No Bloqueantes** - Todas las peticiones de red son asíncronas
- 🔄 **Control del Ciclo de Vida** - Gestión completa con `useEffect`, cleanup y `AbortController`
- 💾 **Sistema de Caché Dual** - Memoria RAM + localStorage con TTL configurable
- 🛡️ **Manejo de Errores HTTP** - Gestión de 4xx, 5xx y falta de conexión
- 📝 **Documentación JSDoc** - Código completamente documentado
- 🧪 **Testing Completo** - Tests unitarios con Jest y MSW
- 🐳 **Dockerización** - Contenedores Docker con multi-stage build

## 🛠️ Tecnologías

### Core
- **React** 18.2.0 - Biblioteca UI
- **React Router** 6.20.0 - Navegación SPA

### Testing
- **Jest** - Framework de testing
- **React Testing Library** - Testing de componentes
- **MSW** (Mock Service Worker) - Mocking de APIs

### DevOps
- **Nginx** - Servidor web de producción
- **Docker Compose** - Orquestación de contenedores

## 🌐 APIs Utilizadas

### 1. HP API (Harry Potter API)
- **URL**: `https://hp-api.onrender.com/api`
- **Descripción**: API pública con información del universo Harry Potter
- **Endpoints utilizados**:
  - `/characters` - Todos los personajes
  - `/characters/students` - Solo estudiantes
  - `/characters/staff` - Solo profesores
  - `/characters/house/:house` - Personajes por casa
  - `/spells` - Hechizos
- **Autenticación**: No requerida
- **Documentación**: [hp-api.onrender.com](https://hp-api.onrender.com)

### 2. The Cat API
- **URL**: `https://api.thecatapi.com/v1`
- **Descripción**: API de imágenes de gatos
- **Autenticación**: API Key requerida
- **Obtener API Key**: [thecatapi.com](https://thecatapi.com)
- **Endpoints utilizados**:
  - `/images/search?limit=10&api_key=REPLACE_ME` - Obtener imágenes aleatorias de gatos


### Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:
```env
# The Cat API Key (opcional pero recomendado)
REACT_APP_CAT_API_KEY=your_api_key_here
```

Para obtener la API key:
1. Visita [thecatapi.com](https://thecatapi.com)
2. Regístrate gratis
3. Copia tu API key
4. Pégala en el archivo `.env`

## 🧪 Testing

### Ejecutar todos los tests
```bash
npm test
```

### Tests con coverage
```bash
npm test -- --coverage
```

### Tests en modo CI (sin watch)
```bash
npm run test:ci
```

### Estructura de Tests
```
src/
├── core/
│   ├── services/
│   │   └── apiClient.test.js      # Tests del cliente HTTP
│   └── hooks/
│       └── useCharacters.test.js  # Tests de hooks
└── shared/
    └── components/
        └── ImageWithFallback.test.js  # Tests de componentes
```

### Cobertura Mínima
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

## 🐳 Docker

### Ejecutar todos los contenedores
```bash
docker-compose up --build -d
```

### Ver logs
```bash
docker-compose logs -f webapp
```

### Detener contenedores
```bash
docker-compose down
```

## 🏗️ Arquitectura

### Estructura de Carpetas
```
src/
├── core/                    # Lógica de negocio
│   ├── services/           # Servicios (API clients)
│   │   ├── apiClient.js    # Cliente HTTP base
│   │   ├── CharacterService.js
│   │   ├── SpellService.js
│   │   └── CatService.js
│   ├── hooks/              # Custom hooks
│   │   ├── useFetch.js     # Hook genérico de fetch
│   │   ├── useCharacters.js
│   │   ├── useSpells.js
│   │   └── useHouses.js
│   ├── dtos/               # Data Transfer Objects
│   │   ├── CharacterDTO.js
│   │   └── SpellDTO.js
│   ├── models/             # Modelos de dominio
│   │   ├── Character.js
│   │   ├── House.js
│   │   └── Spell.js
│   └── context/            # React Context
│       └── CacheProvider.js # Sistema de caché
├── features/               # Componentes por feature
│   ├── home/
│   ├── characters/
│   ├── students/
│   ├── staff/
│   ├── houses/
│   ├── spells/
│   └── cats/
├── shared/                 # Componentes compartidos
│   └── components/
│       ├── Navbar.jsx
│       ├── Loading.jsx
│       ├── ErrorMessage.jsx
│       └── ImageWithFallback.jsx
├── mocks/                  # Mocks para testing
│   ├── handlers.js         # MSW handlers
│   └── server.js           # MSW server
└── App.js                  # Componente raíz
```

## 🎯 Características Técnicasz

### 1. Separación de Hilos (Non-blocking UI)

**Implementación**: Todas las operaciones de red son completamente asíncronas usando `async/await`.

```javascript
// ❌ BLOQUEANTE (NO hacer esto)
const data = fetchSync('/api/characters'); // Bloquearía la UI

// ✅ NO BLOQUEANTE (Implementado)
const data = await fetch('/api/characters'); // UI sigue respondiendo
```

**Beneficios**:
- UI nunca se congela durante peticiones de red
- Experiencia de usuario fluida
- Compatibilidad con React 18 Concurrent Mode

### 2. Control del Ciclo de Vida

**Implementación**: Gestión completa con `useEffect`, cleanup functions y `AbortController`.

```javascript
useEffect(() => {
  const abortController = new AbortController();
  
  fetchData(abortController.signal);
  
  // Cleanup: cancelar peticiones pendientes
  return () => {
    abortController.abort();
  };
}, [dependencies]);
```

**Beneficios**:
- Previene memory leaks
- Evita race conditions
- Cancela peticiones obsoletas
- Gestión eficiente de recursos

### 3. Sistema de Caché Dual

**Implementación**: Caché en memoria (Map) + persistencia en localStorage.

```javascript
// Nivel 1: Memoria (ultrarrápido)
cache.set('characters:all', data, 10 * 60 * 1000); // TTL 10 min

// Nivel 2: localStorage (persistente entre sesiones)
localStorage.setItem('hp-app-cache', JSON.stringify(cache));
```

**Características**:
- TTL (Time To Live) configurable
- Limpieza automática de entradas expiradas
- Versionado de caché para invalidación
- Fallback a API si caché expira

**Beneficios**:
- Reduce latencia de 500ms → 5ms
- Ahorra ancho de banda
- Funciona parcialmente offline
- Mejora percepción de velocidad

### 4. Gestión de Errores HTTP

**Implementación**: Manejo específico de códigos HTTP y errores de red.

```javascript
// Errores 4xx (Cliente)
if (status >= 400 && status < 500) {
  throw new HTTPError('Error del cliente', status);
}

// Errores 5xx (Servidor)
if (status >= 500) {
  throw new HTTPError('Error del servidor', status);
}

// Sin conexión
if (error.name === 'TypeError') {
  return { error: 'Sin conexión a internet' };
}
```

**Retry Logic**:
```javascript
// Reintentos automáticos con exponential backoff
if (shouldRetry && retryCount < maxRetries) {
  await delay(Math.pow(2, retryCount) * 1000);
  return retry();
}
```

**Beneficios**:
- Recuperación automática de errores temporales
- Mensajes de error claros para el usuario
- Previene cascada de errores
- Mejora resiliencia de la app

### 5. Gestión de Archivos (Imágenes)

**Implementación**: Componente `ImageWithFallback` con múltiples niveles de fallback.

```javascript
<ImageWithFallback
  src={primaryImage}          // Intento 1
  fallback={backupImage}       // Intento 2
  placeholder={<Emoji />}      // Intento 3
  loading="lazy"               // Lazy loading
/>
```

**Características**:
- Lazy loading nativo
- Fallback automático
- Estados de loading/error
- Callback de eventos

### 6. Documentación JSDoc

**Implementación**: Todos los métodos, hooks y componentes documentados.

```javascript
/**
 * Hook para obtener personajes con caché
 * 
 * @returns {{
 *   data: Character[],
 *   loading: boolean,
 *   error: string|null,
 *   refetch: Function
 * }}
 * 
 * @example
 * const { data, loading, error } = useCharacters();
 */
export function useCharacters() { ... }
```

### 7. Testing con Mocks (MSW)

**Implementación**: MSW intercepta peticiones HTTP en tests.

```javascript
// Mock de endpoint
http.get('https://hp-api.onrender.com/api/characters', () => {
  return HttpResponse.json(mockData);
});

// Test
test('debe cargar personajes', async () => {
  const { data } = await CharacterService.getAll();
  expect(data).toHaveLength(2);
});
```

**Beneficios**:
- Tests rápidos (sin red real)
- Deterministas (siempre mismo resultado)
- Pueden simular errores
- Prueban el código real


- Tests para nuevas features
- Seguir la estructura de carpetas existente
- Commits semánticos (Add, Fix, Update, Remove)

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.