import React from "react";
import { Camera, Video, X } from "lucide-react";
import StarRatingInput from "./StarRatingInput";

const ReviewForm = ({
  rating,
  setRating,
  hoverRating,
  setHoverRating,
  comment,
  setComment,
  imageFiles,
  setImageFiles,
  videoFiles,
  setVideoFiles,
  handleSubmitReview,
  setShowReviewForm,
}) => {
  return (
    <div className="bg-gray-50 border rounded-lg p-6 mb-8">
      <h3 className="font-semibold text-lg mb-4">Write Your Review</h3>

      <StarRatingInput
        rating={rating}
        setRating={setRating}
        hoverRating={hoverRating}
        setHoverRating={setHoverRating}
      />

      <textarea
        className="w-full mt-4 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        rows="4"
        placeholder="Share your experience with this product... What did you like or dislike? How's the quality, fit, and comfort?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {/* File Upload Section */}
      <div className="mt-6 space-y-4">
        {/* Photo Upload */}
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-medium">Add Photos</span>
              <span className="text-xs text-gray-500">(Optional)</span>
            </div>
            <div className="text-xs text-gray-500">
              {imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : "No files selected"}
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
              <Camera className="w-4 h-4" />
              <span className="font-medium">Choose Photos</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFiles([...e.target.files])}
              />
            </label>
            <span className="text-sm text-gray-600">JPG, PNG, GIF (Max 5MB each)</span>
          </div>

          {/* Preview selected images */}
          {imageFiles.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {Array.from(imageFiles).map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      {file.type.startsWith("image/") && (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newFiles = [...imageFiles];
                        newFiles.splice(index, 1);
                        setImageFiles(newFiles);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Video Upload */}
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-600" />
              <span className="text-purple-600 font-medium">Add Videos</span>
              <span className="text-xs text-gray-500">(Optional)</span>
            </div>
            <div className="text-xs text-gray-500">
              {videoFiles.length > 0 ? `${videoFiles.length} file(s) selected` : "No files selected"}
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 cursor-pointer transition-colors">
              <Video className="w-4 h-4" />
              <span className="font-medium">Choose Videos</span>
              <input
                type="file"
                multiple
                accept="video/*"
                className="hidden"
                onChange={(e) => setVideoFiles([...e.target.files])}
              />
            </label>
            <span className="text-sm text-gray-600">MP4, MOV (Max 50MB each)</span>
          </div>

          {/* Preview selected videos */}
          {videoFiles.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {Array.from(videoFiles).map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                      <div className="text-white text-xs text-center p-2">
                        <div className="font-bold">VIDEO</div>
                        <div className="truncate max-w-[60px]">{file.name.split(".")[0]}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newFiles = [...videoFiles];
                        newFiles.splice(index, 1);
                        setVideoFiles(newFiles);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove video"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSubmitReview}
          disabled={!rating || !comment}
          className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
            !rating || !comment
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Submit Review
        </button>
        <button
          onClick={() => setShowReviewForm(false)}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;