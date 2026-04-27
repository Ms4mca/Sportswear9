import React from "react";
import { Star } from "lucide-react";

const StarRatingInput = ({
  rating,
  setRating,
  hoverRating,
  setHoverRating,
  size = 24,
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="hover:scale-110 cursor-pointer transition-transform"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            className={`${
              star <= (hoverRating || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {rating > 0
          ? `${rating} star${rating !== 1 ? "s" : ""}`
          : "Select rating"}
      </span>
    </div>
  );
};

export default StarRatingInput;