import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReviews, selectFilteredHomepageReviews } from '../Product/ReviewSlice';

// --- UI Components ---

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Button = ({ className, children, ...props }) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-6 shadow-md hover:shadow-lg active:scale-95",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

// --- Helper Functions ---

const truncateText = (text, wordLimit = 28) => {
  if (!text) return "";
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

// --- Main Carousel Component ---

const HomepageReviewCarousel = () => {
  const dispatch = useDispatch();
  const filteredReviews = useSelector(selectFilteredHomepageReviews);
  const { loading, error } = useSelector((state) => state.review || { loading: false, error: null });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeTrigger, setFadeTrigger] = useState(true);
  const timerRef = useRef(null);

  // Fetch reviews on component mount
  useEffect(() => {
    if (dispatch) {
      dispatch(fetchAllReviews());
    }
  }, [dispatch]);

  // Auto-slide functionality (Reset timer whenever index or reviews change)
  useEffect(() => {
    if (!filteredReviews || filteredReviews.length <= 1) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [filteredReviews, currentIndex]);

  const handleNext = () => {
    if (!filteredReviews || filteredReviews.length <= 1) return;
    setFadeTrigger(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === filteredReviews.length - 1 ? 0 : prevIndex + 1
      );
      setFadeTrigger(true);
    }, 400); 
  };

  const handlePrevious = () => {
    if (!filteredReviews || filteredReviews.length <= 1) return;
    setFadeTrigger(false);
    setTimeout(() => {
      const newIndex = currentIndex === 0 ? filteredReviews.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
      setFadeTrigger(true);
    }, 400);
  };

  const goToSlide = (index) => {
    if (index === currentIndex) return;
    setFadeTrigger(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFadeTrigger(true);
    }, 400);
  };

  if (loading) {
    return (
      <div className="w-full py-24 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="rounded-full bg-indigo-100 h-16 w-16"></div>
          <div className="h-4 bg-gray-100 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-24 text-center">
        <p className="text-red-500 font-medium">Failed to load reviews. Please try again later.</p>
      </div>
    );
  }

  if (!filteredReviews || filteredReviews.length === 0) {
    return (
      <div className="w-full py-24 text-center text-gray-400">
        No reviews available at the moment.
      </div>
    );
  }

  const currentReview = filteredReviews[currentIndex];
  const productImageUrl = currentReview.image || currentReview.images?.[0]?.image_url || "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80";
  const displayName = (currentReview.userName || currentReview.user_name || "Anonymous").split('@')[0];

  return (
    <div className="review-carousel-container w-full max-w-6xl mx-auto px-4 py-12 md:py-24 select-none overflow-visible font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounceFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        .product-float { 
          animation: bounceFloat 4s ease-in-out infinite; 
        }
        .fade-transition {
          transition: opacity 0.4s ease-in-out, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Mobile Specific Layout Fixes - Maintaining structure on small screens */
        @media (max-width: 768px) {
          .carousel-card {
            padding: 2rem !important;
            flex-direction: column-reverse !important;
            gap: 2rem !important;
            text-align: center;
            border-radius: 2rem !important;
          }
          .content-section {
            width: 100% !important;
            min-height: auto !important;
          }
          .image-section {
            width: 100% !important;
            position: relative !important;
            right: 0 !important;
            top: 0 !important;
            transform: none !important;
            margin-bottom: 1rem;
          }
          .image-container {
            width: 220px !important;
            margin: 0 auto;
          }
          .star-container {
            justify-content: center;
          }
          .footer-section {
            flex-direction: column;
            gap: 1.5rem;
          }
          .nav-btn {
            display: none !important; 
          }
        }
      `}} />

      <div className="text-center mb-10 md:mb-16">
        <h2 className="text-xs md:text-sm font-bold tracking-widest text-indigo-600 uppercase mb-2">Customer Feedback</h2>
        <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">What they're saying.</h3>
      </div>

      <div className="relative flex items-center justify-center">
        {/* Navigation Arrows (Desktop Only) */}
        {filteredReviews.length > 1 && (
          <div className="nav-btn absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between z-30 pointer-events-none px-2 md:-mx-8">
            <button 
              onClick={handlePrevious}
              className="p-4 rounded-full bg-white shadow-xl text-gray-800 hover:bg-indigo-600 hover:text-white transition-all pointer-events-auto shadow-indigo-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={handleNext}
              className="p-4 rounded-full bg-white shadow-xl text-gray-800 hover:bg-indigo-600 hover:text-white transition-all pointer-events-auto shadow-indigo-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}

        {/* Card Wrapper */}
        <div className="relative w-full max-w-4xl cursor-default">
          <div
            className={cn(
              "carousel-card bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-visible fade-transition min-h-[450px]",
              fadeTrigger ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
            )}
          >
            {/* Content Section */}
            <div className="content-section md:w-3/5 z-10 flex flex-col justify-between h-full min-h-[320px]">
              <div>
                <div className="star-container flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < (currentReview.rating || 5) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>

                <h4 className="text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-tight mb-2">
                  Product: {currentReview.product || 'Featured Item'}
                </h4>
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed italic mb-2 min-h-[6rem]">
                  "{truncateText(currentReview.comment, 30)}"
                </p>
              </div>

              <div className="footer-section flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                {/* <div>
                  <p className="text-indigo-600 font-bold text-lg uppercase tracking-wider">{displayName}</p>
                  <p className="text-gray-400 text-sm">Verified Purchase</p>
                </div> */}
                <div className="text-right">
                  <Button onClick={() => window.location.href = `/ProductInfo/${currentReview.product || ''}`}>
                    View Product
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating Image Section */}
            <div className="image-section md:w-2/5 flex justify-center relative md:absolute md:-right-12 lg:-right-24 md:top-1/2 md:-translate-y-1/2">
              <div className="product-float">
                <div className="image-container relative w-56 md:w-80 lg:w-96 aspect-[3/4] overflow-visible">
                  <div className="absolute inset-0 bg-indigo-400 blur-[80px] opacity-20 rounded-full" />
                  <div className="relative w-full h-full rounded-3xl shadow-2xl border-4 border-white rotate-3 overflow-hidden bg-gray-50 transition-transform duration-500">
                    <img
                      src={productImageUrl}
                      alt={`Review by ${displayName}`}
                      className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                        fadeTrigger ? "opacity-100" : "opacity-0"
                      )}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Indicators */}
      {filteredReviews.length > 1 && (
        <div className="flex justify-center mt-12 md:mt-16 gap-3 md:gap-4">
          {filteredReviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full h-1.5 ${
                index === currentIndex ? 'w-8 md:w-12 bg-indigo-600' : 'w-3 md:w-4 bg-gray-200 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomepageReviewCarousel;