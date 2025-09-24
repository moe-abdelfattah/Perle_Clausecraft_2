import React, { useState } from 'react';
import { StarIcon } from './Icons';
import { playClickSound } from '../utils/uiUtils';

interface FeedbackFormProps {
  onSubmit: (rating: number, comment: string) => void;
  onDismiss: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit, onDismiss }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    if (rating > 0) {
      onSubmit(rating, comment);
    }
  };
  
  const handleDismiss = () => {
    playClickSound();
    onDismiss();
  };
  
  const handleRatingClick = (star: number) => {
    playClickSound();
    setRating(star);
  };

  return (
    <div className="my-4 p-4 hud-panel animate-fade-in-up">
       <div className="corner-bottom-left"></div>
       <div className="corner-bottom-right"></div>
      <form onSubmit={handleSubmit}>
        <h3 className="font-medium text-sm text-gray-300 mb-2 text-center uppercase tracking-wider">Rate Document Quality</h3>
        <div className="flex justify-center items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRatingClick(star)}
              className="text-yellow-400 transition-transform duration-150 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-400 rounded-full"
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <StarIcon filled={(hoverRating || rating) >= star} className="w-6 h-6" />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional: Provide comments for improvements..."
          className="w-full p-2 bg-black/50 border border-[var(--border-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] transition text-sm text-gray-200"
          rows={2}
        />
        <div className="flex justify-end items-center gap-3 mt-3">
          <button
            type="button"
            onClick={handleDismiss}
            className="btn-secondary-animated text-gray-300 font-semibold text-sm py-2 px-4 focus:outline-none"
          >
            Dismiss
          </button>
          <button
            type="submit"
            disabled={rating === 0}
            className="btn-animated bg-[var(--accent-color)] text-black font-semibold text-sm py-2 px-4 transition-colors hover:bg-[var(--accent-color-dark)] focus:outline-none disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;