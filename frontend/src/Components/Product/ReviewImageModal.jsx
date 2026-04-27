import React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const ReviewImageModal = ({
  modalImages,
  modalIndex,
  closeImageModal,
  prevImage,
  nextImage,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh]">
        <button
          onClick={closeImageModal}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 bg-black/50 p-2 rounded-full"
          aria-label="Close image viewer"
        >
          <X size={24} />
        </button>

        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 bg-black/50 p-2 rounded-full"
          aria-label="Previous image"
          disabled={modalImages.length <= 1}
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 bg-black/50 p-2 rounded-full"
          aria-label="Next image"
          disabled={modalImages.length <= 1}
        >
          <ChevronRight size={24} />
        </button>

        <div className="h-full flex items-center justify-center">
          <img
            src={modalImages[modalIndex]}
            alt={`Review image ${modalIndex + 1} of ${modalImages.length}`}
            className="max-w-full max-h-[80vh] object-contain"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/600?text=Image+Not+Found";
            }}
          />
        </div>

        {modalImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {modalImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setModalIndex(idx)}
                className={`w-2 h-2 rounded-full ${
                  idx === modalIndex ? "bg-white" : "bg-gray-500"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-4 right-4 text-white text-sm bg-black/50 px-2 py-1 rounded">
          {modalIndex + 1} / {modalImages.length}
        </div>
      </div>
    </div>
  );
};

export default ReviewImageModal;