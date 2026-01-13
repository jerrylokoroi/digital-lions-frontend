export function filterStories(stories, searchQuery) {
  // Handle null/undefined stories array
  if (!Array.isArray(stories)) {
    return [];
  }

  // Handle empty, null, or whitespace-only queries
  if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) {
    return stories;
  }

  // Normalize query: lowercase, trim, collapse multiple spaces
  const query = searchQuery
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');

  return stories.filter((story) => {
    // Safely handle missing or invalid story properties
    if (!story || typeof story !== 'object') {
      return false;
    }

    const title = String(story.title || '').toLowerCase();
    const category = String(story.category || '').toLowerCase();
    
    return title.includes(query) || category.includes(query);
  });
}