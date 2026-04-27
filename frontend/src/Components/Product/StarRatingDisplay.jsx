import React from "react";
import { Star } from "lucide-react";

const StarRatingDisplay = ({ rating, size = 16 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : star <= rating
              ? "text-yellow-400 fill-yellow-400 opacity-50"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default StarRatingDisplay;