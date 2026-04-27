import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuggestions } from "../Profile/Profileslice";
import { ProductCard } from "../Product/Product"

const RecommendedForYou = ({product_id}) => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const containerRef = useRef(null);

  const { suggestions, loadingsuggestions } = useSelector(
    (state) => state.profile
  );

  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Transform the suggestions data to extract just the product objects
  const transformSuggestionsData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => item.product);
  };

  // Get transformed product data
  const recommendedProducts = transformSuggestionsData(suggestions);

  /* ===========================
     Fetch Recently Viewed
  ============================ */
  useEffect(() => {
    if (!isAuthenticated || !product_id) return;

    dispatch(fetchSuggestions(product_id));
  }, [dispatch, isAuthenticated, product_id]);

  /* ===========================
     Calculate container width on resize
  ============================ */
  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    
    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, []);

  /* ===========================
     Scroll helpers
  ============================ */
  const checkScrollPosition = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const hasLeftScroll = el.scrollLeft > 0;
    const hasRightScroll = el.scrollLeft + el.clientWidth < el.scrollWidth - 1; // -1 for floating point precision

    setCanScrollLeft(hasLeftScroll);
    setCanScrollRight(hasRightScroll);
  }, []);

  const scroll = useCallback((direction) => {
    const el = scrollRef.current;
    if (!el) return;

    // Calculate visible width minus some padding
    const cardWidth = 250; // Approximate width of product card
    const gap = 16; // gap-4 = 16px
    const scrollAmount = cardWidth + gap;

    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    // Update scroll position after animation
    setTimeout(checkScrollPosition, 300);
  }, [checkScrollPosition]);

  // Update scroll position when products or container width changes
  useEffect(() => {
    checkScrollPosition();
  }, [recommendedProducts, containerWidth, checkScrollPosition]);

  /* ===========================
     Guards
  ============================ */


  if (recommendedProducts.length === 0) {
    return <div />;
  }

  return (
    <section className="" ref={containerRef}>
      <div>
        <h3 className="text-3xl md:text-2xl font-bold text-gray-900 mb-8">
          Recommended for you
        </h3>

        <div className="relative">
          {/* LEFT BUTTON - Show only when there's content to scroll to */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center transition-all opacity-100 hover:bg-gray-100 hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* SCROLL CONTAINER */}
          <div
            ref={scrollRef}
            onScroll={checkScrollPosition}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Add a bit of padding to ensure last item is fully visible */}
            <div className="min-w-[16px] md:min-w-[0px]" /> {/* Left padding */}
            
            {recommendedProducts.map((product) => (
              <div
                key={product.product_uuid}
                className="flex-shrink-0 w-[180px] sm:w-[220px] md:w-[220px] lg:w-[250px] snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
            
            <div className="min-w-[16px] md:min-w-[0px]" /> {/* Right padding */}
          </div>

          {/* RIGHT BUTTON - Show only when there's content to scroll to */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center transition-all opacity-100 hover:bg-gray-100 hover:scale-105"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecommendedForYou;