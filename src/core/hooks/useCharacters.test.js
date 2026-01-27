/**
 * Tests para el hook useCharacters
 * 
 * Verifica:
 * - Carga de datos desde API
 * - Estados de loading/error
 * - Sistema de caché
 * - Refetch manual
 */
import { renderHook, waitFor } from '@testing-library/react';
import { useCharacters, useStudents, useCharactersByHouse } from '../useCharacters';
import { CacheProvider } from '../../context/CacheProvider';
import React from 'react';

/**
 * Wrapper con CacheProvider para los tests
 */
const wrapper = ({ children }) => (
  <CacheProvider>{children}</CacheProvider>
);

describe('useCharacters', () => {
  test('debe cargar personajes correctamente', async () => {
    const { result } = renderHook(() => useCharacters(), { wrapper });
    
    // Estado inicial
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    
    // Esperar a que carguen los datos
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Verificar datos cargados
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].name).toBe('Harry Potter');
    expect(result.current.error).toBeNull();
  });

  test('debe cachear datos para evitar peticiones repetidas', async () => {
    // Primera llamada - fetch desde API
    const { result: result1 } = renderHook(() => useCharacters(), { wrapper });
    
    await waitFor(() => {
      expect(result1.current.loading).toBe(false);
    });
    
    const firstData = result1.current.data;
    
    // Segunda llamada - debe usar caché
    const { result: result2 } = renderHook(() => useCharacters(), { wrapper });
    
    // Debería cargar inmediatamente desde caché
    await waitFor(() => {
      expect(result2.current.loading).toBe(false);
    });
    
    expect(result2.current.data).toEqual(firstData);
  });

  test('refetch debe ignorar caché y hacer nueva petición', async () => {
    const { result } = renderHook(() => useCharacters(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Refetch
    result.current.refetch();
    
    // Debe estar loading de nuevo
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toHaveLength(2);
  });
});

describe('useStudents', () => {
  test('debe filtrar solo estudiantes', async () => {
    const { result } = renderHook(() => useStudents(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toHaveLength(2);
    result.current.data.forEach(character => {
      expect(character.hogwartsStudent).toBe(true);
    });
  });
});

describe('useCharactersByHouse', () => {
  test('debe filtrar personajes por casa', async () => {
    const { result } = renderHook(
      () => useCharactersByHouse('Gryffindor'), 
      { wrapper }
    );
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toHaveLength(2);
    result.current.data.forEach(character => {
      expect(character.house).toBe('Gryffindor');
    });
  });

  test('debe devolver array vacío para casa sin miembros', async () => {
    const { result } = renderHook(
      () => useCharactersByHouse('Slytherin'), 
      { wrapper }
    );
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toHaveLength(0);
  });
});
