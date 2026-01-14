import React, { useState } from 'react';
import './ProjectCard.css';

function ProjectCard({ story, onLike, onViewDetails }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleLikeClick = async () => {
    setIsLiking(true);
    await onLike(story.id);
    setTimeout(() => setIsLiking(false), 300);
  };

  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  return (
    <article className="project-card">
      <div className="card-image-container">
        {!imageLoaded && (
          <div className="image-placeholder">
            <div className="placeholder-shimmer"></div>
          </div>
        )}
        {imageError ? (
          <div className="image-fallback">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="fallback-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        ) : (
          <img
            src={story.imageUrl}
            alt={story.title}
            className={`card-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        {story.isFeatured && (
          <span className="featured-badge" aria-label="Featured story">
            Featured
          </span>
        )}
      </div>

      <div className="card-content">
        <div className="card-header">
          <h2 className="card-title">{story.title}</h2>
          <span className="card-category">{story.category}</span>
        </div>

        <p className="card-summary">{truncateText(story.summary)}</p>

        <div className="card-actions">
          <button
            className={`like-button ${isLiking ? 'liking' : ''}`}
            onClick={handleLikeClick}
            aria-label={`Like ${story.title}`}
            disabled={isLiking}
          >
            <svg
              className="heart-icon"
              fill={isLiking ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="like-count">{story.likes}</span>
          </button>

          <button
            className="details-button"
            onClick={() => onViewDetails(story.id)}
            aria-label={`View details for ${story.title}`}
          >
            View Details
            <svg
              className="arrow-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;