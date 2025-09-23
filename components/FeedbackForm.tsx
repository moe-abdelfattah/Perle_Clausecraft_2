import React, { useState } from 'react';
import { StarIcon } from './Icons';

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
    if (rating > 0) {
      onSubmit(rating, comment);
    }
  };

  return (
    <div className="my-4 p-4 bg-white rounded-lg border border-gray-200/60 animate-fade-in-up">
      <form onSubmit={handleSubmit}>
        <h3 className="font-medium text-sm text-gray-700 mb-2 text-center">Rate the quality of the generated document</h3>
        <div className="flex justify-center items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="text-yellow-400 transition-transform duration-150 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 rounded-full"
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
          className="w-full p-2 bg-white border border-gray-300/80 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 transition text-sm"
          rows={2}
        />
        <div className="flex justify-end items-center gap-3 mt-3">
          <button
            type="button"
            onClick={onDismiss}
            className="text-gray-600 font-semibold text-sm py-2 px-4 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Dismiss
          </button>
          <button
            type="submit"
            disabled={rating === 0}
            className="bg-gray-800 text-white font-semibold text-sm py-2 px-4 rounded-md shadow-sm transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;