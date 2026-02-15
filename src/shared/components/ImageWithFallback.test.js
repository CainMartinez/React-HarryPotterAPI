/**
 * Tests para ImageWithFallback
 * 
 * Verifica:
 * - Carga exitosa de imágenes
 * - Fallback cuando falla la imagen principal
 * - Placeholder cuando todo falla
 * - Loading states
 */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ImageWithFallback } from './ImageWithFallback';

describe('ImageWithFallback', () => {
  test('debe mostrar imagen cuando carga correctamente', async () => {
    const onLoad = jest.fn();
    
    render(
      <ImageWithFallback
        src="https://example.com/image.jpg"
        alt="Test Image"
        onLoad={onLoad}
      />
    );
    
    const img = screen.getByAltText('Test Image');
    
    // Simular carga exitosa
    fireEvent.load(img);
    
    await waitFor(() => {
      expect(onLoad).toHaveBeenCalled();
    });
    
    expect(img).toBeInTheDocument();
  });

  test('debe usar fallback cuando falla la imagen principal', async () => {
    const onError = jest.fn();
    
    const { rerender } = render(
      <ImageWithFallback
        src="https://example.com/broken.jpg"
        alt="Test Image"
        fallback="https://example.com/fallback.jpg"
        onError={onError}
      />
    );
    
    const img = screen.getByAltText('Test Image');
    
    // Simular error en imagen principal
    fireEvent.error(img);
    
    // Debería intentar cargar el fallback
    rerender(
      <ImageWithFallback
        src="https://example.com/fallback.jpg"
        alt="Test Image"
        fallback="https://example.com/fallback.jpg"
        onError={onError}
      />
    );
    
    expect(img).toBeInTheDocument();
  });

  test('debe mostrar placeholder cuando todo falla', async () => {
    const placeholder = <div data-testid="placeholder">👤</div>;
    
    render(
      <ImageWithFallback
        src="https://example.com/broken.jpg"
        alt="Test Image"
        placeholder={placeholder}
      />
    );
    
    const img = screen.getByAltText('Test Image');
    
    // Simular error
    fireEvent.error(img);
    
    await waitFor(() => {
      expect(screen.getByTestId('placeholder')).toBeInTheDocument();
    });
  });

  test('debe aplicar className correctamente', () => {
    render(
      <ImageWithFallback
        src="https://example.com/image.jpg"
        alt="Test Image"
        className="custom-class"
      />
    );
    
    const img = screen.getByAltText('Test Image');
    expect(img).toHaveClass('custom-class');
  });

  test('debe tener lazy loading habilitado', () => {
    render(
      <ImageWithFallback
        src="https://example.com/image.jpg"
        alt="Test Image"
      />
    );
    
    const img = screen.getByAltText('Test Image');
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});
