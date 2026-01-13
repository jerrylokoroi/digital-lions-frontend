const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is not set');
}

class ApiError extends Error {
  constructor(message, status, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

async function fetchWithRetry(url, options = {}, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: options.signal || AbortSignal.timeout(10000), // 10s timeout
      });
      
      if (!response.ok) {
        const errorMessage = `Server error: ${response.status} ${response.statusText}`;
        throw new ApiError(errorMessage, response.status, false);
      }
      
      return response;
    } catch (error) {
      const isLastAttempt = i === retries;
      
      // Network errors (offline, DNS failure, timeout)
      if (error.name === 'TypeError' || error.name === 'AbortError') {
        if (isLastAttempt) {
          throw new ApiError(
            'Network error. Please check your connection.',
            0,
            true
          );
        }
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 500));
        continue;
      }
      
      // API errors - don't retry
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Unknown errors
      if (isLastAttempt) {
        throw new ApiError('An unexpected error occurred.', 0, false);
      }
    }
  }
}

export async function fetchStories() {
  const response = await fetchWithRetry(`${API_BASE_URL}/stories`);
  return response.json();
}

export async function fetchStoryById(id) {
  if (!id) {
    throw new ApiError('Story ID is required', 400, false);
  }
  const response = await fetchWithRetry(`${API_BASE_URL}/stories/${id}`);
  return response.json();
}

export async function likeStory(id) {
  if (!id) {
    throw new ApiError('Story ID is required', 400, false);
  }
  const response = await fetchWithRetry(`${API_BASE_URL}/stories/${id}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export async function createStory(storyData) {
  if (!storyData || !storyData.title) {
    throw new ApiError('Story data with title is required', 400, false);
  }
  const response = await fetchWithRetry(`${API_BASE_URL}/stories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storyData),
  });
  return response.json();
}