import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import StarRatingDisplay from "./StarRatingDisplay";

const ReviewSummary = ({
  totalReviews,
  averageRating,
  reviewStats,
  isAuthenticated,
  showReviewForm,
  setShowReviewForm,
  setAuthMode,
  setAuthOpen,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Reviews</h3>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Average Rating */}
        <div className="text-center md:text-left">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center md:justify-start mb-2">
            <StarRatingDisplay rating={averageRating} size={24} />
          </div>
          <div className="text-sm text-gray-600">
            {totalReviews} global {totalReviews === 1 ? "rating" : "ratings"}
          </div>
        </div>

        {/* Middle Column - Rating Bars */}
        <div className="md:col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <div className="w-12 text-sm text-gray-600">{star} star</div>
              <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${reviewStats.percentages[star]}%` }}
                />
              </div>
              <div className="w-12 text-sm text-gray-600">
                {reviewStats.stats[star]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      {isAuthenticated ? (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            {showReviewForm ? (
              <>
                <ChevronUp size={20} />
                Hide Review Form
              </>
            ) : (
              <>
                <ChevronDown size={20} />
                Write a Customer Review
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600 mb-3">Share your experience with this product</p>
          <button
            onClick={() => {
              setAuthMode("login");
              setAuthOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign in to write a review
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSummary;