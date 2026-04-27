// ProductGallery.jsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";



const ProductGallery = ({ images = [], brandLogo }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const parsedImages =
    Array.isArray(images) && images.length > 0
      ? images
          .map((img) => {
            if (typeof img === "string") {
              return img.startsWith("http") ? img : img;
            }
            return img?.url ? img.url : null;
          })
          .filter(Boolean)
      : [];

  const displayImages =
    parsedImages.length > 0 ? parsedImages : [brandLogo].filter(Boolean);

  const nextImage = () =>
    setSelectedIndex((prev) => (prev + 1) % displayImages.length);

  const prevImage = () =>
    setSelectedIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    );

  return (
    <div className="w-full overflow-hidden">
      {isMobile ? (
        // ---------- MOBILE LAYOUT ----------
        <div className="space-y-4 w-full">
          <div className="relative bg-gray-50 rounded-xl border border-gray-200 w-full overflow-hidden flex justify-center items-center aspect-square">
            <img
              src={displayImages[selectedIndex] || "https://via.placeholder.com/500"}
              alt="Main product"
              className="object-contain w-full h-full transition-transform duration-300 cursor-zoom-in"
              onClick={() => setShowZoomModal(true)}
            />

            {displayImages.length > 1 && (
              <>
                
              </>
            )}

            {displayImages.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs z-10">
                {selectedIndex + 1} / {displayImages.length}
              </div>
            )}

            {/* Zoom button only for mobile */}
            {/* <button
              onClick={() => setShowZoomModal(true)}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all z-10"
            >
              <Maximize2 size={18} />
            </button> */}
          </div>

          {/* Thumbnails */}
          {displayImages.length > 1 && (
            <div className="w-full overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 justify-start min-w-max px-1">
                {displayImages.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedIndex(i)}
                    className={`flex-shrink-0 w-16 h-16 border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                      selectedIndex === i
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // ---------- DESKTOP LAYOUT ----------
        <div className="flex flex-row gap-4 w-full">
          {/* Thumbnail Column */}
          {displayImages.length > 1 && (
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-1">
              {displayImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`w-16 h-16 border-2 rounded-lg overflow-hidden cursor-pointer transition-all flex-shrink-0 ${
                    selectedIndex === i
                      ? "border-blue-600 ring-2 ring-blue-200"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Main Image - NO ZOOM ON DESKTOP */}
          <div className="flex-1 relative bg-gray-50 rounded-xl border border-gray-200 overflow-hidden group">
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={displayImages[selectedIndex] || "https://via.placeholder.com/500"}
                alt="Main product"
                className={`object-contain w-full h-full max-h-[450px] transition-transform duration-300 ${
                  isMobile ? "cursor-zoom-in" : "cursor-default"
                }`}
                onClick={() => isMobile && setShowZoomModal(true)}
              />
            </div>

            {/* Desktop navigation arrows still allowed */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg border border-gray-200 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                >
                  <ChevronLeft size={24} className="text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg border border-gray-200 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                >
                  <ChevronRight size={24} className="text-gray-700" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {selectedIndex + 1} / {displayImages.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Zoom Modal ONLY FOR MOBILE */}
      {isMobile && showZoomModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowZoomModal(false)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={displayImages[selectedIndex]}
              alt="Zoomed product"
              className="max-w-full max-h-full object-contain"
            />

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg border border-gray-200 transition-all z-20"
                >
                  <ChevronLeft size={24} className="text-gray-700" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg border border-gray-200 transition-all z-20"
                >
                  <ChevronRight size={24} className="text-gray-700" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                  {selectedIndex + 1} / {displayImages.length}
                </div>
              </>
            )}

            <button
              onClick={() => setShowZoomModal(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all hover:scale-110"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
