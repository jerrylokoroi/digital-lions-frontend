import React, { useState, useEffect } from 'react';
import ProjectCard from './components/ProjectCard';
import Modal from './components/Modal';
import SearchBar from './components/SearchBar';
import { fetchStories, fetchStoryById, likeStory } from './services/api';
import { filterStories } from './utils/filter';
import './App.css';

function App() {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    const filtered = filterStories(stories, searchQuery);
    setFilteredStories(filtered);
  }, [stories, searchQuery]);

  const loadStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchStories();
      setStories(data);
      setFilteredStories(data);
    } catch (err) {
      setError('Failed to load stories. Please try again later.');
      console.error('Error loading stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const updatedStory = await likeStory(id);
      setStories(prevStories =>
        prevStories.map(story =>
          story.id === id ? { ...story, likes: updatedStory.likes } : story
        )
      );
      if (selectedStory && selectedStory.id === id) {
        setSelectedStory({ ...selectedStory, likes: updatedStory.likes });
      }
    } catch (err) {
      console.error('Error liking story:', err);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      setModalLoading(true);
      setIsModalOpen(true);
      const story = await fetchStoryById(id);
      setSelectedStory(story);
    } catch (err) {
      console.error('Error fetching story details:', err);
      setSelectedStory(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStory(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">Digital Lions Impact Dashboard</h1>
          <p className="app-subtitle">
            Transforming communities through innovative digital solutions
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <SearchBar onSearch={handleSearch} searchQuery={searchQuery} />

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading impact stories...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <svg
                className="error-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>{error}</p>
              <button className="retry-button" onClick={loadStories}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredStories.length === 0 && (
            <div className="empty-state">
              <svg
                className="empty-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p>No stories found matching your search.</p>
              {searchQuery && (
                <button
                  className="clear-search-button"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {!loading && !error && filteredStories.length > 0 && (
            <div className="stories-grid">
              {filteredStories.map(story => (
                <ProjectCard
                  key={story.id}
                  story={story}
                  onLike={handleLike}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2026 Digital Lions. Making an impact, one story at a time.</p>
        </div>
      </footer>

      {isModalOpen && (
        <Modal
          story={selectedStory}
          onClose={handleCloseModal}
          onLike={handleLike}
          loading={modalLoading}
        />
      )}
    </div>
  );
}

export default App;