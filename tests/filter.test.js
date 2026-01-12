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
    const result = filterStories(mockStories, 'digital');
    expect(result.length).toBe(2);
    expect(result.some(s => s.title.includes('Digital'))).toBe(true);
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
});