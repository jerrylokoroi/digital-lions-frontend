const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function fetchStories() {
  const response = await fetch(`${API_BASE_URL}/stories`);
  if (!response.ok) {
    throw new Error('Failed to fetch stories');
  }
  return response.json();
}

export async function fetchStoryById(id) {
  const response = await fetch(`${API_BASE_URL}/stories/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch story details');
  }
  return response.json();
}

export async function likeStory(id) {
  const response = await fetch(`${API_BASE_URL}/stories/${id}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to like story');
  }
  return response.json();
}

export async function createStory(storyData) {
  const response = await fetch(`${API_BASE_URL}/stories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storyData),
  });
  if (!response.ok) {
    throw new Error('Failed to create story');
  }
  return response.json();
}