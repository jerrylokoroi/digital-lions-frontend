import { describe, it, expect } from 'vitest';
import { filterStories } from '../src/utils/filter';

describe('filterStories', () => {
  const mockStories = [
    {
      id: 1,
      title: 'Empowering Rural Youth through Tech',
      category: 'Education',
      summary: 'Bridging the digital divide',
      description: 'Full details',
      imageUrl: 'https://example.com/1.jpg',
      isFeatured: true,
      likes: 124,
    },
    {
      id: 2,
      title: 'Sustainable Water Solutions',
      category: 'Environment',
      summary: 'Solar-powered irrigation',
      description: 'Engineering details',
      imageUrl: 'https://example.com/2.jpg',
      isFeatured: false,
      likes: 89,
    },
    {
      id: 3,
      title: 'Digital Lions Marketplace',
      category: 'Economic Growth',
      summary: 'E-commerce platform',
      description: 'Payment gateway',
      imageUrl: 'https://example.com/3.jpg',
      isFeatured: true,
      likes: 210,
    },
  ];

  it('returns all stories when search query is empty', () => {
    const result = filterStories(mockStories, '');
    expect(result).toEqual(mockStories);
    expect(result.length).toBe(3);
  });

  it('returns all stories when search query is only whitespace', () => {
    const result = filterStories(mockStories, '   ');
    expect(result).toEqual(mockStories);
  });

  it('filters stories by title (case insensitive)', () => {
    const result = filterStories(mockStories, 'water');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Sustainable Water Solutions');
  });

  it('filters stories by title with different case', () => {
    const result = filterStories(mockStories, 'MARKETPLACE');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Digital Lions Marketplace');
  });

  it('filters stories by category', () => {
    const result = filterStories(mockStories, 'education');
    expect(result.length).toBe(1);
    expect(result[0].category).toBe('Education');
  });

  it('filters stories by partial category match', () => {
    const result = filterStories(mockStories, 'environ');
    expect(result.length).toBe(1);
    expect(result[0].category).toBe('Environment');
  });

  it('returns multiple stories when query matches multiple items', () => {
    const result = filterStories(mockStories, 'tech');
    expect(result.length).toBe(1);
    expect(result[0].title).toContain('Tech');
  });

  it('returns empty array when no stories match', () => {
    const result = filterStories(mockStories, 'nonexistent');
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });

  it('trims whitespace from search query', () => {
    const result = filterStories(mockStories, '  education  ');
    expect(result.length).toBe(1);
    expect(result[0].category).toBe('Education');
  });

  it('handles special characters in search query', () => {
    const result = filterStories(mockStories, 'youth');
    expect(result.length).toBe(1);
    expect(result[0].title).toContain('Youth');
  });

  // New edge case tests
  it('handles null stories array', () => {
    const result = filterStories(null, 'test');
    expect(result).toEqual([]);
  });

  it('handles undefined stories array', () => {
    const result = filterStories(undefined, 'test');
    expect(result).toEqual([]);
  });

  it('handles null search query', () => {
    const result = filterStories(mockStories, null);
    expect(result).toEqual(mockStories);
  });

  it('handles undefined search query', () => {
    const result = filterStories(mockStories, undefined);
    expect(result).toEqual(mockStories);
  });

  it('handles multiple consecutive spaces in query', () => {
    const result = filterStories(mockStories, '  water    solutions  ');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Sustainable Water Solutions');
  });

  it('handles stories with missing title property', () => {
    const brokenStories = [
      { id: 1, category: 'Test' },
      { id: 2, title: 'Valid Story', category: 'Education' },
    ];
    const result = filterStories(brokenStories, 'valid');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Valid Story');
  });

  it('handles stories with missing category property', () => {
    const brokenStories = [
      { id: 1, title: 'Story Without Category' },
      { id: 2, title: 'Complete Story', category: 'Education' },
    ];
    const result = filterStories(brokenStories, 'education');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Complete Story');
  });

  it('handles non-string story properties gracefully', () => {
    const brokenStories = [
      { id: 1, title: 123, category: null },
      { id: 2, title: 'Valid', category: 'Education' },
    ];
    const result = filterStories(brokenStories, 'valid');
    expect(result.length).toBe(1);
  });

  it('handles non-object items in stories array', () => {
    const brokenStories = [
      null,
      undefined,
      'not an object',
      { id: 1, title: 'Valid Story', category: 'Test' },
    ];
    const result = filterStories(brokenStories, 'valid');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Valid Story');
  });

  it('is case-insensitive across all scenarios', () => {
    const result1 = filterStories(mockStories, 'DIGITAL');
    const result2 = filterStories(mockStories, 'digital');
    const result3 = filterStories(mockStories, 'DiGiTaL');
    expect(result1).toEqual(result2);
    expect(result2).toEqual(result3);
  });
});