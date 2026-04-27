import React from "react";
import { Edit2, Trash2, ThumbsUp, HelpCircle } from "lucide-react";
import StarRatingDisplay from "./StarRatingDisplay";

const ReviewItem = ({
  review,
  formatDate,
  extractImageUrl,
  openImageModal,
  isAuthenticated,
  isCurrentUserReview,
  startEdit,
  handleDeleteReview,
  handleHelpfulClick,
  helpfulReviews,
}) => {
  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-medium text-gray-900">
              {review.user_name || "Anonymous User"}
            </span>
            {review.verified_purchase && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Verified Purchase
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <StarRatingDisplay rating={review.rating || 0} size={16} />
            <span className="text-sm text-gray-500">
              {formatDate(review.created_at || review.date)}
            </span>
          </div>
        </div>

        {/* Edit/Delete buttons for user's own reviews */}
        {isAuthenticated && isCurrentUserReview(review) && (
          <div className="flex gap-2">
            <button
              onClick={() => startEdit(review)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              aria-label="Edit review"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => handleDeleteReview(review.review_id || review.id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              aria-label="Delete review"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {review.comment && review.comment.trim() !== "" && (
        <p className="mt-3 text-gray-700 leading-relaxed">{review.comment}</p>
      )}

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Customer Photos:</p>
          <div className="flex gap-3 flex-wrap">
            {review.images.map((img, i) => {
              const imageUrl = extractImageUrl(img);
              return (
                <div key={img.image_uuid || img.id || imageUrl} className="relative">
                  <button
                    type="button"
                    onClick={() => openImageModal(review.images, i)}
                    className="block p-0 rounded-lg overflow-hidden"
                    aria-label="View image in lightbox"
                  >
                    <img
                      src={imageUrl}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                      alt="Customer review photo"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80?text=Error";
                      }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review Videos */}
      {review.videos && review.videos.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Customer Videos:</p>
          <div className="flex gap-3 flex-wrap">
            {review.videos.map((vid, i) => {
              const videoUrl = vid.video_url || vid.url || vid;
              return (
                <div key={i} className="w-32">
                  <video
                    controls
                    className="w-full rounded-lg border border-gray-200"
                    src={videoUrl}
                    poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Cpath d='M40 30 L70 50 L40 70 Z' fill='%239ca3af'/%3E%3C/svg%3E"
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              );
            })}
          </div>
        </div>
      )}

      
    </div>
  );
};

export default ReviewItem;