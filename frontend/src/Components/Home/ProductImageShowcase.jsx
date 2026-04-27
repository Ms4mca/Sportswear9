import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductImageShowcase({ images = [] }) {
  const [active, setActive] = useState(Math.floor(images.length / 2));

  if (!images.length) return null;

  const prev = () =>
    setActive((i) => (i === 0 ? images.length - 1 : i - 1));

  const next = () =>
    setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  const getImage = (offset) => {
    const index = (active + offset + images.length) % images.length;
    return images[index];
  };

  const getImageUrl = (img) => {
    if (!img) return "";
    if (typeof img === 'string') return img;
    return img.url || img.image || "";
  };

  const getImageLink = (img) => {
    if (!img) return "#";
    if (typeof img === 'string') return "#";
    return img.link || "#";
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-7 md:grid-rows-2 gap-6 items-stretch justify-items-center">
        
        {/* LEFT TOP */}
        <div className="hidden md:block w-full h-full col-span-2">
          {(() => {
            const img = getImage(-2);
            const imgUrl = getImageUrl(img);
            const imgLink = getImageLink(img);
            
            return imgLink !== "#" ? (
              <Link to={imgLink}>
                <img
                  src={imgUrl}
                  onClick={() => setActive((active - 2 + images.length) % images.length)}
                  className="border-gray-300 border cursor-pointer object-cover w-full h-full hover:opacity-80 transition-opacity duration-300"
                  style={{ aspectRatio: '4/5' }}
                  alt="Product thumbnail"
                />
              </Link>
            ) : (
              <img
                src={imgUrl}
                onClick={() => setActive((active - 2 + images.length) % images.length)}
                className="border-gray-300 border cursor-pointer object-cover w-full h-full hover:opacity-80 transition-opacity duration-300"
                style={{ aspectRatio: '4/5' }}
                alt="Product thumbnail"
              />
            );
          })()}
        </div>

        {/* CENTER */}
        <div className="relative md:row-span-2 col-span-3 flex items-center justify-center w-full">
          {(() => {
            const img = images[active];
            const imgUrl = getImageUrl(img);
            const imgLink = getImageLink(img);
            
            return imgLink !== "#" ? (
              <Link to={imgLink} className="w-full h-full">
                <img
                  src={imgUrl}
                  className="border-gray-300 object-cover w-full h-full border hover:opacity-90 transition-opacity duration-300"
                  style={{ aspectRatio: '4/5' }}
                  alt="Main product"
                />
              </Link>
            ) : (
              <img
                src={imgUrl}
                className="border-gray-300 object-cover w-full h-full border"
                style={{ aspectRatio: '4/5' }}
                alt="Main product"
              />
            );
          })()}
        </div>

        {/* RIGHT TOP */}
        <div className="hidden md:block w-full h-full col-span-2">
          {(() => {
            const img = getImage(1);
            const imgUrl = getImageUrl(img);
            const imgLink = getImageLink(img);
            
            return imgLink !== "#" ? (
              <Link to={imgLink}>
                <img
                  src={imgUrl}
                  onClick={() => setActive((active + 1) % images.length)}
                  className="border-gray-300 border cursor-pointer object-cover w-full h-full hover:opacity-80 transition-opacity duration-300"
                  style={{ aspectRatio: '4/5' }}
                  alt="Product thumbnail"
                />
              </Link>
            ) : (
              <img
                src={imgUrl}
                onClick={() => setActive((active + 1) % images.length)}
                className="border-gray-300 border cursor-pointer object-cover w-full h-full hover:opacity-80 transition-opacity duration-300"
                style={{ aspectRatio: '4/5' }}
                alt="Product thumbnail"
              />
            );
          })()}
        </div>

        {/* LEFT BOTTOM */}
        <div className="hidden md:block w-full h-full col-span-2">
          {(() => {
            const img = getImage(-1);
            const imgUrl = getImageUrl(img);
            const imgLink = getImageLink(img);
            
            return imgLink !== "#" ? (
              <Link to={imgLink}>
                <img
                  src={imgUrl}
                  onClick={() => setActive((active - 1 + images.length) % images.length)}
                  className="border-gray-300 border cursor-pointer object-cover w-full h-full hover:opacity-80 transition-opacity duration-300"
                  style={{ aspectRatio: '4/5' }}
                  alt="Product thumbnail"
                />
              </Link>
            ) : (
              <img
                src={imgUrl}
                onClick={() => setActive((active - 1 + images.length) % images.length)}
                className="border-gray-300 border cursor-pointer object-cover w-full h-full hover:opacity-80 transition-opacity duration-300"
                style={{ aspectRatio: '4/5' }}
                alt="Product thumbnail"
              />
            );
          })()}
        </div>

        {/* RIGHT BOTTOM */}
        <div className="hidden md:block w-full h-full col-span-2">
          {(() => {
            const img = getImage(2);
            const imgUrl = getImageUrl(img);
            const imgLink = getImageLink(img);
            
            return imgLink !== "#" ? (
              <Link to={imgLink}>
                <img
                  src={imgUrl}
                  onClick={() => setActive((active + 2) % images.length)}
                  className="border-gray-300 border cursor-pointer object-cover w-full h-full hover:opacity-80 transition-opacity duration-300"
                  style={{ aspectRatio: '4/5' }}
                  alt="Product thumbnail"
                />
              </Link>
            ) : (
              <img
                src={imgUrl}
                onClick={() => setActive((active + 2) % images.length)}
                className="border-gray-300 border cursor-pointer object-cover w-full h-full hover:opacity-80 transition-opacity duration-300"
                style={{ aspectRatio: '4/5' }}
                alt="Product thumbnail"
              />
            );
          })()}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden justify-center items-center gap-4 mt-4">
        <button
          onClick={prev}
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-medium">
          {active + 1} / {images.length}
        </span>
        <button
          onClick={next}
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}