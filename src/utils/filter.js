export function filterStories(stories, searchQuery) {
    if (!searchQuery.trim()) {
      return stories;
    }
  
    const query = searchQuery.toLowerCase().trim();
  
    return stories.filter((story) => {
      const titleMatch = story.title.toLowerCase().includes(query);
      const categoryMatch = story.category.toLowerCase().includes(query);
      return titleMatch || categoryMatch;
    });
  }