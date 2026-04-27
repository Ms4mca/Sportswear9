import React from "react";
import { X } from "lucide-react";
import StarRatingInput from "./StarRatingInput";

const ReviewEditModal = ({
  editingReview,
  setEditingReview,
  editRating,
  setEditRating,
  hoverRating,
  setHoverRating,
  editComment,
  setEditComment,
  handleUpdateReview,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900 text-lg">Edit Your Review</h3>
          <button
            onClick={() => setEditingReview(null)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close edit modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <StarRatingInput
              rating={editRating}
              setRating={setEditRating}
              hoverRating={hoverRating}
              setHoverRating={setHoverRating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
            <textarea
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setEditingReview(null)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateReview}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={!editRating || !editComment}
            >
              Update Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewEditModal;